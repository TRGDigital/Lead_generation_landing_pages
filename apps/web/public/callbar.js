/* TRG Digital sticky click-to-call bar.
   A persistent "call us" bar (mobile by default) so visitors can phone in one tap.
   Embed on a client site (allocated in the TRG admin):
   <script src="https://www.trgdigital.co.uk/callbar.js" data-site="SLUG" defer></script> */
(function () {
  var script = document.currentScript;
  if (!script) {
    var ss = document.getElementsByTagName('script');
    for (var i = ss.length - 1; i >= 0; i--) {
      if (ss[i].src && ss[i].src.indexOf('callbar.js') !== -1) { script = ss[i]; break; }
    }
  }
  if (!script) return;
  var site = script.getAttribute('data-site');
  if (!site) return;
  var origin = new URL(script.src).origin;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[<>&"]/g, function (c) {
      return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c];
    });
  }

  fetch(origin + '/api/callbar-config?site=' + encodeURIComponent(site))
    .then(function (r) { return r.json(); })
    .then(function (cfg) {
      if (!cfg || !cfg.enabled) return;
      // Numbers elsewhere on the page are wired up even where the bar itself does not render
      // (it is mobile-only by default), so every tap counts wherever it happens.
      captureAllTelLinks(cfg);
      start(cfg);
    })
    .catch(function () {});

  // Every phone number on the page, not just the bar. Previously only the bar was wired up,
  // so a visitor who tapped the number in the header or footer was never counted at all.
  function captureAllTelLinks(cfg) {
    document.addEventListener('click', function (ev) {
      var a = ev.target && ev.target.closest ? ev.target.closest('a[href^="tel:"]') : null;
      if (!a || a.closest('#trgcb') || a.closest('#trgcb-modal')) return;   // bar handled separately
      onTelClick(ev, cfg, 'page');
    }, true);
  }


  // ── Tracking ──────────────────────────────────────────────────────────────
  function track(payload) {
    try {
      fetch(origin + '/api/organic-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify(payload),
      }).catch(function () {});
    } catch (e) {}
  }

  // ── Is the office open right now? ─────────────────────────────────────────
  // Hours are the home's local (UK) hours, e.g. {"mon":["09:00","17:00"],"sun":null}.
  // Unknown or unset hours means we never claim the office is shut.
  var DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  function officeOpen(cfg) {
    var hours = cfg && cfg.hours;
    if (!hours) return null;                       // not configured: say nothing either way
    try {
      var now = new Date();
      var span = hours[DAYS[now.getDay()]];
      if (!span || !span.length) return false;     // closed all day
      var mins = now.getHours() * 60 + now.getMinutes();
      var toMins = function (t) { var p = String(t).split(':'); return (+p[0]) * 60 + (+p[1] || 0); };
      return mins >= toMins(span[0]) && mins < toMins(span[1]);
    } catch (e) { return null; }
  }

  // When they can expect a call back, so the promise on screen is honest.
  function nextOpenText(cfg) {
    var hours = cfg && cfg.hours;
    if (!hours) return '';
    try {
      var now = new Date();
      for (var i = 0; i < 8; i++) {
        var d = new Date(now.getTime() + i * 86400000);
        var span = hours[DAYS[d.getDay()]];
        if (!span || !span.length) continue;
        if (i === 0) {
          var mins = now.getHours() * 60 + now.getMinutes();
          var open = (+String(span[0]).split(':')[0]) * 60 + (+String(span[0]).split(':')[1] || 0);
          if (mins < open) return 'today from ' + span[0];
          continue;
        }
        return (i === 1 ? 'tomorrow from ' : d.toLocaleDateString(undefined, { weekday: 'long' }) + ' from ') + span[0];
      }
    } catch (e) {}
    return '';
  }

  // ── The overlay ───────────────────────────────────────────────────────────
  // Never blocks the call: "Call now" is always present and always goes straight to the
  // dialler. The call-back form is the second option, and becomes the prominent one when
  // the office is shut (a call then would only ring out) or on desktop, where a tel: link
  // usually does nothing useful anyway.
  function onTelClick(ev, cfg, via) {
    var tel = String(cfg.phone).replace(/[^0-9+]/g, '');
    if (!cfg.callback) {                            // capture off: behave exactly as before
      track({ site: site, trigger: 'call', message: 'Tapped to call ' + cfg.phone, consent: false, pageUrl: location.href, answers: { via: via } });
      return;                                       // let the tel: link proceed
    }
    if (ev) { ev.preventDefault(); ev.stopPropagation(); }
    openModal(cfg, tel, via);
  }


  // ── Enrichment ────────────────────────────────────────────────────────────
  // Asked only AFTER the call back is safely captured. Each answer is saved as it is tapped,
  // so someone who stops half way still leaves behind what they did tell us. Four questions,
  // one tap each: any more and it stops being a conversation and becomes a form.
  var QUESTIONS = [
    { k: 'Who is the care for', a: ['My mum', 'My dad', 'My husband or wife', 'Myself', 'Someone else'] },
    { k: 'When is it needed', a: ['As soon as possible', 'Within a month', 'In 1 to 3 months', 'Just looking ahead'] },
    { k: 'Had a needs assessment', a: ['Yes', 'No', 'Not sure'] },
    { k: 'How it will be paid for', a: ['Self funding', 'Help from the council', 'NHS funded', 'Not sure yet'] },
  ];

  function saveDetail(leadId, answers, final) {
    try {
      fetch(origin + '/api/lead-detail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({ site: site, leadId: leadId, answers: answers, final: !!final }),
      }).catch(function () {});
    } catch (e) {}
  }

  function runEnrichment(box, cfg, leadId, when, open, close) {
    var idx = 0;
    var given = {};
    var color = cfg.color || '#F0532B';

    // Leaving early still counts: send whatever they answered so it reaches the provider.
    var finish = function () {
      if (Object.keys(given).length) saveDetail(leadId, {}, true);
      thanks();
    };
    var thanks = function () {
      box.innerHTML =
        '<div class="done"><h2>Thank you</h2><p class="sub">' + esc(cfg.orgName || 'The team') + ' will call you back'
        + (when && open === false ? ' ' + esc(when) : ' shortly') + '.</p></div>';
      setTimeout(close, 2600);
    };

    var render = function () {
      if (idx >= QUESTIONS.length) { finish(); return; }
      var q = QUESTIONS[idx];
      box.innerHTML =
        '<button class="x" aria-label="Close">&times;</button>'
        + '<p class="step">Question ' + (idx + 1) + ' of ' + QUESTIONS.length + '</p>'
        + '<h2>' + esc(q.k) + '?</h2>'
        + '<p class="sub">This is optional, it just helps them prepare before they ring.</p>'
        + '<div class="opts">' + q.a.map(function (o, i) {
            return '<button class="opt" data-i="' + i + '">' + esc(o) + '</button>';
          }).join('') + '</div>'
        + '<button class="skip">Skip, that’s everything</button>';

      box.querySelectorAll('.opt').forEach(function (b) {
        b.addEventListener('click', function () {
          var val = q.a[+b.getAttribute('data-i')];
          given[q.k] = val;
          var patch = {}; patch[q.k] = val;
          // Saved immediately, one answer at a time.
          saveDetail(leadId, patch, idx === QUESTIONS.length - 1);
          idx++;
          render();
        });
      });
      var sk = box.querySelector('.skip');
      if (sk) sk.addEventListener('click', finish);
      var x = box.querySelector('.x');
      if (x) x.addEventListener('click', finish);
    };
    render();
  }

  function openModal(cfg, tel, via) {
    if (document.getElementById('trgcb-modal')) return;
    var open = officeOpen(cfg);
    var coarse = false;
    try { coarse = (window.matchMedia && matchMedia('(pointer:coarse)').matches) || window.innerWidth < 768; } catch (e) {}
    // Lead with the call-back form when a call would not be answered, or on desktop.
    var preferCallback = open === false || !coarse;
    var when = nextOpenText(cfg);
    var color = cfg.color || '#F0532B';

    var st = document.createElement('style');
    st.id = 'trgcb-modal-style';
    st.textContent =
      '#trgcb-modal{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.5);padding:16px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}'
      + '#trgcb-modal .box{background:#fff;border-radius:16px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3);max-height:90vh;overflow:auto}'
      + '#trgcb-modal h2{margin:0 0 6px;font-size:19px;color:#1c1917}'
      + '#trgcb-modal p.sub{margin:0 0 16px;font-size:14px;color:#57534e;line-height:1.5}'
      + '#trgcb-modal .call{display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;border-radius:10px;padding:13px;font-weight:700;font-size:16px}'
      + '#trgcb-modal .primary{background:' + color + ';color:#fff}'
      + '#trgcb-modal .secondary{background:#fff;color:#1c1917;border:1.5px solid #d6d3d1}'
      + '#trgcb-modal .or{text-align:center;font-size:12px;color:#78716c;margin:12px 0}'
      + '#trgcb-modal label{display:block;font-size:12px;font-weight:600;color:#44403c;margin:10px 0 4px}'
      + '#trgcb-modal input,#trgcb-modal textarea{width:100%;box-sizing:border-box;border:1.5px solid #d6d3d1;border-radius:9px;padding:10px;font-size:16px;font-family:inherit}'
      + '#trgcb-modal .consent{display:flex;gap:8px;align-items:flex-start;margin:12px 0 4px;font-size:12px;color:#57534e;line-height:1.45}'
      + '#trgcb-modal .consent input{width:auto;margin-top:2px}'
      + '#trgcb-modal button.send{width:100%;margin-top:12px;background:' + color + ';color:#fff;border:0;border-radius:10px;padding:13px;font-size:16px;font-weight:700;cursor:pointer}'
      + '#trgcb-modal button.send[disabled]{opacity:.6;cursor:default}'
      + '#trgcb-modal .x{float:right;background:none;border:0;font-size:22px;line-height:1;color:#a8a29e;cursor:pointer;padding:0 0 0 12px}'
      + '#trgcb-modal .closed{background:#fef3c7;color:#92400e;border-radius:8px;padding:8px 10px;font-size:12.5px;margin:0 0 14px}'
      + '#trgcb-modal .done{text-align:center;padding:18px 4px}'
      + '#trgcb-modal .step{margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#a8a29e}'
      + '#trgcb-modal .opts{display:flex;flex-direction:column;gap:8px;margin-top:14px}'
      + '#trgcb-modal .opt{width:100%;text-align:left;background:#fff;border:1.5px solid #d6d3d1;border-radius:10px;padding:13px 14px;font-size:15px;font-family:inherit;color:#1c1917;cursor:pointer}'
      + '#trgcb-modal .opt:hover{border-color:' + color + ';background:#fafaf9}'
      + '#trgcb-modal .skip{display:block;width:100%;margin-top:14px;background:none;border:0;color:#78716c;font-size:13px;text-decoration:underline;cursor:pointer;font-family:inherit}';
    document.head.appendChild(st);

    var callBtn = '<a class="call ' + (preferCallback ? 'secondary' : 'primary') + '" href="tel:' + esc(tel) + '" data-act="call">Call ' + esc(cfg.phone) + ' now</a>';
    var form =
      '<form id="trgcb-form">'
      + '<label for="trgcb-n">Your name</label><input id="trgcb-n" name="name" autocomplete="name" required>'
      + '<label for="trgcb-p">Your phone number</label><input id="trgcb-p" name="phone" type="tel" autocomplete="tel" required>'
      + '<label for="trgcb-m">Anything they should know (optional)</label><textarea id="trgcb-m" name="message" rows="2"></textarea>'
      + '<div class="consent"><input type="checkbox" id="trgcb-c" required><label for="trgcb-c" style="font-weight:400;margin:0">Yes, please pass my details to ' + esc(cfg.orgName || 'the team') + ' so they can call me back.</label></div>'
      + '<button class="send" type="submit">Request a call back</button>'
      + '</form>';

    var closedNote = open === false
      ? '<p class="closed">The office is closed at the moment' + (when ? ', reopening ' + esc(when) : '') + '. Leave your number and they will call you back.</p>'
      : '';

    var wrap = document.createElement('div');
    wrap.id = 'trgcb-modal';
    wrap.innerHTML =
      '<div class="box" role="dialog" aria-modal="true" aria-label="Contact options">'
      + '<button class="x" aria-label="Close">&times;</button>'
      + '<h2>' + (preferCallback ? 'Ask for a call back' : 'Speak to the team') + '</h2>'
      + '<p class="sub">' + esc(cfg.callbackNote || 'Call now, or leave your number and they will ring you back.') + '</p>'
      + closedNote
      + (preferCallback ? form + '<p class="or">or</p>' + callBtn : callBtn + '<p class="or">or ask them to call you back</p>' + form)
      + '</div>';
    document.documentElement.appendChild(wrap);

    var close = function () {
      try { wrap.remove(); st.remove(); } catch (e) {}
    };
    wrap.addEventListener('click', function (e) { if (e.target === wrap || e.target.className === 'x') close(); });

    // "Call now" is a real tel: link — we record the tap and then get out of the way.
    var a = wrap.querySelector('a[data-act="call"]');
    if (a) a.addEventListener('click', function () {
      track({ site: site, trigger: 'call', message: 'Tapped to call ' + cfg.phone, consent: false, pageUrl: location.href, answers: { via: via, office: String(open) } });
      setTimeout(close, 300);
    });

    var f = wrap.querySelector('#trgcb-form');
    if (f) f.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = f.querySelector('button.send');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      var box = wrap.querySelector('.box');

      // Capture first. The lead is saved and emailed on this request alone, so the extra
      // questions below can never cost us the lead.
      fetch(origin + '/api/organic-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          site: site,
          trigger: 'callback',
          // Read by id, not f.name: on a form element `.name` is the form's own name
          // attribute, not the field called "name", so f.name.value threw and the request
          // was never sent.
          name: (f.querySelector('#trgcb-n') || {}).value.trim(),
          phone: (f.querySelector('#trgcb-p') || {}).value.trim(),
          message: ((f.querySelector('#trgcb-m') || {}).value || '').trim() || null,
          consent: true,
          pageUrl: location.href,
          answers: { via: via, office: open === false ? 'closed' : open === true ? 'open' : 'unknown' },
        }),
      })
        .then(function (r) { return r.json(); })
        .then(function (out) {
          if (box && out && out.id) runEnrichment(box, cfg, out.id, when, open, close);
          else if (box) { box.innerHTML = '<div class="done"><h2>Thank you</h2><p class="sub">' + esc(cfg.orgName || 'The team') + ' will call you back' + (when && open === false ? ' ' + esc(when) : ' shortly') + '.</p></div>'; setTimeout(close, 3000); }
        })
        .catch(function () {
          if (box) { box.innerHTML = '<div class="done"><h2>Thank you</h2><p class="sub">' + esc(cfg.orgName || 'The team') + ' will call you back shortly.</p></div>'; setTimeout(close, 3000); }
        });
    });
  }

  function start(cfg) {
    if (!document.body) { document.addEventListener('DOMContentLoaded', function () { start(cfg); }); return; }
    var coarse = false;
    try { coarse = (window.matchMedia && matchMedia('(pointer:coarse)').matches) || window.innerWidth < 768; } catch (e) {}
    if (!coarse && !cfg.desktop) return; // mobile only unless desktop is enabled

    if (document.getElementById('trgcb-style')) return;
    var color = cfg.color || '#F0532B';
    var tel = String(cfg.phone).replace(/[^0-9+]/g, '');

    var css =
      '#trgcb{position:fixed;left:0;right:0;bottom:0;z-index:2147482000;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}'
      + '#trgcb a{display:flex;align-items:center;gap:12px;justify-content:center;background:' + color + ';color:#fff;text-decoration:none;padding:12px 16px;box-shadow:0 -6px 20px rgba(0,0,0,.18)}'
      + '#trgcb .t{display:flex;flex-direction:column;line-height:1.15;text-align:left}'
      + '#trgcb .l{font-size:12px;opacity:.9}'
      + '#trgcb .n{font-size:18px;font-weight:700;letter-spacing:.01em}'
      + '#trgcb .cta{margin-left:6px;border:1px solid rgba(255,255,255,.6);border-radius:999px;padding:6px 14px;font-size:13px;font-weight:700}'
      + '@media(min-width:768px){#trgcb{left:auto;right:20px;bottom:20px}#trgcb a{border-radius:999px;padding:12px 20px;box-shadow:0 10px 30px rgba(0,0,0,.22)}}';
    var st = document.createElement('style');
    st.id = 'trgcb-style';
    st.textContent = css;
    document.head.appendChild(st);

    var bar = document.createElement('div');
    bar.id = 'trgcb';
    bar.innerHTML =
      '<a href="tel:' + esc(tel) + '" aria-label="Call ' + esc(cfg.phone) + '">'
      + '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1z"/></svg>'
      + '<span class="t"><span class="l">' + esc(cfg.label || 'Speak to our team') + '</span><span class="n">' + esc(cfg.phone) + '</span></span>'
      + '<span class="cta">Call</span>'
      + '</a>';
    document.documentElement.appendChild(bar);

    // The bar's own link goes through the same handler as every other number on the page.
    var link = bar.querySelector('a');
    if (link) link.addEventListener('click', function (ev) { onTelClick(ev, cfg, 'callbar'); });

    // Keep content clear of the bar on mobile (where it spans full width).
    if (coarse) {
      try { document.body.style.paddingBottom = (bar.offsetHeight || 60) + 'px'; } catch (e) {}
    }
  }
})();

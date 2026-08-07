/* TRG Digital lead-capture overlay widget.
   Embed on a client site with:
   <script src="https://lead-generation-landing-pages.vercel.app/embed.js" data-site="SLUG" defer></script>
   Config + display rules are controlled from the TRG admin Websites view. */
(function () {
  var script = document.currentScript;
  if (!script) {
    var ss = document.getElementsByTagName('script');
    for (var i = 0; i < ss.length; i++) {
      if (ss[i].src && ss[i].src.indexOf('embed.js') !== -1) { script = ss[i]; break; }
    }
  }
  if (!script) return;
  var site = script.getAttribute('data-site');
  if (!site) return;
  var preview = script.getAttribute('data-preview') === '1';
  var origin = new URL(script.src).origin;

  var STATE_KEY = 'trglo_state_' + site;
  var PAGES_KEY = 'trglo_pages_' + site;
  var SESSION_KEY = 'trglo_seen_' + site;

  function getState() { try { return JSON.parse(localStorage.getItem(STATE_KEY)) || {}; } catch (e) { return {}; } }
  function setState(s) { try { localStorage.setItem(STATE_KEY, JSON.stringify(s)); } catch (e) {} }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[<>&"]/g, function (c) {
      return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c];
    });
  }

  // Submit a lead to the API. Shared by the form and the WebMCP tool.
  function submitLead(d) {
    return fetch(origin + '/api/organic-leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        site: site,
        name: d.name || '',
        email: d.email || '',
        phone: d.phone || '',
        message: d.message || '',
        trigger: d.via || 'popup',
        pageUrl: location.href,
        consent: d.consent !== false,
        answers: d.answers || undefined,
        website: d.website || '',
      }),
    }).then(function (r) { return r.json(); });
  }

  // Pseudonymous per-browser id so the admin can count unique visitors (no PII).
  var VID_KEY = 'trglo_vid_' + site;
  function getVid() {
    try {
      var v = localStorage.getItem(VID_KEY);
      if (!v) { v = 'v' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); localStorage.setItem(VID_KEY, v); }
      return v;
    } catch (e) { return ''; }
  }
  function deviceType() {
    try { return ((window.matchMedia && matchMedia('(pointer:coarse)').matches) || window.innerWidth < 768) ? 'mobile' : 'desktop'; } catch (e) { return 'desktop'; }
  }
  // Fire-and-forget engagement event (impression / start / close / submit). keepalive so it
  // still sends if the visitor navigates away right after closing.
  function track(event, via, detail) {
    try {
      var payload = {
        site: site, event: event, via: via || '',
        pageUrl: location.href, path: location.pathname || '/',
        device: deviceType(), vid: getVid(),
      };
      if (detail) {
        if (typeof detail.step === 'number') payload.step = detail.step;
        if (detail.question) payload.question = String(detail.question).slice(0, 300);
        if (detail.option) payload.option = String(detail.option).slice(0, 300);
      }
      fetch(origin + '/api/overlay-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify(payload),
      }).catch(function () {});
    } catch (e) {}
  }

  // WebMCP: let AI agents submit an enquiry directly (feature-detected, no-op otherwise).
  function registerWebMcp(cfg) {
    try {
      var mc = document.modelContext;
      if (!mc || typeof mc.registerTool !== 'function') return;
      mc.registerTool({
        name: 'request_callback',
        title: 'Request a callback',
        description: 'Submit your name and contact details to request a callback or make an enquiry'
          + (cfg.heading ? ' (' + cfg.heading + ')' : '') + '. Provide at least an email address or phone number.',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Full name' },
            email: { type: 'string', description: 'Email address' },
            phone: { type: 'string', description: 'Phone number' },
            message: { type: 'string', description: 'Optional details about the enquiry' },
          },
        },
        annotations: { readOnlyHint: false },
        execute: function (input) {
          input = input || {};
          if (!input.name && !input.email && !input.phone) return { ok: false, error: 'Please provide a name, email or phone number.' };
          return submitLead({ name: input.name, email: input.email, phone: input.phone, message: input.message, consent: true, via: 'agent' })
            .then(function () { return { ok: true, message: 'Enquiry submitted. The team will be in touch.' }; })
            .catch(function () { return { ok: false, error: 'Could not submit right now.' }; });
        },
      });
    } catch (e) {}
  }

  var pages = 1;
  try { pages = (parseInt(localStorage.getItem(PAGES_KEY), 10) || 0) + 1; localStorage.setItem(PAGES_KEY, String(pages)); } catch (e) {}

  var visits = 1;
  try {
    var VCOUNT = 'trglo_vcount_' + site, VSESS = 'trglo_vsess_' + site;
    if (!sessionStorage.getItem(VSESS)) {
      visits = (parseInt(localStorage.getItem(VCOUNT), 10) || 0) + 1;
      localStorage.setItem(VCOUNT, String(visits));
      sessionStorage.setItem(VSESS, '1');
    } else {
      visits = parseInt(localStorage.getItem(VCOUNT), 10) || 1;
    }
  } catch (e) {}

  function matchPath(path, pat) {
    pat = pat.toLowerCase(); path = path.toLowerCase();
    if (pat.indexOf('*') !== -1) {
      try { return new RegExp('^' + pat.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$').test(path); } catch (e) { return false; }
    }
    return path.indexOf(pat) !== -1;
  }
  function parsePaths(s) { return (s || '').split(/[\n,]/).map(function (x) { return x.trim(); }).filter(Boolean); }

  fetch(origin + '/api/overlay-config?site=' + encodeURIComponent(site) + (preview ? '&preview=1' : ''))
    .then(function (r) { return r.json(); })
    .then(function (cfg) {
      if (!cfg) return;
      // Preview mode (admin "Preview pop"): show immediately, skip all display rules and
      // never write frequency state, so it can be reopened freely.
      if (preview) { injectCss(); track('preview', 'preview'); render(cfg, 'preview'); return; }
      if (!cfg.enabled) return;
      registerWebMcp(cfg); // agents can submit even if the popup is not shown to this visitor
      var st = getState();
      if (st.done) return;
      try { if (sessionStorage.getItem(SESSION_KEY)) return; } catch (e) {}
      init(cfg);
    })
    .catch(function () {});

  function init(cfg) {
    var st = getState();
    var coarse = false;
    try { coarse = (window.matchMedia && matchMedia('(pointer:coarse)').matches) || window.innerWidth < 768; } catch (e) {}
    var dev = cfg.devices || 'all';
    if (dev === 'desktop' && coarse) return;
    if (dev === 'mobile' && !coarse) return;

    if (cfg.audience === 'new' && visits > 1) return;
    if (cfg.audience === 'returning' && visits <= 1) return;

    var path = location.pathname || '/';
    var exc = parsePaths(cfg.excludePaths);
    if (exc.length && exc.some(function (p) { return matchPath(path, p); })) return;
    var inc = parsePaths(cfg.includePaths);
    if (inc.length && !inc.some(function (p) { return matchPath(path, p); })) return;

    if (pages < (cfg.minPages || 1)) return;
    if (cfg.maxShows && (st.shows || 0) >= cfg.maxShows) return;
    if (cfg.cooldownDays && st.last && (Date.now() - st.last) < cfg.cooldownDays * 86400000) return;

    var delay = (cfg.delaySeconds || 0) * 1000;
    var armed = false;
    var shown = false;
    var trigger = cfg.trigger || 'exit';
    var exitThreshold = cfg.exitSensitivity === 'high' ? 20 : cfg.exitSensitivity === 'low' ? 0 : 10;
    var timeoutTimer;

    function show(via) {
      if (shown) return;
      shown = true;
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {}
      var s = getState();
      s.shows = (s.shows || 0) + 1;
      s.last = Date.now();
      setState(s);
      track('impression', via);
      cleanup();
      render(cfg, via);
    }
    function onExit(e) {
      if (!armed) return;
      var to = e.relatedTarget || e.toElement;
      if (!to && (e.clientY == null || e.clientY <= exitThreshold)) show('exit');
    }
    function onScroll() {
      if (!armed) return;
      var h = document.documentElement;
      var max = (h.scrollHeight - h.clientHeight) || 1;
      var pct = ((h.scrollTop || document.body.scrollTop) / max) * 100;
      if (pct >= (cfg.scrollPct || 50)) show('scroll');
    }
    function cleanup() {
      document.removeEventListener('mouseout', onExit);
      window.removeEventListener('scroll', onScroll);
      if (timeoutTimer) clearTimeout(timeoutTimer);
    }

    if (trigger === 'exit' || trigger === 'both') document.addEventListener('mouseout', onExit);
    if (trigger === 'scroll' || trigger === 'both') window.addEventListener('scroll', onScroll, { passive: true });
    if (cfg.timeoutSeconds && cfg.timeoutSeconds > 0) {
      timeoutTimer = setTimeout(function () { show('timer'); }, Math.max(delay, cfg.timeoutSeconds * 1000));
    }
    setTimeout(function () { armed = true; }, delay);
  }

  function injectCss() {
    if (document.getElementById('trglo-style')) return;
    var css = '.trglo-ov{position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;background:rgba(20,18,15,.6);padding:16px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;animation:trglo-fade .2s ease}'
      + '@keyframes trglo-fade{from{opacity:0}to{opacity:1}}'
      + '@keyframes trglo-ping{75%,100%{transform:scale(2.4);opacity:0}}'
      + '.trglo-card{position:relative;width:100%;max-width:420px;background:#fff;border-radius:16px;padding:28px;box-shadow:0 24px 60px rgba(0,0,0,.3);color:#2a2620}'
      + '.trglo-card.trglo-wide{max-width:780px;padding:0;overflow:hidden}'
      + '.trglo-grid{display:flex;align-items:stretch}'
      + '.trglo-main{flex:1 1 50%;padding:30px;min-width:0}'
      + '.trglo-img{flex:1 1 50%;background-size:cover;background-position:center;min-height:440px}'
      + '.trglo-close{position:absolute;top:12px;right:12px;z-index:2;display:flex;align-items:center;justify-content:center;width:30px;height:30px;border:0;border-radius:50%;background:rgba(255,255,255,.85);font-size:1.25rem;line-height:1;color:#57534e;cursor:pointer}'
      + '.trglo-logo{display:block;max-height:46px;width:auto;margin:0 0 16px}'
      + '.trglo-logo-top{display:block;max-height:38px;width:auto;margin:0 auto 18px}'
      + '.trglo-progress{height:6px;background:rgba(0,0,0,.08);border-radius:99px;overflow:hidden;margin:0 0 18px}'
      + '.trglo-bar{height:100%;background:var(--trglo-c,#F0532B);transition:width .3s ease}'
      + '.trglo-step-label{margin:0 0 8px;font-size:.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#9a958c}'
      + '.trglo-q{margin:0 0 14px;font-size:1.1875rem;font-weight:700;line-height:1.25}'
      + '.trglo-opts{display:flex;flex-direction:column;gap:8px}'
      + '.trglo-opt{text-align:left;border:1px solid #e3e0da;border-radius:10px;padding:12px 14px;font-size:.9375rem;color:#2a2620;background:#fff;cursor:pointer}'
      + '.trglo-opt:hover{border-color:var(--trglo-c,#F0532B);background:rgba(0,0,0,.025)}'
      + '.trglo-back{margin-top:12px;background:none;border:0;color:#9a958c;font-size:.8125rem;cursor:pointer;padding:0}'
      + '.trglo-h{margin:0 0 8px;font-size:1.375rem;font-weight:700;line-height:1.2}'
      + '.trglo-p{margin:0 0 18px;font-size:.875rem;line-height:1.5;color:#57534e}'
      + '.trglo-main form{display:flex;flex-direction:column;gap:10px}'
      + '.trglo-main input:not([type=checkbox]){width:100%;box-sizing:border-box;border:1px solid #e3e0da;border-radius:9px;padding:11px 13px;font-size:.9375rem;color:#2a2620;background:#fff}'
      + '.trglo-main input:not([type=checkbox]):focus{outline:none;border-color:var(--trglo-c,#F0532B);box-shadow:0 0 0 3px rgba(0,0,0,.08)}'
      + '.trglo-consent{display:flex;align-items:flex-start;gap:8px;font-size:.78rem;line-height:1.45;color:#57534e;cursor:pointer;margin:2px 0}'
      + '.trglo-consent input{margin:1px 0 0;width:16px;height:16px;flex-shrink:0;accent-color:var(--trglo-c,#F0532B)}'
      + '.trglo-consent.trglo-need{color:var(--trglo-c,#F0532B)}'
      + '.trglo-hp{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important}'
      + '.trglo-main button[type=submit]{margin-top:4px;background:var(--trglo-c,#F0532B);color:#fff;border:0;border-radius:9px;padding:12px;font-size:.9375rem;font-weight:700;cursor:pointer}'
      + '.trglo-main button[type=submit]:hover{filter:brightness(.93)}'
      + '.trglo-main button[type=submit]:disabled{opacity:.6;cursor:default}'
      + '.trglo-success{padding:28px 8px;text-align:center;font-size:1rem;font-weight:600;color:#2a2620}'
      // Mirrors the host site's accessibility bar: readable font + high contrast.
      + '.trglo-readable .trglo-card{font-family:Verdana,Tahoma,Arial,sans-serif!important}'
      + '.trglo-readable .trglo-q,.trglo-readable .trglo-h,.trglo-readable .trglo-p,.trglo-readable .trglo-opt,.trglo-readable .trglo-main input,.trglo-readable .trglo-consent{letter-spacing:.02em;line-height:1.7!important}'
      + '.trglo-hc .trglo-card{background:#000!important;color:#fff!important}'
      + '.trglo-hc .trglo-h,.trglo-hc .trglo-q,.trglo-hc .trglo-p,.trglo-hc .trglo-step-label,.trglo-hc .trglo-consent,.trglo-hc .trglo-back,.trglo-hc .trglo-success{color:#fff!important}'
      + '.trglo-hc .trglo-opt{background:#000!important;color:#fff!important;border-color:#fff!important}'
      + '.trglo-hc .trglo-opt:hover{background:#1a1a1a!important}'
      + '.trglo-hc .trglo-main input:not([type=checkbox]){background:#000!important;color:#fff!important;border-color:#fff!important}'
      + '.trglo-hc .trglo-close{background:#fff!important;color:#000!important}'
      + '.trglo-hc .trglo-main button[type=submit]{background:#ff0!important;color:#000!important}'
      + '.trglo-hc .trglo-bar{background:#ff0!important}'
      + '.trglo-hc .trglo-progress{background:#333!important}'
      + '@media(max-width:640px){.trglo-img{display:none}.trglo-card.trglo-wide{max-width:420px}.trglo-main{padding:28px}}';
    var style = document.createElement('style');
    style.id = 'trglo-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function render(cfg, via) {
    injectCss();
    // Engagement tracking (skipped in admin preview). 'start' fires on first interaction,
    // 'close' on dismiss without submitting, 'submit' on a completed enquiry.
    var doTrack = via !== 'preview';
    var started = false, submitted = false, closed = false;
    function t(ev, detail) { if (doTrack) track(ev, via, detail); }
    function markStart() { if (!started) { started = true; t('start'); } }
    var gamified = !!cfg.gamified;
    var hasImg = !!cfg.image;
    var answers = {};
    var stepIdx = 0;
    var DEFAULT_Q = [
      { q: 'What type of care are you looking for?', options: ['Residential', 'Nursing', 'Dementia', 'Respite', 'Home care', 'Not sure yet'] },
      { q: 'Who is it for?', options: ['My parent', 'My partner', 'Myself', 'Another relative'] },
      { q: 'When might you need it?', options: ['As soon as possible', 'Within a month', 'In a few months', 'Just researching'] },
    ];
    var qs = (cfg.questions && cfg.questions.length) ? cfg.questions : DEFAULT_Q;
    var QUESTIONS = gamified
      ? qs.filter(function (x) { return x && x.q && x.options && x.options.length; }).map(function (x) { return { key: x.q, q: x.q, options: x.options }; })
      : [];
    var totalSteps = QUESTIONS.length + 1;

    var ov = document.createElement('div');
    ov.className = 'trglo-ov';
    if (cfg.color) ov.style.setProperty('--trglo-c', cfg.color);
    ov.innerHTML =
      '<div class="trglo-card' + (hasImg ? ' trglo-wide' : '') + '" role="dialog" aria-modal="true" aria-label="Enquiry">'
      + '<button class="trglo-close" aria-label="Close">&times;</button>'
      + (hasImg
        ? '<div class="trglo-grid"><div class="trglo-main"></div><div class="trglo-img" role="img" aria-label="" style="background-image:url(\'' + esc(cfg.image) + '\')"></div></div>'
        : '<div class="trglo-main"></div>')
      + '</div>';
    document.body.appendChild(ov);

    var panel = ov.querySelector('.trglo-main');

    // Mirror the host site's accessibility settings onto the pop so it matches the page.
    // Text size scales automatically (the pop now uses rem); high-contrast and readable
    // are the standard `hc` / `readable` classes on <html>, kept in sync live.
    function syncA11y() {
      var cl = document.documentElement.classList;
      ov.classList.toggle('trglo-hc', cl.contains('hc'));
      ov.classList.toggle('trglo-readable', cl.contains('readable'));
    }
    syncA11y();
    window.addEventListener('cw-a11y', syncA11y);
    var a11yMo;
    try {
      a11yMo = new MutationObserver(syncA11y);
      a11yMo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    } catch (e) {}

    function close() {
      if (closed) return;
      closed = true;
      if (!submitted) t('close');
      if (ov.parentNode) ov.parentNode.removeChild(ov);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('cw-a11y', syncA11y);
      if (a11yMo) a11yMo.disconnect();
    }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('.trglo-close').addEventListener('click', close);
    function onKey(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {
        var f = Array.prototype.filter.call(
          ov.querySelectorAll('button, input:not([type=hidden]), [tabindex]:not([tabindex="-1"])'),
          function (el) { return el.offsetParent !== null && el.getAttribute('aria-hidden') !== 'true'; }
        );
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', onKey);

    function progressHtml() {
      if (!gamified) return '';
      var pct = Math.round((stepIdx / totalSteps) * 100);
      return '<div class="trglo-progress"><div class="trglo-bar" style="width:' + pct + '%"></div></div>';
    }

    // Small, centred logo at the top of the panel on the gamified + side-image layout,
    // so the quiz steps carry the client's branding.
    function topLogo() {
      return (cfg.logo && gamified && hasImg) ? '<img class="trglo-logo-top" src="' + esc(cfg.logo) + '" alt="" />' : '';
    }

    // Live room-availability badge (client-updated). Only shown when actively available.
    function availHtml() {
      if (!cfg.showAvailability) return '';
      var s = cfg.availabilityStatus;
      if (s !== 'available' && s !== 'limited') return '';
      var color = s === 'available' ? '#16a34a' : '#d97706';
      var label = (cfg.roomsAvailable > 0)
        ? cfg.roomsAvailable + (cfg.roomsAvailable === 1 ? ' room available' : ' rooms available')
        : (s === 'available' ? 'Rooms available' : 'Limited availability');
      var note = cfg.availabilityNote ? ' · ' + esc(cfg.availabilityNote) : '';
      return '<span style="display:inline-flex;align-items:center;gap:7px;white-space:nowrap;max-width:100%;border:1px solid ' + color
        + '40;background:' + color + '14;color:' + color
        + ';font-weight:600;font-size:.8125rem;border-radius:999px;padding:4px 11px;margin-bottom:10px">'
        + '<span style="position:relative;display:inline-flex;width:7px;height:7px;flex:0 0 auto">'
        + '<span style="position:absolute;inset:0;border-radius:999px;background:' + color + ';opacity:.65;animation:trglo-ping 1.5s cubic-bezier(0,0,.2,1) infinite"></span>'
        + '<span style="position:relative;display:inline-block;width:7px;height:7px;border-radius:999px;background:' + color + '"></span>'
        + '</span>'
        + esc(label) + note + '</span>';
    }

    function renderStep() {
      if (gamified && stepIdx < QUESTIONS.length) {
        var q = QUESTIONS[stepIdx];
        panel.innerHTML = topLogo() + availHtml() + progressHtml()
          + '<p class="trglo-step-label">Question ' + (stepIdx + 1) + ' of ' + totalSteps + '</p>'
          + '<h2 class="trglo-q">' + esc(q.q) + '</h2>'
          + '<div class="trglo-opts">' + q.options.map(function (o) { return '<button type="button" class="trglo-opt">' + esc(o) + '</button>'; }).join('') + '</div>'
          + (stepIdx > 0 ? '<button type="button" class="trglo-back">&#8592; Back</button>' : '');
        Array.prototype.forEach.call(panel.querySelectorAll('.trglo-opt'), function (b) {
          b.addEventListener('click', function () { markStart(); answers[q.key] = b.textContent; t('question', { step: stepIdx + 1, question: q.q, option: b.textContent }); stepIdx++; renderStep(); });
        });
        var back = panel.querySelector('.trglo-back');
        if (back) back.addEventListener('click', function () { stepIdx--; renderStep(); });
        var fo = panel.querySelector('.trglo-opt'); if (fo) try { fo.focus(); } catch (e) {}
        return;
      }

      // Contact step
      panel.innerHTML = topLogo() + progressHtml()
        + ((gamified && hasImg) ? '' : (cfg.logo ? '<img class="trglo-logo" src="' + esc(cfg.logo) + '" alt="" />' : ''))
        + availHtml()
        + '<h2 class="trglo-h">' + esc(cfg.heading) + '</h2>'
        + '<p class="trglo-p">' + esc(cfg.body) + '</p>'
        + '<form novalidate>'
        + '<input name="name" placeholder="Your name" aria-label="Your name" autocomplete="name" />'
        + '<input name="email" type="email" placeholder="Email address" aria-label="Email address" autocomplete="email" />'
        + '<input name="phone" placeholder="Phone number" aria-label="Phone number" autocomplete="tel" />'
        + '<input name="website" class="trglo-hp" tabindex="-1" autocomplete="off" aria-hidden="true" />'
        + '<label class="trglo-consent"><input type="checkbox" name="consent" /><span>I am happy to be contacted about my enquiry.</span></label>'
        + '<button type="submit">' + esc(cfg.button) + '</button>'
        + '</form>';
      var form = panel.querySelector('form');
      form.addEventListener('focusin', markStart);
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        markStart();
        var btn = form.querySelector('button[type=submit]');
        if (!form.name.value && !form.email.value && !form.phone.value) return;
        if (form.consent && !form.consent.checked) {
          var cl = panel.querySelector('.trglo-consent');
          if (cl) cl.className = 'trglo-consent trglo-need';
          return;
        }
        btn.disabled = true;
        btn.textContent = 'Sending…';
        submitLead({
          name: form.name.value, email: form.email.value, phone: form.phone.value,
          via: via, consent: form.consent ? form.consent.checked : true,
          answers: Object.keys(answers).length ? answers : undefined,
          website: form.website.value,
        })
          .then(function () {
            submitted = true; t('submit');
            var s = getState(); s.done = true; setState(s);
            panel.innerHTML = '<div class="trglo-success">' + esc(cfg.success) + '</div>';
            setTimeout(close, 3500);
          })
          .catch(function () { btn.disabled = false; btn.textContent = cfg.button; });
      });
      var fi = panel.querySelector('input[name=name]'); if (fi) try { fi.focus(); } catch (e) {}
    }

    renderStep();
  }
})();

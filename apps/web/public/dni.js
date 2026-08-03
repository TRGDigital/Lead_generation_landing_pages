/* TRG Digital — Dynamic Number Insertion (call tracking).
   Swaps the site's phone number for a TRG tracking number so calls from the
   website are measurable. JS-only swap: the static HTML, schema markup and
   Google Business Profile keep the canonical number (local-SEO/NAP safe).
   Embed on a client site (configured in the TRG admin):
   <script src="https://www.trgdigital.co.uk/dni.js" data-site="SLUG" defer></script> */
(function () {
  var script = document.currentScript;
  if (!script) {
    var ss = document.getElementsByTagName('script');
    for (var i = ss.length - 1; i >= 0; i--) {
      if (ss[i].src && ss[i].src.indexOf('dni.js') !== -1) { script = ss[i]; break; }
    }
  }
  if (!script) return;
  var site = script.getAttribute('data-site');
  if (!site) return;
  var origin = new URL(script.src).origin;

  fetch(origin + '/api/dni/config?site=' + encodeURIComponent(site))
    .then(function (r) { return r.json(); })
    .then(function (cfg) {
      if (cfg && cfg.enabled && cfg.tel && cfg.display) start(cfg);
    })
    .catch(function () {});

  // Digits-only form of a number, with a UK-friendly +44 <-> 0 equivalence key.
  function key(num) {
    var d = String(num || '').replace(/[^0-9+]/g, '');
    if (d.indexOf('+44') === 0) d = '0' + d.slice(3);
    return d;
  }

  function start(cfg) {
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', function () { start(cfg); });
      return;
    }

    var telHref = 'tel:' + String(cfg.tel).replace(/[^0-9+]/g, '');
    var targets = {}; // digit-key -> true, for every canonical format
    var patterns = [];
    (cfg.replace || []).forEach(function (n) {
      var k = key(n);
      if (k && !targets[k]) { targets[k] = true; patterns.push(n); }
    });

    function swapTelLinks(root) {
      var links = (root || document).querySelectorAll('a[href^="tel:"]');
      for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute('href') || '';
        var k = key(href.slice(4));
        // Swap links pointing at a canonical number; if no formats were
        // configured, swap every tel: link on the page.
        if (patterns.length === 0 || targets[k]) {
          links[i].setAttribute('href', telHref);
          replaceInTextNodes(links[i]);
        }
      }
    }

    function replaceInTextNodes(root) {
      if (patterns.length === 0) return;
      var walker = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT, null);
      var node;
      var edits = [];
      while ((node = walker.nextNode())) {
        var text = node.nodeValue;
        if (!text) continue;
        var changed = false;
        for (var i = 0; i < patterns.length; i++) {
          if (text.indexOf(patterns[i]) !== -1) {
            text = text.split(patterns[i]).join(cfg.display);
            changed = true;
          }
        }
        if (changed) edits.push([node, text]);
      }
      for (var j = 0; j < edits.length; j++) edits[j][0].nodeValue = edits[j][1];
    }

    function run() {
      try {
        swapTelLinks(document);
        replaceInTextNodes(document.body);
      } catch (e) {}
    }

    run();
    // Re-run briefly for late-rendered content (SPAs, lazy sections).
    var runs = 0;
    var timer = setInterval(function () {
      run();
      if (++runs >= 5) clearInterval(timer);
    }, 1000);
  }
})();

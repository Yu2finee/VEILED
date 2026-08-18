(()=>{
  // Guard against concurrent Owner Panel renders. platform.js can receive several
  // DOM/auth callbacks at nearly the same time; only the first Control Center
  // insertion should win.
  const nativeInsertAdjacentHTML = Element.prototype.insertAdjacentHTML;
  Element.prototype.insertAdjacentHTML = function(position, html) {
    if (typeof html === 'string' && html.includes('id="advancedOwnerTools"')) {
      const existing = document.getElementById('advancedOwnerTools');
      if (existing) return;
    }
    return nativeInsertAdjacentHTML.call(this, position, html);
  };

  // Clean up any duplicates left by an older cached build, then keep exactly one.
  const cleanup = () => {
    const panels = [...document.querySelectorAll('#advancedOwnerTools')];
    panels.slice(1).forEach(panel => panel.remove());

    // The platform pages/nav are also singleton UI pieces.
    ['academy','witchProfile','ownerInbox','researchLibrary'].forEach(id => {
      const pages = [...document.querySelectorAll(`#${id}`)];
      pages.slice(1).forEach(page => page.remove());
      const navs = [...document.querySelectorAll(`.nav[data-page="${id}"]`)];
      navs.slice(1).forEach(nav => nav.remove());
    });

    const toggles = [...document.querySelectorAll('#researchToggle')];
    toggles.slice(1).forEach(toggle => toggle.remove());
  };

  cleanup();
  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      cleanup();
    });
  });
  observer.observe(document.documentElement, {childList:true, subtree:true});

  // Tawk.to live chat widget for VEILED.
  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = new Date();
  if (!document.querySelector('script[data-veiled-tawk]')) {
    const s1 = document.createElement('script');
    const s0 = document.getElementsByTagName('script')[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/6a83f5febc557a344a5e2489/1k09nhqgl';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s1.setAttribute('data-veiled-tawk', 'true');
    s0.parentNode.insertBefore(s1, s0);
  }
})();
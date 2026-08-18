(()=>{
  const cleanProfile = () => {
    const input = document.getElementById('pfAvatar');
    if (input) {
      // Keep a hidden empty input in the DOM because the existing save routine
      // safely reads it, but members no longer get an upload control.
      const label = input.closest('label');
      if (label) label.style.display = 'none';
      input.value = '';
      input.tabIndex = -1;
      input.setAttribute('aria-hidden','true');
    }

    const preview = document.querySelector('#profileBody .avatar-ring');
    if (preview && preview.querySelector('img')) {
      const sigil = document.getElementById('pfSigil')?.value?.trim() || '✦';
      preview.innerHTML = '';
      preview.textContent = sigil;
    }
  };

  cleanProfile();
  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      cleanProfile();
    });
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
})();
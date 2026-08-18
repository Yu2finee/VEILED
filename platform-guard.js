(()=>{
  const nativeInsertAdjacentHTML=Element.prototype.insertAdjacentHTML;
  Element.prototype.insertAdjacentHTML=function(position,html){
    if(typeof html==='string'&&html.includes('id="advancedOwnerTools"')&&document.getElementById('advancedOwnerTools'))return;
    return nativeInsertAdjacentHTML.call(this,position,html);
  };
  const cleanup=()=>{
    ['advancedOwnerTools','academy','witchProfile','ownerInbox','researchLibrary','gathering'].forEach(id=>{const els=[...document.querySelectorAll('#'+id)];els.slice(1).forEach(x=>x.remove())});
    ['academy','witchProfile','ownerInbox','researchLibrary','gathering'].forEach(id=>{const els=[...document.querySelectorAll(`.nav[data-page="${id}"]`)];els.slice(1).forEach(x=>x.remove())});
    const toggles=[...document.querySelectorAll('#researchToggle')];toggles.slice(1).forEach(x=>x.remove());
  };
  cleanup();let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;cleanup()})}).observe(document.documentElement,{childList:true,subtree:true});
  // VEILED is local-only now, so the former realtime Gathering chat is not loaded.
  // Tawk.to remains an optional external support widget and is unrelated to Supabase.
  window.Tawk_API=window.Tawk_API||{};window.Tawk_LoadStart=new Date();
  if(!document.querySelector('script[data-veiled-tawk]')){const s1=document.createElement('script'),s0=document.getElementsByTagName('script')[0];s1.async=true;s1.src='https://embed.tawk.to/6a83f5febc557a344a5e2489/1k09nhqgl';s1.charset='UTF-8';s1.setAttribute('crossorigin','*');s1.setAttribute('data-veiled-tawk','true');s0.parentNode.insertBefore(s1,s0)}
})();
(()=>{
  const sb=window.VEILED_SUPABASE;
  if(!sb)return;
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let session=null,currentProfile=null,channel=null,messages=[],profiles=new Map(),opening=false;

  function toast(msg){
    const old=document.querySelector('.platform-toast');if(old)old.remove();
    const d=document.createElement('div');d.className='platform-toast';d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),2300);
  }

  async function refreshIdentity(){
    const {data:{session:s}}=await sb.auth.getSession();session=s;
    if(!s)return false;
    const {data:p}=await sb.from('profiles').select('id,display_name,profile_sigil,role,status').eq('id',s.user.id).single();
    currentProfile=p||null;return true;
  }

  function isStaff(){return ['owner','admin'].includes(currentProfile?.role)}

  function addChatPage(){
    if($('#gathering'))return;
    const nav=$('.sidebar nav'),main=$('.main');if(!nav||!main)return;
    nav.insertAdjacentHTML('beforeend',`<button class="nav" data-page="gathering">✦ <span>The Gathering</span><i class="chat-dot"></i></button>`);
    main.insertAdjacentHTML('beforeend',`
      <section id="gathering" class="page">
        <div class="section-head"><div><div class="eyebrow">VEILED COMMUNITY</div><h1>The Gathering</h1><p>One shared room for VEILED members to talk, study, and help each other. Messages appear live without refreshing the page.</p></div></div>
        <div class="gathering-shell">
          <div>
            <div class="gathering-head"><div><h3>✦ The Gathering</h3><p>Community chat · text only</p></div><div class="gathering-live"><i></i> Realtime connected</div></div>
            <div class="gathering-notice"><b>Keep the Veil welcoming.</b> Don't post private information, harassment, or unsafe advice. Owners/admins can remove messages.</div>
          </div>
          <div id="gatheringMessages" class="gathering-messages"><div class="gathering-loading">Opening The Gathering…</div></div>
          <form id="gatheringForm" class="gathering-compose">
            <div class="gathering-compose-row">
              <div class="gathering-input-wrap"><textarea id="gatheringInput" maxlength="500" rows="1" placeholder="Send a message through the Veil…"></textarea><div class="gathering-compose-foot"><span>Enter to send · Shift+Enter for a new line</span><span id="gatheringCount">0 / 500</span></div></div>
              <button class="primary-btn gathering-send" type="submit">Send ✦</button>
            </div>
          </form>
        </div>
      </section>`);
    const btn=$(`.nav[data-page="gathering"]`);if(btn)btn.addEventListener('click',openGathering);
    const form=$('#gatheringForm'),input=$('#gatheringInput');
    form?.addEventListener('submit',sendMessage);
    input?.addEventListener('input',()=>{const c=$('#gatheringCount');if(c)c.textContent=`${input.value.length} / 500`;autoGrow(input)});
    input?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();form?.requestSubmit()}});
  }

  function autoGrow(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,110)+'px'}

  function showPage(){
    $$('.page').forEach(p=>p.classList.toggle('active-page',p.id==='gathering'));
    $$('.nav').forEach(n=>n.classList.toggle('active',n.dataset.page==='gathering'));
    if($('#pageTitle'))$('#pageTitle').textContent='The Gathering';
    window.scrollTo({top:0,behavior:'smooth'});
  }

  async function openGathering(){
    showPage();
    if(opening)return;opening=true;
    try{
      const ok=await refreshIdentity();
      if(!ok){$('#gatheringMessages').innerHTML='<div class="gathering-empty"><strong>The Gathering is sealed.</strong>Sign in to join the community chat.</div>';return}
      await loadMessages();
      subscribeRealtime();
    }finally{opening=false}
  }

  async function loadProfiles(ids){
    const missing=[...new Set(ids)].filter(Boolean).filter(id=>!profiles.has(id));
    if(!missing.length)return;
    const {data}=await sb.from('profiles').select('id,display_name,profile_sigil,role,status').in('id',missing);
    (data||[]).forEach(p=>profiles.set(p.id,p));
  }

  async function loadMessages(){
    const box=$('#gatheringMessages');if(!box)return;
    const {data,error}=await sb.from('chat_messages').select('id,user_id,message,created_at').order('created_at',{ascending:false}).limit(60);
    if(error){box.innerHTML='<div class="gathering-empty"><strong>Chat unavailable.</strong>The Gathering could not be opened right now.</div>';return}
    messages=(data||[]).reverse();
    await loadProfiles(messages.map(m=>m.user_id));
    renderMessages(true);
  }

  function formatTime(v){const d=new Date(v);return d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}

  function renderMessages(scrollBottom=false){
    const box=$('#gatheringMessages');if(!box)return;
    if(!messages.length){box.innerHTML='<div class="gathering-empty"><strong>The room is quiet.</strong>Be the first person to speak through the Veil.</div>';return}
    box.innerHTML=messages.map(m=>{
      const p=profiles.get(m.user_id)||{};
      const owner=p.role==='owner';
      const admin=p.role==='admin';
      const canDelete=m.user_id===session?.user?.id||isStaff();
      const name=p.display_name||'VEILED Member';
      const sigil=(p.profile_sigil||'✦').slice(0,4);
      return `<article class="gathering-message" data-message-id="${m.id}"><div class="gathering-sigil">${esc(sigil)}</div><div><div class="gathering-meta"><span class="gathering-name">${esc(name)}</span>${owner?'<span class="gathering-crown" title="VEILED Owner">👑</span>':''}${owner?'<span class="gathering-role">Owner</span>':admin?'<span class="gathering-role">Admin</span>':''}<span class="gathering-time">${formatTime(m.created_at)}</span></div><div class="gathering-text">${esc(m.message)}</div></div>${canDelete?`<button class="gathering-delete" data-delete-message="${m.id}" title="Delete message" aria-label="Delete message">✕</button>`:'<span></span>'}</article>`;
    }).join('');
    $$('[data-delete-message]').forEach(b=>b.onclick=()=>deleteMessage(b.dataset.deleteMessage));
    if(scrollBottom)requestAnimationFrame(()=>{box.scrollTop=box.scrollHeight});
  }

  async function sendMessage(e){
    e.preventDefault();
    if(!session&&!(await refreshIdentity())){toast('Sign in to chat.');return}
    const input=$('#gatheringInput'),btn=$('.gathering-send');if(!input)return;
    const text=input.value.trim();if(!text)return;if(text.length>500){toast('Messages can be up to 500 characters.');return}
    btn.disabled=true;
    const {error}=await sb.from('chat_messages').insert({user_id:session.user.id,message:text});
    btn.disabled=false;
    if(error){toast(error.message.includes('wait a moment')?'Wait a moment before sending again.':'Message could not be sent.');return}
    input.value='';autoGrow(input);if($('#gatheringCount'))$('#gatheringCount').textContent='0 / 500';
  }

  async function deleteMessage(id){
    const {error}=await sb.from('chat_messages').delete().eq('id',id);
    if(error){toast('Message could not be deleted.');return}
  }

  function subscribeRealtime(){
    if(channel)return;
    channel=sb.channel('veiled-the-gathering')
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'chat_messages'},async payload=>{
        const m=payload.new;
        if(messages.some(x=>String(x.id)===String(m.id)))return;
        await loadProfiles([m.user_id]);messages.push(m);if(messages.length>100)messages.shift();renderMessages(true);
      })
      .on('postgres_changes',{event:'DELETE',schema:'public',table:'chat_messages'},payload=>{
        messages=messages.filter(m=>String(m.id)!==String(payload.old.id));renderMessages(false);
      })
      .subscribe(status=>{const live=$('.gathering-live');if(!live)return;live.innerHTML=status==='SUBSCRIBED'?'<i></i> Realtime connected':'<i></i> Connecting…'});
  }

  async function init(){
    addChatPage();
    await refreshIdentity();
  }

  setTimeout(init,450);
  sb.auth.onAuthStateChange(()=>setTimeout(refreshIdentity,120));
})();
const D = window.VEILED_DATA;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const titles = {home:"Sanctuary",learn:"Learn",herbs:"Herbarium",protection:"Protection",sigils:"Sigil Workshop",wheel:"Wheel of the Year",tarot:"Tarot Study",glossary:"Glossary",book:"Book of Shadows",quiz:"Study Quiz"};
const store = {
  get(k, fallback){try{return JSON.parse(localStorage.getItem(k)) ?? fallback}catch{return fallback}},
  set(k,v){localStorage.setItem(k,JSON.stringify(v))}
};
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2200)}
function showPage(page){
  $$(".page").forEach(p=>p.classList.toggle("active-page",p.id===page));
  $$(".nav").forEach(n=>n.classList.toggle("active",n.dataset.page===page));
  $("#pageTitle").textContent=titles[page]||"Veiled";
  scrollTo({top:0,behavior:"smooth"});
}
$$('.nav').forEach(n=>n.addEventListener('click',()=>showPage(n.dataset.page)));
$$('[data-jump]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.jump)));

function openGate(){
  const word=$("#veilWord").value.trim().toUpperCase();
  if(word!=="LUMEN"){ $("#gateError").textContent="The veil does not recognize that word."; return; }
  store.set("veiledEntered",true);
  $("#veilGate").animate([{opacity:1,filter:"blur(0px)"},{opacity:0,filter:"blur(8px)"}],{duration:700,fill:"forwards"});
  setTimeout(()=>{$("#veilGate").classList.add("hidden");$("#site").classList.remove("hidden");},650);
}
$("#openVeil").onclick=openGate;
$("#veilWord").addEventListener('keydown',e=>{if(e.key==='Enter')openGate()});
if(store.get("veiledEntered",false)){$("#veilGate").classList.add("hidden");$("#site").classList.remove("hidden")}

function renderLessons(){
  $("#lessonGrid").innerHTML=D.lessons.map(x=>`<article class="lesson card-flat"><div class="lesson-num">LESSON ${x.num}</div><h3>${x.title}</h3><p>${x.text}</p><ul>${x.points.map(p=>`<li>${p}</li>`).join('')}</ul></article>`).join('');
}
renderLessons();

let herbFilter='all';
function renderHerbs(){
  const q=$("#herbSearch")?.value.trim().toLowerCase()||'';
  const list=D.herbs.filter(h=>(herbFilter==='all'||h.tags.includes(herbFilter))&&(`${h.name} ${h.tags.join(' ')} ${h.folk}`.toLowerCase().includes(q)));
  $("#herbGrid").innerHTML=list.map((h,i)=>`<article class="herb-card card-flat" data-herb="${D.herbs.indexOf(h)}"><div class="herb-symbol">${h.symbol}</div><h3>${h.name}</h3><p>${h.folk}</p><div class="tag-row">${h.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div></article>`).join('') || `<div class="info-banner">No herbs match that search.</div>`;
  $$('[data-herb]').forEach(c=>c.onclick=()=>openHerb(+c.dataset.herb));
}
function openHerb(i){const h=D.herbs[i];openModal(`<div class="eyebrow">HERBARIUM ENTRY</div><h2>${h.symbol} ${h.name}</h2><h4>Traditional / folkloric associations</h4><p>${h.folk}</p><h4>Historical context</h4><p>${h.history}</p><h4>Safety note</h4><p>${h.safe}</p><p><b>Reminder:</b> magical correspondences are spiritual or folkloric traditions, not medical effects.</p>`)}
$("#herbSearch").addEventListener('input',renderHerbs);
$$('[data-herb-filter]').forEach(b=>b.onclick=()=>{herbFilter=b.dataset.herbFilter;$$('[data-herb-filter]').forEach(x=>x.classList.toggle('active',x===b));renderHerbs()});
renderHerbs();

function renderProtection(){
  $("#protectionGrid").innerHTML=D.protections.map(p=>`<article class="protection-card card-flat"><div class="card-icon">${p.icon}</div><h3>${p.title}</h3><p>${p.desc}</p><div class="steps">${p.steps.map((s,i)=>`${i+1}. ${s}`).join('<br>')}</div></article>`).join('');
}
renderProtection();

function hashString(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function drawSigil(seedOverride){
  const text=$("#sigilText").value.trim()||"I AM PRESENT";
  const symmetry=+$("#symmetry").value, complexity=+$("#complexity").value;
  const seed=seedOverride??hashString(text+symmetry+complexity);
  const random=rng(seed), c=$("#sigilCanvas"), ctx=c.getContext('2d');
  ctx.clearRect(0,0,c.width,c.height);ctx.save();ctx.translate(c.width/2,c.height/2);ctx.strokeStyle='#d7bd79';ctx.fillStyle='#d7bd79';ctx.lineWidth=5;ctx.lineCap='round';ctx.lineJoin='round';
  const pts=[];for(let i=0;i<complexity;i++){const a=random()*Math.PI*2,r=80+random()*200;pts.push([Math.cos(a)*r,Math.sin(a)*r])}
  for(let s=0;s<symmetry;s++){ctx.save();ctx.rotate((Math.PI*2/symmetry)*s);ctx.beginPath();pts.forEach((p,i)=>{if(i===0)ctx.moveTo(p[0],p[1]);else ctx.lineTo(p[0],p[1])});ctx.stroke();ctx.restore()}
  ctx.beginPath();ctx.arc(0,0,45+random()*25,0,Math.PI*2);ctx.stroke();
  for(let i=0;i<Math.max(3,Math.floor(complexity/2));i++){const a=random()*Math.PI*2,r=110+random()*170;ctx.beginPath();ctx.arc(Math.cos(a)*r,Math.sin(a)*r,5+random()*8,0,Math.PI*2);ctx.fill()}
  ctx.restore();$("#sigilWords").textContent=text.toUpperCase();store.set("lastSigil",{text,symmetry,complexity,seed});
}
$("#generateSigil").onclick=()=>drawSigil();
$("#randomizeSigil").onclick=()=>drawSigil(Math.floor(Math.random()*1e9));
$("#saveSigil").onclick=()=>{const s=store.get("lastSigil",null);if(!s){toast("Generate a sigil first");return}const notes=store.get("veiledNotes",[]);notes.unshift({id:Date.now(),title:`Sigil: ${s.text}`,category:"Sigils",body:`Personal sigil intention: ${s.text}\nSymmetry: ${s.symmetry}\nComplexity: ${s.complexity}\nSeed: ${s.seed}`,date:new Date().toLocaleString()});store.set("veiledNotes",notes);renderNotes();toast("Sigil notes saved to your Book of Shadows")};
const lastSigil=store.get("lastSigil",null);if(lastSigil){$("#sigilText").value=lastSigil.text;$("#symmetry").value=lastSigil.symmetry;$("#complexity").value=lastSigil.complexity;drawSigil(lastSigil.seed)}else drawSigil();

function renderWheel(){
  const w=$("#wheelVisual");w.innerHTML='';D.sabbats.forEach((s,i)=>{const a=(-90+i*45)*Math.PI/180,x=50+42*Math.cos(a),y=50+42*Math.sin(a);const n=document.createElement('div');n.className='sabbat-node';n.style.left=x+'%';n.style.top=y+'%';n.innerHTML=`<span>${s.symbol}</span><b>${s.name}</b><small>${s.date}</small>`;n.onclick=()=>showSabbat(i);w.appendChild(n)});showSabbat(0);
}
function showSabbat(i){const s=D.sabbats[i];$("#sabbatDetail").innerHTML=`<div class="eyebrow">SEASONAL ENTRY</div><h2 style="font-family:'Cormorant Garamond',serif;font-size:36px;margin:6px 0">${s.symbol} ${s.name}</h2><p><b>${s.date}</b></p><p>${s.theme}</p><h4>Low-risk ways to explore</h4><ul>${s.ideas.map(x=>`<li>${x}</li>`).join('')}</ul><p style="font-size:11px">Dates and customs differ by tradition, location, and hemisphere.</p>`}
renderWheel();

$("#drawTarot").onclick=()=>{
  const t=D.tarot[Math.floor(Math.random()*D.tarot.length)];
  $("#tarotCard").innerHTML=`<div class="tarot-front"><div class="roman">${t.roman}</div><div class="symbol">${t.symbol}</div><h3>${t.name}</h3></div>`;
  $("#tarotMeaning").innerHTML=`<div class="eyebrow">STUDY CARD</div><h2 style="font-family:'Cormorant Garamond',serif;font-size:34px;margin:6px 0">${t.name}</h2><p><b>Common themes:</b> ${t.themes}</p><h3 style="font-family:'Cormorant Garamond',serif">Reflective question</h3><p>${t.prompt}</p><button class="text-btn" id="saveTarot">Save reflection prompt</button>`;
  setTimeout(()=>{$("#saveTarot").onclick=()=>saveQuickNote(`Tarot: ${t.name}`,"Tarot",`${t.themes}\n\nReflection: ${t.prompt}`)},0)
};

function renderGlossary(){const q=$("#glossarySearch")?.value.toLowerCase().trim()||'';const list=D.glossary.filter(([t,d])=>(t+' '+d).toLowerCase().includes(q));$("#glossaryList").innerHTML=list.map(([t,d])=>`<article class="glossary-item"><b>${t}</b><p>${d}</p></article>`).join('')}
$("#glossarySearch").addEventListener('input',renderGlossary);renderGlossary();

function saveQuickNote(title,category,body){const notes=store.get("veiledNotes",[]);notes.unshift({id:Date.now(),title,category,body,date:new Date().toLocaleString()});store.set("veiledNotes",notes);renderNotes();toast("Saved to your Book of Shadows")}
$("#saveNote").onclick=()=>{const title=$("#noteTitle").value.trim(),body=$("#noteBody").value.trim(),category=$("#noteCategory").value;if(!title&&!body){toast("Write something first");return}saveQuickNote(title||"Untitled Page",category,body);$("#noteTitle").value='';$("#noteBody").value=''};
function renderNotes(){const notes=store.get("veiledNotes",[]);$("#noteList").innerHTML=notes.length?notes.map(n=>`<article class="note-card"><div class="note-meta">${n.category} · ${n.date}</div><h3>${escapeHtml(n.title)}</h3><p>${escapeHtml(n.body)}</p><div class="note-actions"><button onclick="deleteNote(${n.id})">Delete</button></div></article>`).join(''):`<div class="info-banner">Your Book of Shadows is empty. Save a journal page, prompt, tarot reflection, or sigil note to begin.</div>`}
window.deleteNote=id=>{store.set("veiledNotes",store.get("veiledNotes",[]).filter(n=>n.id!==id));renderNotes();toast("Page removed")};
function escapeHtml(s=''){return s.replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':'&quot;'}[c]))}
renderNotes();
$("#exportNotes").onclick=()=>{const notes=store.get("veiledNotes",[]);const text=notes.map(n=>`# ${n.title}\n${n.category} — ${n.date}\n\n${n.body}\n\n---\n`).join('\n');const blob=new Blob([text||'# The Veiled Grimoire\n\nNo notes saved yet.'],{type:'text/plain'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='veiled-book-of-shadows.txt';a.click();URL.revokeObjectURL(a.href)};

const promptIndex=new Date().getDate()%D.prompts.length;$("#dailyPrompt").textContent=D.prompts[promptIndex];$("#savePrompt").onclick=()=>saveQuickNote("Daily Prompt","Journal",D.prompts[promptIndex]+"\n\nMy reflection:\n");

let qi=0,score=0;
function renderQuiz(){const box=$("#quizBox");if(qi>=D.quiz.length){box.innerHTML=`<div class="quiz-q"><div class="eyebrow">COMPLETE</div><h3>You scored ${score} / ${D.quiz.length}</h3><p>${score===D.quiz.length?'Excellent. You caught every distinction in the beginner material.':'Review the sections you missed and try again when you are ready.'}</p><button id="restartQuiz" class="primary-btn">Restart Quiz</button></div>`;$("#restartQuiz").onclick=()=>{qi=0;score=0;renderQuiz()};return}const q=D.quiz[qi];box.innerHTML=`<div class="quiz-q"><div class="eyebrow">QUESTION ${qi+1} OF ${D.quiz.length}</div><h3>${q.q}</h3>${q.options.map((o,i)=>`<button class="quiz-option" data-opt="${i}">${o}</button>`).join('')}<div id="quizExplain"></div></div>`;$$('[data-opt]').forEach(b=>b.onclick=()=>{const correct=+b.dataset.opt===q.answer;if(correct)score++;$$('[data-opt]').forEach(x=>x.disabled=true);$("#quizExplain").innerHTML=`<div class="info-banner ${correct?'':'warning'}"><b>${correct?'Correct':'Not quite'}.</b> ${q.why}<br><button id="nextQuiz" class="text-btn" style="margin-top:8px">Continue →</button></div>`;$("#nextQuiz").onclick=()=>{qi++;renderQuiz()}})}
renderQuiz();

function openModal(html){$("#modalBody").innerHTML=html;$("#modal").classList.remove('hidden')}
$("#modalClose").onclick=()=>$("#modal").classList.add('hidden');$("#modal").onclick=e=>{if(e.target===$("#modal"))$("#modal").classList.add('hidden')};

$("#randomPageBtn").onclick=()=>{const pages=['learn','herbs','protection','sigils','wheel','tarot','glossary','book','quiz'];showPage(pages[Math.floor(Math.random()*pages.length)])};

function moonPhase(){const now=new Date(),known=new Date(Date.UTC(2000,0,6,18,14)),days=(now-known)/86400000,cycle=29.53058867,age=((days%cycle)+cycle)%cycle;let icon='🌑',name='New Moon';if(age<1.85||age>27.68){icon='🌑';name='New Moon'}else if(age<5.54){icon='🌒';name='Waxing Crescent'}else if(age<9.23){icon='🌓';name='First Quarter'}else if(age<12.92){icon='🌔';name='Waxing Gibbous'}else if(age<16.61){icon='🌕';name='Full Moon'}else if(age<20.30){icon='🌖';name='Waning Gibbous'}else if(age<23.99){icon='🌗';name='Last Quarter'}else{icon='🌘';name='Waning Crescent'}return{icon,name}}
const moon=moonPhase();$("#moonChip").innerHTML=`${moon.icon} <span>${moon.name}</span>`;

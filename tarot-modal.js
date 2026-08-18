(()=>{
  const cards=[...document.querySelectorAll('.tarot-mini')];
  if(!cards.length)return;

  const majorThemes={
    'The Fool':['Beginnings • curiosity • possibility','What new beginning am I approaching, and what would thoughtful courage look like?'],
    'The Magician':['Initiative • skill • resourcefulness','What tools or abilities do I already have that I can use intentionally?'],
    'The High Priestess':['Intuition • reflection • hidden knowledge','What deserves quiet observation before I act?'],
    'The Empress':['Nurture • creativity • abundance','What am I helping grow through consistent care?'],
    'The Emperor':['Structure • responsibility • boundaries','Where would clearer structure or boundaries help me?'],
    'The Hierophant':['Tradition • learning • guidance','Which traditions am I learning from, and have I checked their context?'],
    'The Lovers':['Values • connection • choices','Which choice best matches my values?'],
    'The Chariot':['Direction • determination • self-control','Where do I need to choose a direction and stay focused?'],
    'Strength':['Patience • courage • compassion','How can I respond with steady courage rather than force?'],
    'The Hermit':['Solitude • study • inner reflection','What could I understand better by giving it quiet attention?'],
    'Wheel of Fortune':['Change • cycles • uncertainty','What is changing that I cannot control, and what can I control?'],
    'Justice':['Fairness • accountability • consequences','What facts and consequences should I consider before deciding?'],
    'The Hanged Man':['Pause • perspective • surrender','What might look different if I stop and view it another way?'],
    'Death':['Transition • endings • renewal','What chapter may be ending, and what space could that create?'],
    'Temperance':['Balance • patience • integration','Where could moderation or compromise help?'],
    'The Devil':['Attachment • temptation • unhealthy patterns','What habit or pressure deserves a closer, nonjudgmental look?'],
    'The Tower':['Disruption • revelation • rebuilding','When plans change suddenly, what stable foundation can I return to?'],
    'The Star':['Hope • renewal • inspiration','What gives me realistic hope and helps me keep going?'],
    'The Moon':['Uncertainty • imagination • intuition','What am I unsure about, and what facts could help me check my assumptions?'],
    'The Sun':['Joy • clarity • vitality','What is going well that I can appreciate or build upon?'],
    'Judgement':['Reflection • evaluation • renewal','What have I learned from a past choice?'],
    'The World':['Completion • integration • accomplishment','What have I completed, and what did the process teach me?']
  };

  function minorInfo(name){
    const suit=['Wands','Cups','Swords','Pentacles'].find(s=>name.includes(s))||'';
    const suitText={Wands:'creativity, motivation and action',Cups:'emotion, relationships and reflection',Swords:'thought, communication and decisions',Pentacles:'practical matters, resources and steady effort'}[suit]||'reflection';
    return [`${suit} • ${suitText}`,'Look closely at the artwork. What detail catches your attention first, and how might it relate to your question?'];
  }

  function openCard(name){
    const info=majorThemes[name]||minorInfo(name);
    const isMajor=!!majorThemes[name];
    const modal=document.getElementById('modal');
    const body=document.getElementById('modalBody');
    if(!modal||!body)return;
    body.innerHTML=`
      <div class="tarot-study-modal">
        <div class="tarot-card-art"><span>${isMajor?'MAJOR ARCANA':'TAROT STUDY'}</span><strong>${name}</strong><i>☾ ✦ ☽</i></div>
        <div class="tarot-study-copy">
          <div class="eyebrow">CARD STUDY</div>
          <h2>${name}</h2>
          <div class="tarot-keywords">${info[0]}</div>
          <h3>Reflection prompt</h3><p>${info[1]}</p>
          <h3>How to study this card</h3><p>Study the imagery in your own deck first. Write down your first impression, then compare more than one reputable guide or source. Meanings can vary by deck, reader, spread and tradition.</p>
          <div class="info-banner"><b>Remember:</b> tarot can be used for reflection and spiritual practice, but a card is not a guaranteed prediction of what will happen.</div>
          <button class="primary-btn" id="tarotModalClose">Return to the deck</button>
        </div>
      </div>`;
    modal.classList.remove('hidden');
    document.getElementById('tarotModalClose').onclick=()=>modal.classList.add('hidden');
  }

  cards.forEach(card=>{
    const replacement=card.cloneNode(true);
    card.replaceWith(replacement);
    replacement.addEventListener('click',()=>openCard(replacement.dataset.card));
  });
})();
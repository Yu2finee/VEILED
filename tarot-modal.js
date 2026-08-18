(()=>{
  const cards=[...document.querySelectorAll('.tarot-mini')];
  if(!cards.length)return;

  const majorThemes={
    'The Fool':['Beginnings • curiosity • possibility','A new chapter, openness to experience, taking a thoughtful leap, and learning as you go. The Fool often points to beginner energy: you may not know the whole path yet, but you are willing to explore it.','Rushing in without preparation, avoiding responsibility, or being so afraid of looking foolish that you never begin.','What new beginning am I approaching, and what would thoughtful courage look like?'],
    'The Magician':['Initiative • skill • resourcefulness','Using the abilities, knowledge, and resources already available to you. The Magician emphasizes intention followed by action rather than waiting for circumstances to change on their own.','Scattered effort, unused potential, overconfidence, or using skill without enough care for consequences.','What tools or abilities do I already have that I can use intentionally?'],
    'The High Priestess':['Intuition • reflection • hidden knowledge','Quiet observation, inner awareness, mystery, and information that may not be obvious yet. It can suggest listening carefully before reaching a conclusion.','Ignoring evidence in favor of assumptions, withholding too much, or becoming stuck in passive observation.','What deserves quiet observation before I act?'],
    'The Empress':['Nurture • creativity • abundance','Growth through care, creativity, comfort, and connection with the natural or sensory world. It often asks what needs patience and consistent attention to flourish.','Overgiving, neglecting your own needs, creative stagnation, or confusing excess with genuine abundance.','What am I helping grow through consistent care?'],
    'The Emperor':['Structure • responsibility • boundaries','Order, leadership, stability, planning, and healthy boundaries. The Emperor can represent creating a reliable structure that makes progress possible.','Rigidity, controlling behavior, stubbornness, or rules that have stopped serving their purpose.','Where would clearer structure or boundaries help me?'],
    'The Hierophant':['Tradition • learning • guidance','Learning from established traditions, teachers, institutions, or shared practices. It can encourage studying context before adapting a tradition for yourself.','Following tradition without questioning it, pressure to conform, or rejecting useful guidance simply because it is conventional.','Which traditions am I learning from, and have I checked their context?'],
    'The Lovers':['Values • connection • choices','Connection and relationships, but also meaningful choices based on personal values. The card asks whether your actions and priorities agree with what matters to you.','Misalignment, indecision, unhealthy dependence, or making choices that conflict with your stated values.','Which choice best matches my values?'],
    'The Chariot':['Direction • determination • self-control','Focused movement, determination, and bringing competing priorities under deliberate control. Progress comes from choosing a direction and managing your energy.','Forcing progress, losing direction, competing impulses, or trying to control things that are outside your control.','Where do I need to choose a direction and stay focused?'],
    'Strength':['Patience • courage • compassion','Quiet courage, patience, emotional steadiness, and responding to difficulty without unnecessary force. Strength emphasizes self-control rather than domination.','Self-doubt, suppressed emotions, impatience, or believing that aggression is the only form of strength.','How can I respond with steady courage rather than force?'],
    'The Hermit':['Solitude • study • inner reflection','Purposeful solitude, research, introspection, and stepping away from noise long enough to understand something more clearly.','Isolation, withdrawing for too long, or thinking endlessly without eventually returning to action or connection.','What could I understand better by giving it quiet attention?'],
    'Wheel of Fortune':['Change • cycles • uncertainty','Changing circumstances, repeating cycles, timing, and the reminder that not everything is under personal control.','Resisting inevitable change, repeating an old pattern without noticing it, or relying entirely on luck instead of making choices.','What is changing that I cannot control, and what can I control?'],
    'Justice':['Fairness • accountability • consequences','Careful judgment, truth, accountability, and considering evidence and consequences before reaching a decision.','Bias, avoiding responsibility, unfair judgment, or making a decision without enough information.','What facts and consequences should I consider before deciding?'],
    'The Hanged Man':['Pause • perspective • surrender','A deliberate pause, seeing a situation differently, and temporarily releasing the need to force an answer.','Feeling stuck without using the pause productively, unnecessary sacrifice, or refusing to consider another perspective.','What might look different if I stop and view it another way?'],
    'Death':['Transition • endings • renewal','An ending or major transition that makes room for something different. In tarot, Death is generally symbolic and is not a literal prediction of death.','Holding onto something whose time has passed, fear of change, or difficulty accepting a transition.','What chapter may be ending, and what space could that create?'],
    'Temperance':['Balance • patience • integration','Moderation, combining different influences thoughtfully, patience, and finding a workable middle path.','Extremes, imbalance, impatience, or trying to combine things that need clearer boundaries first.','Where could moderation or compromise help?'],
    'The Devil':['Attachment • temptation • unhealthy patterns','Examining attachment, pressure, temptation, habits, or beliefs that can make a person feel less free to choose.','Denial of an unhealthy pattern, shame that prevents honest reflection, or feeling powerless when choices are still available.','What habit or pressure deserves a closer, nonjudgmental look?'],
    'The Tower':['Disruption • revelation • rebuilding','Sudden change, a challenged assumption, or a structure that needs to be reconsidered. The useful question is often what can be learned or rebuilt afterward.','Fear of necessary change, trying to preserve an unstable situation, or creating chaos unnecessarily.','When plans change suddenly, what stable foundation can I return to?'],
    'The Star':['Hope • renewal • inspiration','Renewed hope, healing reflection, inspiration, and reconnecting with a sense of possibility after difficulty.','Discouragement, unrealistic expectations, or waiting for hope to replace practical action.','What gives me realistic hope and helps me keep going?'],
    'The Moon':['Uncertainty • imagination • intuition','Ambiguity, imagination, dreams, emotion, and situations where the full picture is not yet clear. It encourages curiosity while checking assumptions against evidence.','Confusion, anxiety-driven assumptions, misinformation, or treating every feeling as a fact.','What am I unsure about, and what facts could help me check my assumptions?'],
    'The Sun':['Joy • clarity • vitality','Clarity, confidence, enjoyment, openness, and recognizing something that is working well.','Overconfidence, pressure to appear positive, or overlooking a problem because things seem generally good.','What is going well that I can appreciate or build upon?'],
    'Judgement':['Reflection • evaluation • renewal','Reviewing past choices, recognizing what you have learned, and deciding how that knowledge should affect what comes next.','Harsh self-judgment, refusing accountability, or staying trapped in an old version of yourself.','What have I learned from a past choice?'],
    'The World':['Completion • integration • accomplishment','Completion, achievement, and bringing lessons from a finished cycle together before moving into the next one.','An unfinished detail, difficulty acknowledging progress, or rushing into the next goal without reflecting on what was learned.','What have I completed, and what did the process teach me?']
  };

  const rankMeanings={Ace:['beginnings, potential, and a new opportunity','blocked potential, hesitation, or a beginning that needs more preparation'],Two:['balance, choices, partnership, or two influences meeting','indecision, imbalance, or difficulty coordinating competing needs'],Three:['development, collaboration, and early growth','miscommunication, stalled growth, or difficulty working together'],Four:['stability, foundations, rest, or consolidation','stagnation, instability, or becoming too comfortable to adapt'],Five:['tension, disruption, challenge, or adjustment','avoiding conflict, unresolved tension, or beginning to recover from difficulty'],Six:['movement, cooperation, improvement, or transition','slow progress, unfinished business, or difficulty moving forward'],Seven:['assessment, strategy, persistence, or testing your position','self-doubt, poor planning, or effort that needs to be redirected'],Eight:['movement, practice, organization, or sustained effort','delays, scattered energy, or repeating effort without learning from it'],Nine:['experience, nearing completion, resilience, or independence','fatigue, worry, defensiveness, or difficulty recognizing how far you have come'],Ten:['completion, culmination, responsibility, or the end of a cycle','overload, resistance to an ending, or responsibilities becoming difficult to manage'],Page:['curiosity, learning, messages, and beginner energy','inexperience, distraction, or a lesson that still needs attention'],Knight:['movement, pursuit, commitment, and active energy','impulsiveness, inconsistency, or pursuing something without enough reflection'],Queen:['maturity, understanding, care, and inward mastery','insecurity, overextension, or difficulty trusting your developed abilities'],King:['leadership, responsibility, experience, and outward mastery','rigidity, misuse of authority, or confidence without enough listening']};
  const suitMeanings={Wands:['creativity, motivation, ambition, inspiration, and action','How am I using my energy, motivation, or creativity?'],Cups:['emotion, relationships, empathy, intuition, and reflection','What am I feeling, and how is that affecting my relationships or choices?'],Swords:['thought, communication, conflict, truth, and decisions','What thoughts, facts, or conversations need my attention?'],Pentacles:['practical matters, work, resources, learning, and steady effort','What practical step could make this situation more stable or manageable?']};

  function minorInfo(name){
    const suit=Object.keys(suitMeanings).find(s=>name.includes(s))||'Pentacles';
    const rank=name.replace(` of ${suit}`,'').trim();
    const s=suitMeanings[suit];
    const r=rankMeanings[rank]||['development and reflection','a challenge or lesson connected with the card'];
    return [`${rank} • ${suit}`,`The ${suit} suit commonly explores ${s[0]}. As a ${rank}, this card adds themes of ${r[0]}. Read together, it can invite you to examine how those ideas are showing up in the situation you are considering.`,`In a reversed or challenging position, readers may explore ${r[1]}. A reversal does not automatically mean something bad; it can represent an internal, delayed, blocked, or reconsidered expression of the card.`,s[1]];
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
          <h3>What this card means</h3><p>${info[1]}</p>
          <h3>Reversed / challenging meaning</h3><p>${info[2]}</p>
          <h3>Reflection prompt</h3><p>${info[3]}</p>
          <h3>How to read it in a spread</h3><p>Start with the card's core themes, then consider the question, its position in the spread, nearby cards, and the imagery in your specific deck. Treat the meaning as a prompt for interpretation rather than a fixed prediction.</p>
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
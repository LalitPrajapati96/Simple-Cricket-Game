
(() => {
  
  const btns = Array.from(document.querySelectorAll('button.crik'));
  const movesEl = document.getElementById('moves');
  const resultEl = document.getElementById('result');
  const barYou = document.getElementById('barYou');
  const barComp = document.getElementById('barComp');
  const userScoreEl = document.getElementById('userScore');
  const compScoreEl = document.getElementById('compScore');
  const currentRoundEl = document.getElementById('currentRound');
  const totalRoundsEl = document.getElementById('totalRounds');
  const roundSelect = document.getElementById('roundSelect');
  const resetMatchBtn = document.getElementById('resetMatch');
  const clearLbBtn = document.getElementById('clearLeaderboard');

  
  const lbPlayed = document.getElementById('lbPlayed');
  const lbYou = document.getElementById('lbYou');
  const lbComp = document.getElementById('lbComp');
  const lbTie = document.getElementById('lbTie');
  const lbLast = document.getElementById('lbLast');

  const svgLayer = document.getElementById('svgLayer');

  
  const clickSound = document.getElementById('clickSound');
  const winSound = document.getElementById('winSound');
  const loseSound = document.getElementById('loseSound');
  const tieSound = document.getElementById('tieSound');

  
  const choices = ['Bat','Ball','Stump'];
  const winsAgainst = { Bat: 'Ball', Ball: 'Stump', Stump: 'Bat' };

  let totalRounds = Number(roundSelect.value);
  let targetWins = Math.ceil(totalRounds / 2);
  let currentRound = 0;
  let userScore = 0;
  let compScore = 0;
  let matchOver = false;

  
  const LB_KEY = 'cricket_game_leaderboard_v1';

  
  function loadLeaderboard(){
    const raw = localStorage.getItem(LB_KEY);
    if (!raw) return {played:0,you:0,comp:0,tie:0,last:'—'};
    try {
      return JSON.parse(raw);
    } catch(e){
      return {played:0,you:0,comp:0,tie:0,last:'—'};
    }
  }
  function saveLeaderboard(obj){
    localStorage.setItem(LB_KEY, JSON.stringify(obj));
    renderLeaderboard();
  }
  function renderLeaderboard(){
    const data = loadLeaderboard();
    lbPlayed.textContent = data.played;
    lbYou.textContent = data.you;
    lbComp.textContent = data.comp;
    lbTie.textContent = data.tie;
    lbLast.textContent = data.last || '—';
  }

  
  renderLeaderboard();

  
  function playSound(audio){
    try { audio.currentTime = 0; audio.play(); } catch(e) {}
  }
  function rand(min,max){ return Math.random() * (max - min) + min; }

  
  function updateBars(){
    const youPct = totalRounds ? (userScore / totalRounds) * 100 : 0;
    const compPct = totalRounds ? (compScore / totalRounds) * 100 : 0;
    barYou.style.width = youPct + '%';
    barComp.style.width = compPct + '%';
  }
  function updateText(){
    userScoreEl.textContent = userScore;
    compScoreEl.textContent = compScore;
    currentRoundEl.textContent = currentRound;
    totalRoundsEl.textContent = totalRounds;
  }
  function resetHighlights(){
    btns.forEach(b => b.classList.remove('highlight-win','highlight-lose','highlight-tie'));
  }

  
  function svgConfetti(color){
    
    return `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2 L14.8 8.4 L21.6 9.6 L16.8 14.1 L17.8 21 L12 17.7 L6.2 21 L7.2 14.1 L2.4 9.6 L9.2 8.4Z" fill="${color}"/>
    </svg>`;
  }
  function svgSkull(){
    return `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C9.2 2 7 4 7 6.6 7 8.6 8 9.8 9 10.2V12C7.8 12 7 12.8 7 13.9V15C7 16.7 8 18 9.5 18H10v1.5C10 20.8 11.2 22 12.8 22h.4C14.8 22 16 20.8 16 19.5V18h.5C18 18 19 16.7 19 15V13.9C19 12.8 18.2 12 17 12V10.2C18 9.8 19 8.6 19 6.6 19 4 16.8 2 14 2H12Z" fill="#333"/>
    </svg>`;
  }
  function svgHandshake(){
    return `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 12l5 4 5-4-5-4-5 4zm20 0l-5 4-5-4 5-4 5 4z" fill="#777"/>
    </svg>`;
  }

  
  function spawnSVGGroup(type){
    const vw = window.innerWidth;
    const baseX = vw * 0.5;
    const spread = vw * 0.28;
    const count = type === 'tie' ? 3 : 6;
    for (let i=0;i<count;i++){
      const el = document.createElement('div');
      el.className = 'sv-anim';
      const x = Math.max(8, Math.min(vw - 40, baseX + rand(-spread, spread)));
      let startY;
      if (type === 'win') startY = window.innerHeight - 120;
      else if (type === 'lose') startY = -80;
      else startY = window.innerHeight * 0.45;
      el.style.left = `${x}px`;
      el.style.top = `${startY}px`;

      
      if (type === 'win'){
        
        const colors = ['#FFCC00','#FF6B6B','#39A0ED','#8AE56A','#FF9B9B'];
        el.innerHTML = svgConfetti(colors[i % colors.length]);
        el.classList.add('confetti');
        el.style.animationDelay = `${rand(0,250)}ms`;
      } else if (type === 'lose'){
        el.innerHTML = svgSkull();
        el.classList.add('skull');
        el.style.animationDelay = `${rand(0,220)}ms`;
      } else {
        el.innerHTML = svgHandshake();
        el.classList.add('handshake');
        el.style.animationDelay = `${rand(0,120)}ms`;
      }
      svgLayer.appendChild(el);
      
      el.addEventListener('animationend', ()=> el.remove());
    }
  }

  
  function updateLeaderboard(matchResult){
    
    const data = loadLeaderboard();
    data.played = (data.played || 0) + 1;
    if (matchResult === 'player') data.you = (data.you || 0) + 1;
    else if (matchResult === 'computer') data.comp = (data.comp || 0) + 1;
    else data.tie = (data.tie || 0) + 1;
    data.last = (new Date()).toLocaleString();
    saveLeaderboard(data);
  }

  
  function loadLeaderboard(){
    const raw = localStorage.getItem(LB_KEY);
    if (!raw) return {played:0,you:0,comp:0,tie:0,last:'—'};
    try { return JSON.parse(raw); } catch(e){ return {played:0,you:0,comp:0,tie:0,last:'—'}; }
  }
  function saveLeaderboard(obj){ localStorage.setItem(LB_KEY, JSON.stringify(obj)); renderLeaderboard(); }

  function renderLeaderboard(){
    const d = loadLeaderboard();
    lbPlayed.textContent = d.played || 0;
    lbYou.textContent = d.you || 0;
    lbComp.textContent = d.comp || 0;
    lbTie.textContent = d.tie || 0;
    lbLast.textContent = d.last || '—';
  }

  
  function pickComputer(){ return choices[Math.floor(Math.random() * choices.length)]; }

  function playRound(userChoice){
    if (matchOver) return;
    playSound(clickSound);

    
    if (userScore >= targetWins || compScore >= targetWins) {
      endMatch();
      return;
    }

    const computerChoice = pickComputer();
    let outcome;
    if (userChoice === computerChoice) outcome = 'tie';
    else if (winsAgainst[userChoice] === computerChoice) outcome = 'win';
    else outcome = 'lose';

    currentRound++;
    if (outcome === 'win') userScore++;
    else if (outcome === 'lose') compScore++;

    movesEl.textContent = `You chose ${userChoice}. Computer chose ${computerChoice}.`;

    if (outcome === 'win'){
      resultEl.textContent = 'You win this round! 🎉';
      playSound(winSound);
    } else if (outcome === 'lose'){
      resultEl.textContent = 'You lost this round. 💀';
      playSound(loseSound);
    } else {
      resultEl.textContent = "It's a tie. 🤝";
      playSound(tieSound);
    }

    
    if (outcome === 'win') spawnSVGGroup('win');
    else if (outcome === 'lose') spawnSVGGroup('lose');
    else spawnSVGGroup('tie');

    
    resetHighlights();
    const compBtn = btns.find(b => b.dataset.choice === computerChoice);
    if (compBtn){
      if (outcome === 'win') compBtn.classList.add('highlight-lose');
      else if (outcome === 'lose') compBtn.classList.add('highlight-win');
      else compBtn.classList.add('highlight-tie');
      setTimeout(()=> compBtn.classList.remove('highlight-win','highlight-lose','highlight-tie'), 700);
    }

    updateBars();
    updateText();

    if (userScore >= targetWins || compScore >= targetWins || currentRound >= totalRounds){
      setTimeout(endMatch, 600);
    }
  }

  function endMatch(){
    matchOver = true;
    let matchResult;
    if (userScore > compScore){
      resultEl.textContent = '🏆 You won the match!';
      spawnSVGGroup('win');
      matchResult = 'player';
    } else if (compScore > userScore){
      resultEl.textContent = '💀 Computer won the match!';
      spawnSVGGroup('lose');
      matchResult = 'computer';
    } else {
      resultEl.textContent = "🤝 The match is a tie!";
      spawnSVGGroup('tie');
      matchResult = 'tie';
    }
    updateLeaderboard(matchResult);
  }

  function resetGame(){
    matchOver = false;
    currentRound = 0;
    userScore = 0;
    compScore = 0;
    totalRounds = Number(roundSelect.value);
    targetWins = Math.ceil(totalRounds / 2);
    updateBars();
    updateText();
    movesEl.textContent = 'Match reset. Click a choice to start.';
    resultEl.textContent = 'Good luck!';
    resetHighlights();
    svgLayer.innerHTML = '';
    renderLeaderboard();
  }

  
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.style.transform = 'translateY(2px)';
      setTimeout(()=> btn.style.transform = '', 140);
      playRound(btn.dataset.choice);
    });
    btn.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.key === ' ') btn.click();
    });
  });

  roundSelect.addEventListener('change', () => {
    totalRounds = Number(roundSelect.value);
    totalRoundsEl.textContent = totalRounds;
    targetWins = Math.ceil(totalRounds / 2);
    resetGame();
  });

  resetMatchBtn.addEventListener('click', resetGame);

  clearLbBtn.addEventListener('click', () => {
    if (confirm('Clear leaderboard stored in your browser?')) {
      localStorage.removeItem(LB_KEY);
      renderLeaderboard();
    }
  });

  
  window.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === '1') btns[0].click();
    if (e.key === '2') btns[1].click();
    if (e.key === '3') btns[2].click();
    if (e.key.toLowerCase() === 'r') resetGame();
  });

  
  totalRounds = Number(roundSelect.value);
  totalRoundsEl.textContent = totalRounds;
  resetGame();

  
  

})();

// script.js — interactive logic for the love-bear page

document.addEventListener('DOMContentLoaded', () => {
  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  const bear = document.getElementById('bear');
  const music = document.getElementById('bgMusic');
  const musicBtn = document.getElementById('musicBtn');
  const volume = document.getElementById('volume');
  const heartsContainer = document.getElementById('hearts');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  const title = document.getElementById('title');

  let musicStarted = false;

  // Use name if present in URL: ?name=YourName
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name');
  if (name) {
    title.textContent = `Will you go out with me, ${decodeURIComponent(name)}? ❤️`;
  }

  // Ensure bear is initially happy
  const happyBear = "https://i.postimg.cc/MG1WynLY/happy-bear.png";
  const sadBear = "https://i.postimg.cc/fyHzNvN8/sad-bear.png";
  bear.src = happyBear;

  // Play music with user-initiated gesture only
  function startMusic() {
    if (!musicStarted) {
      music.volume = parseFloat(volume.value || 0.6);
      music.play().catch(() => {});
      musicStarted = true;
      musicBtn.textContent = '🔊';
      musicBtn.setAttribute('aria-pressed','true');
    }
  }

  // Toggle playback / pause
  function toggleMusic() {
    if (music.paused) {
      music.play().catch(()=>{});
      musicBtn.textContent = '🔊';
      musicBtn.setAttribute('aria-pressed','true');
    } else {
      music.pause();
      musicBtn.textContent = '🔈';
      musicBtn.setAttribute('aria-pressed','false');
    }
    musicStarted = true;
  }

  // Update volume
  volume.addEventListener('input', () => {
    music.volume = parseFloat(volume.value);
  });

  musicBtn.addEventListener('click', () => {
    startMusic();
    toggleMusic();
  });

  // Create a heart element at x,y in viewport coords
  function createHeart(x, y, color) {
    const el = document.createElement('div');
    el.className = 'heart';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    // use SVG heart to keep it sharp
    el.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <path fill="${color}" d="M12 21s-7.5-4.9-10-8.1C-0.1 9.9 2 5 6 5c2.2 0 3.5 1.2 4 2 .5-.8 1.8-2 4-2 4 0 6.1 4.9 4 7.9-2.5 3.1-10 8.1-10 8.1z"/>
    </svg>`;
    // Randomize duration and horizontal drift
    const dur = 2200 + Math.random()*1400;
    el.style.animationDuration = `${dur}ms`;
    el.style.transform = `translateY(0) rotate(${Math.random()*30-15}deg)`;
    heartsContainer.appendChild(el);
    // Remove after animation
    setTimeout(()=> el.remove(), dur + 200);
  }

  // Periodically spawn gentle hearts at bottom center
  let heartInterval = setInterval(() => {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const x = vw * (0.45 + (Math.random()-0.5)*0.18);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const y = vh - 80 + (Math.random()*20 - 10);
    createHeart(x, y, ['#ff6b9a','#ff9ac2','#ff4d88'][Math.floor(Math.random()*3)]);
  }, 800);

  // Make the no button evasive — but keep it friendly and predictable
  function moveNoButton() {
    const container = document.querySelector('.buttons');
    const rect = container.getBoundingClientRect();
    const yesRect = yesBtn.getBoundingClientRect();

    const maxX = Math.max(6, rect.width - noBtn.offsetWidth - 6);
    const maxY = Math.max(6, rect.height - noBtn.offsetHeight - 6);

    // Try to pick a spot not overlapping the Yes button
    let candidateX, candidateY, tries = 0;
    do {
      candidateX = Math.random() * maxX;
      candidateY = Math.random() * maxY;
      tries++;
      if (tries > 12) break;
      // Convert candidate to viewport coordinates to check overlap
      const candRect = {
        left: rect.left + candidateX,
        right: rect.left + candidateX + noBtn.offsetWidth,
        top: rect.top + candidateY,
        bottom: rect.top + candidateY + noBtn.offsetHeight
      };
      // If overlapping the yes button, try another position
      if (!(candRect.right < yesRect.left || candRect.left > yesRect.right || candRect.bottom < yesRect.top || candRect.top > yesRect.bottom)) {
        continue;
      } else break;
    } while (true);

    noBtn.style.left = `${candidateX}px`;
    noBtn.style.top = `${candidateY}px`;

    // brief sad expression
    bear.src = sadBear;
    setTimeout(() => bear.src = happyBear, 1400);

    startMusic();
  }

  // Add handlers for mouse and touch
  noBtn.addEventListener('mouseenter', moveNoButton);
  noBtn.addEventListener('touchstart', (ev) => {
    ev.preventDefault(); // prevent click before moving
    moveNoButton();
  }, { passive: false });

  // Yes button: celebrate!
  yesBtn.addEventListener('click', () => {
    startMusic();
    // gentle grow animation
    yesBtn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 380 });

    // Launch confetti
    const duration = 2200;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 160, ticks: 60, zIndex: 999 };

    (function fire() {
      // left
      confetti(Object.assign({}, defaults, { particleCount: 25, origin: { x: 0.1, y: 0.2 } }));
      // right
      confetti(Object.assign({}, defaults, { particleCount: 25, origin: { x: 0.9, y: 0.2 } }));
      if (Date.now() < animationEnd) requestAnimationFrame(fire);
    })();

    // spawn hearts near the Yes button
    const yesRect = yesBtn.getBoundingClientRect();
    for (let i=0;i<9;i++){
      setTimeout(() => {
        const rx = yesRect.left + yesRect.width * (0.2 + Math.random()*0.6);
        const ry = yesRect.top + yesRect.height * (0.1 + Math.random()*0.6);
        createHeart(rx, ry, ['#ff4d88','#ff9ac2','#ffc0dd'][Math.floor(Math.random()*3)]);
      }, i*80);
    }

    openModal();
  });

  // Modal logic
  function openModal() {
    modal.setAttribute('aria-hidden','false');
    modal.style.pointerEvents = 'auto';
    // focus first actionable element inside
    modalClose.focus();
  }
  function closeModal() {
    modal.setAttribute('aria-hidden','true');
    modal.style.pointerEvents = 'none';
    yesBtn.focus();
  }
  modalClose.addEventListener('click', () => {
    closeModal();
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
  });

  // Ensure music starts only after a gesture — also attach one-time body listeners
  function onFirstInteraction() {
    startMusic();
    document.body.removeEventListener('click', onFirstInteraction);
    document.body.removeEventListener('touchstart', onFirstInteraction);
  }
  document.body.addEventListener('click', onFirstInteraction, { once:true });
  document.body.addEventListener('touchstart', onFirstInteraction, { once:true });

  // Small accessibility: keyboard support for No button (makes it move instead of being clicked)
  noBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      moveNoButton();
    }
  });

  // Clean up interval on unload
  window.addEventListener('beforeunload', () => clearInterval(heartInterval));
});
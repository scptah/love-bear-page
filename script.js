// script.js — interactive logic for the love-bear page

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  const bear = document.getElementById('bear'); // now a div with emoji
  const music = document.getElementById('bgMusic');
  const musicBtn = document.getElementById('musicBtn');
  const volume = document.getElementById('volume');
  const heartsContainer = document.getElementById('hearts');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  const title = document.getElementById('title');
  const poohArea = document.getElementById('poohArea');
  const signature = document.getElementById('signature');

  // Name inputs (may be absent if older index.html)
  const fromInput = document.getElementById('fromInput');
  const toInput = document.getElementById('toInput');
  const setNamesBtn = document.getElementById('setNamesBtn');

  let musicStarted = false;

  // Query params support
  const params = new URLSearchParams(window.location.search);
  const nameParam = params.get('name'); // legacy param: sets the 'to' name

  if (nameParam) {
    title.textContent = `Will you go out with me, ${decodeURIComponent(nameParam)}? ❤️`;
  }

  // Bear emoji states
  const happyEmoji = '🐻';
  const sadEmoji = '😢';
  // initialize bear emoji (if element exists)
  if (bear) bear.textContent = happyEmoji;

  // Defaults for pixel celebration
  // Supply a direct image via ?pooh=URL (direct image link) or rely on fallback
  const defaultPooh = ''; // leave empty so fallback SVG or data URI is used if not provided

  // Adjusted pixelation parameters (reduced scale)
  // smaller final scale -> less huge blocks
  const PIXEL_SMALL_WIDTH = 20; // small resolution used when downscaling
  const PIXEL_SCALE = 6;        // visual scale factor (reduced from larger values)

  // Music helpers
  function startMusic() {
    if (!musicStarted && music) {
      music.volume = parseFloat(volume.value || 0.6);
      music.play().catch(() => {});
      musicStarted = true;
      if (musicBtn) {
        musicBtn.textContent = '🔊';
        musicBtn.setAttribute('aria-pressed','true');
      }
    }
  }
  function toggleMusic() {
    if (!music) return;
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
  if (volume) volume.addEventListener('input', () => { if (music) music.volume = parseFloat(volume.value); });
  if (musicBtn) musicBtn.addEventListener('click', () => { startMusic(); toggleMusic(); });

  // Heart animation helper (unchanged)
  function createHeart(x, y, color) {
    const el = document.createElement('div');
    el.className = 'heart';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <path fill="${color}" d="M12 21s-7.5-4.9-10-8.1C-0.1 9.9 2 5 6 5c2.2 0 3.5 1.2 4 2 .5-.8 1.8-2 4-2 4 0 6.1 4.9 4 7.9-2.5 3.1-10 8.1-10 8.1z"/>
    </svg>`;
    const dur = 2200 + Math.random()*1400;
    el.style.animationDuration = `${dur}ms`;
    el.style.transform = `translateY(0) rotate(${Math.random()*30-15}deg)`;
    heartsContainer.appendChild(el);
    setTimeout(()=> el.remove(), dur + 200);
  }
  let heartInterval = setInterval(() => {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const x = vw * (0.45 + (Math.random()-0.5)*0.18);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const y = vh - 80 + (Math.random()*20 - 10);
    createHeart(x, y, ['#ff6b9a','#ff9ac2','#ff4d88'][Math.floor(Math.random()*3)]);
  }, 800);

  // No-button evasive behavior — adapted to emoji bear
  function moveNoButton() {
    const container = document.querySelector('.buttons');
    if (!container || !noBtn || !yesBtn) return;
    const rect = container.getBoundingClientRect();
    const yesRect = yesBtn.getBoundingClientRect();

    const maxX = Math.max(6, rect.width - noBtn.offsetWidth - 6);
    const maxY = Math.max(6, rect.height - noBtn.offsetHeight - 6);

    let candidateX, candidateY, tries = 0;
    do {
      candidateX = Math.random() * maxX;
      candidateY = Math.random() * maxY;
      tries++;
      if (tries > 12) break;
      const candRect = {
        left: rect.left + candidateX,
        right: rect.left + candidateX + noBtn.offsetWidth,
        top: rect.top + candidateY,
        bottom: rect.top + candidateY + noBtn.offsetHeight
      };
      if (!(candRect.right < yesRect.left || candRect.left > yesRect.right || candRect.bottom < yesRect.top || candRect.top > yesRect.bottom)) {
        continue;
      } else break;
    } while (true);

    noBtn.style.left = `${candidateX}px`;
    noBtn.style.top = `${candidateY}px`;

    // show sad emoji briefly
    if (bear) {
      bear.textContent = sadEmoji;
      setTimeout(() => { if (bear) bear.textContent = happyEmoji; }, 1200);
    }
    startMusic();
  }
  if (noBtn) {
    noBtn.addEventListener('mouseenter', moveNoButton);
    noBtn.addEventListener('touchstart', (ev) => { ev.preventDefault(); moveNoButton(); }, { passive: false });
    noBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        moveNoButton();
      }
    });
  }

  // Name form behavior: set header & signature
  function setNames(fromName, toName) {
    // Update header to address 'to' name if present, otherwise leave default
    if (toName && toName.trim()) {
      title.textContent = `Will you go out with me, ${toName.trim()}? ❤️`;
    } else {
      if (nameParam) title.textContent = `Will you go out with me, ${decodeURIComponent(nameParam)}? ❤️`;
      else title.textContent = 'Will you go out with me? ❤️';
    }

    // Show a signature line like "From: <from>"
    if (fromName && fromName.trim()) {
      signature.textContent = `From: ${fromName.trim()}`;
      signature.style.display = 'block';
      signature.setAttribute('aria-hidden','false');
    } else {
      signature.textContent = '';
      signature.style.display = 'none';
      signature.setAttribute('aria-hidden','true');
    }
  }

  if (setNamesBtn) {
    setNamesBtn.addEventListener('click', () => {
      const from = fromInput ? fromInput.value : '';
      const to = toInput ? toInput.value : '';
      setNames(from, to);
    });
  }

  // Pixelate helper (draw small then scale up) — reduced scale values
  function showPixelatedImage(imageUrl, smallWidth = PIXEL_SMALL_WIDTH, scale = PIXEL_SCALE) {
    return new Promise((resolve, reject) => {
      if (!imageUrl) return reject(new Error('No image URL provided'));
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const sw = smallWidth;
        const sh = Math.round(smallWidth * (img.height / img.width)) || smallWidth;
        const canvas = document.createElement('canvas');
        canvas.width = sw;
        canvas.height = sh;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.clearRect(0, 0, sw, sh);
        ctx.drawImage(img, 0, 0, sw, sh);
        canvas.style.width = (sw * scale) + 'px';
        canvas.style.height = (sh * scale) + 'px';
        canvas.className = 'pixel-canvas';
        resolve(canvas);
      };
      img.onerror = () => reject(new Error('Image load error (CORS/broken URL)'));
      img.src = imageUrl;
    });
  }

  // Yes button celebration
  yesBtn.addEventListener('click', async () => {
    startMusic();
    yesBtn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 360 });

    const duration = 1800;
    const animationEnd = Date.now() + duration;
    if (typeof confetti === 'function') {
      const defaults = { startVelocity: 30, spread: 140, ticks: 50, zIndex: 999 };
      (function fire() {
        confetti(Object.assign({}, defaults, { particleCount: 20, origin: { x: 0.1, y: 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount: 20, origin: { x: 0.9, y: 0.2 } }));
        if (Date.now() < animationEnd) requestAnimationFrame(fire);
      })();
    } else {
      for (let i=0;i<12;i++){
        setTimeout(()=> createHeart(window.innerWidth * (0.2 + Math.random()*0.6), window.innerHeight * (0.15 + Math.random()*0.25), ['#ff4d88','#ff9ac2','#ffc0dd'][Math.floor(Math.random()*3)]), i*60);
      }
    }

    const yesRect = yesBtn.getBoundingClientRect();
    for (let i=0;i<9;i++){
      setTimeout(() => {
        const rx = yesRect.left + yesRect.width * (0.2 + Math.random()*0.6);
        const ry = yesRect.top + yesRect.height * (0.1 + Math.random()*0.6);
        createHeart(rx, ry, ['#ff4d88','#ff9ac2','#ffc0dd'][Math.floor(Math.random()*3)]);
      }, i*80);
    }

    poohArea.innerHTML = '';
    poohArea.setAttribute('aria-hidden', 'true');

    const poohUrl = params.get('pooh') || defaultPooh;
    const embeddedFallback = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
      <rect width="8" height="8" fill="%23ffecb3"/>
      <rect x="1" y="1" width="6" height="4" fill="%23ffd54f"/>
      <rect x="1" y="5" width="6" height="2" fill="%23d32f2f"/>
      </svg>
    ');

    const imageToLoad = poohUrl || embeddedFallback;
    try {
      const canvas = await showPixelatedImage(imageToLoad, PIXEL_SMALL_WIDTH, PIXEL_SCALE);
      canvas.classList.add('pop');
      poohArea.appendChild(canvas);
      poohArea.setAttribute('aria-hidden', 'false');
    } catch (err) {
      poohArea.innerHTML = '<p style="color:#d81b60">Could not load celebration image (CORS or invalid URL). Try hosting the image in the repo or using a direct image URL.</p>';
      poohArea.setAttribute('aria-hidden', 'false');
    }

    const toName = toInput ? toInput.value : (nameParam || '');
    const fromName = fromInput ? fromInput.value : '';
    if (toName) {
      const modalBody = document.getElementById('modalBody');
      if (modalBody) {
        modalBody.textContent = `I knew you'd say yes, ${toName}! Let's make a lovely plan together ✨`;
      }
    }

    openModal();
  });

  // Modal open/close
  function openModal() {
    modal.setAttribute('aria-hidden','false');
    modal.style.pointerEvents = 'auto';
    modalClose.focus();
  }
  function closeModal() {
    modal.setAttribute('aria-hidden','true');
    modal.style.pointerEvents = 'none';
    yesBtn.focus();
    if (poohArea) {
      poohArea.innerHTML = '';
      poohArea.setAttribute('aria-hidden','true');
    }
  }
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal(); });

  // Ensure music starts only after a gesture
  function onFirstInteraction() {
    startMusic();
    document.body.removeEventListener('click', onFirstInteraction);
    document.body.removeEventListener('touchstart', onFirstInteraction);
  }
  document.body.addEventListener('click', onFirstInteraction, { once:true });
  document.body.addEventListener('touchstart', onFirstInteraction, { once:true });

  // Clean up on unload
  window.addEventListener('beforeunload', () => clearInterval(heartInterval));
});

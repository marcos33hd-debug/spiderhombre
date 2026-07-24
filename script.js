/* ==========================================================
   CONFIGURACIÓN — edita solo esto para cambiar la fecha
   ========================================================== */
const CONFIG = {
  // Formato: 'YYYY-MM-DD'
  date: '2026-08-28',
};

/* ==========================================================
   FECHA — la formatea y la pone en el subtítulo
   ========================================================== */
(function setDate(){
  const el = document.getElementById('date-label');
  if(!el) return;

  const [y, m, d] = CONFIG.date.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);

  const formatted = dateObj.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
  });

  el.textContent = formatted;
})();

/* ==========================================================
   FONDO — campo de estrellas sutil en canvas
   ========================================================== */
(function starfield(){
  const canvas = document.getElementById('sky');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, stars, reduced;

  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.floor((w * h) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.1 + 0.2,
      baseAlpha: Math.random() * 0.5 + 0.15,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.4 + 0.15,
      driftX: (Math.random() - 0.5) * 0.05,
      driftY: (Math.random() - 0.5) * 0.05,
    }));
  }

  function tick(t){
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#f3f1ec';

    for(const s of stars){
      const twinkle = reduced ? s.baseAlpha : s.baseAlpha + Math.sin(t * 0.001 * s.speed + s.phase) * 0.18;
      ctx.globalAlpha = Math.max(0, twinkle);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      if(!reduced){
        s.x += s.driftX;
        s.y += s.driftY;
        if(s.x < 0) s.x = w;
        if(s.x > w) s.x = 0;
        if(s.y < 0) s.y = h;
        if(s.y > h) s.y = 0;
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(tick);
})();

/* ==========================================================
   SCROLL REVEAL — aparición suave de elementos
   ========================================================== */
(function scrollReveal(){
  const items = document.querySelectorAll('.reveal');
  if(!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if(entry.isIntersecting){
        setTimeout(() => entry.target.classList.add('visible'), i * 40);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach(item => observer.observe(item));
})();

/* ==========================================================
   CTA — corazones flotando + mensaje final
   ========================================================== */
(function cta(){
  const btn = document.getElementById('cta-btn');
  const overlay = document.getElementById('answer-overlay');
  if(!btn || !overlay) return;

  let answered = false;

  function spawnHearts(originRect){
    const count = 18;
    for(let i = 0; i < count; i++){
      setTimeout(() => {
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = '❤';

        const startX = originRect.left + originRect.width / 2 + (Math.random() - 0.5) * originRect.width;
        const size = 12 + Math.random() * 20;
        const drift = (Math.random() - 0.5) * 160;
        const duration = 2600 + Math.random() * 1800;

        heart.style.left = `${startX}px`;
        heart.style.fontSize = `${size}px`;
        heart.style.opacity = '0';

        document.body.appendChild(heart);

        heart.animate([
          { transform: 'translate(0, 0) scale(0.6)', opacity: 0 },
          { transform: `translate(${drift * 0.3}px, -35vh) scale(1)`, opacity: 0.9, offset: 0.25 },
          { transform: `translate(${drift}px, -95vh) scale(0.8)`, opacity: 0 },
        ], {
          duration,
          easing: 'cubic-bezier(.16,.84,.44,1)',
          fill: 'forwards',
        });

        setTimeout(() => heart.remove(), duration + 100);
      }, i * 70);
    }
  }

  btn.addEventListener('click', () => {
    if(answered) return;
    answered = true;

    const rect = btn.getBoundingClientRect();
    spawnHearts(rect);

    setTimeout(() => {
      overlay.classList.add('active');
    }, 500);

    overlay.addEventListener('click', () => {
      overlay.classList.remove('active');
      answered = false;
    }, { once: true });
  });
})();

/* ==========================================================
   MÚSICA — reproducir / pausar
   ========================================================== */
(function music(){
  const btn = document.getElementById('music-toggle');
  const audio = document.getElementById('bg-audio');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  if(!btn || !audio) return;

  let playing = false;

  btn.addEventListener('click', () => {
    if(!playing){
      audio.volume = 0.5;
      audio.play().catch(() => {
        // No hay archivo de audio en assets/song.mp3 todavía.
        console.info('Añade tu canción en assets/song.mp3 para activar la música.');
      });
    } else {
      audio.pause();
    }
    playing = !playing;
    iconPlay.style.display = playing ? 'none' : 'block';
    iconPause.style.display = playing ? 'block' : 'none';
  });
})();

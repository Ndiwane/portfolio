/* ═══════════════════════════════════════════════
   NDIWANE PORTFOLIO — portfolio.js
═══════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════
   1. CUSTOM CURSOR
══════════════════════════════ */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  if (!cursor || !ring) return;

  let mx = 0, my = 0, rx = window.innerWidth / 2, ry = window.innerHeight / 2;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // smooth ring follow
  (function animRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  // hover state on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .service-card, .project-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); ring.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); ring.classList.remove('hover'); });
  });
})();


/* ══════════════════════════════
   2. NAVBAR — scroll + active link
══════════════════════════════ */
(function initNav() {
  const navbar  = document.querySelector('.navbar');
  const links   = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  // scroll class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // active link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
})();


/* ══════════════════════════════
   3. HAMBURGER MENU
══════════════════════════════ */
(function initMobile() {
  const ham  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!ham || !menu) return;

  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();


/* ══════════════════════════════
   4. SCROLL REVEAL
══════════════════════════════ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .tl-item');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
})();


/* ══════════════════════════════
   5. TYPEWRITER HERO TITLE
══════════════════════════════ */
(function initTypewriter() {
  const el = document.getElementById('typewriterRole');
  if (!el) return;

  const roles = [
    'Software Developer',
    'Flutter Engineer',
    'Cybersecurity Learner',
    'Mobile App Builder',
    'B.Tech Graduate 🎓',
  ];

  let roleIdx = 0, charIdx = 0, deleting = false;
  const SPEED_TYPE = 80, SPEED_DELETE = 40, PAUSE = 1800;

  function tick() {
    const current = roles[roleIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) { deleting = true; setTimeout(tick, PAUSE); return; }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? SPEED_DELETE : SPEED_TYPE);
  }
  tick();
})();


/* ══════════════════════════════
   6. ANIMATED COUNTERS
══════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseFloat(el.dataset.count);
      const dur = 1800;
      const step = 16;
      const steps = dur / step;
      let cur = 0;

      const timer = setInterval(() => {
        cur += end / steps;
        if (cur >= end) { cur = end; clearInterval(timer); }
        el.textContent = Number.isInteger(end) ? Math.round(cur) : cur.toFixed(1);
      }, step);

      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
})();


/* ══════════════════════════════
   7. PARALLAX HERO BLOBS
══════════════════════════════ */
(function initParallax() {
  const blobs = document.querySelectorAll('.hero-blob');
  if (!blobs.length) return;

  window.addEventListener('mousemove', e => {
    const cx = e.clientX / window.innerWidth  - 0.5;
    const cy = e.clientY / window.innerHeight - 0.5;
    blobs.forEach((b, i) => {
      const depth = (i + 1) * 12;
      b.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
    });
  }, { passive: true });
})();


/* ══════════════════════════════
   8. HERO TEXT WORD HOVER SPLIT
══════════════════════════════ */
(function initWordHover() {
  const targets = document.querySelectorAll('.word-hover');
  targets.forEach(el => {
    const words = el.textContent.trim().split(' ');
    el.innerHTML = words.map(w =>
      `<span class="word-unit" style="display:inline-block;transition:transform 0.3s,color 0.3s;cursor:default;">${w}</span>`
    ).join(' ');

    el.querySelectorAll('.word-unit').forEach(span => {
      span.addEventListener('mouseenter', () => {
        span.style.transform = 'translateY(-4px)';
        span.style.color = 'var(--forest)';
      });
      span.addEventListener('mouseleave', () => {
        span.style.transform = '';
        span.style.color = '';
      });
    });
  });
})();


/* ══════════════════════════════
   9. MAGNETIC BUTTONS
══════════════════════════════ */
(function initMagnetic() {
  const btns = document.querySelectorAll('.btn-primary, .btn-outline, .nav-hire');
  btns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * 0.28;
      const dy = (e.clientY - cy) * 0.28;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();


/* ══════════════════════════════
   10. STAGGER SERVICE CARDS
══════════════════════════════ */
(function initServiceStagger() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach((c, i) => {
    c.style.transitionDelay = `${i * 0.07}s`;
  });
})();


/* ══════════════════════════════
   11. TILT EFFECT ON PROJECT CARDS
══════════════════════════════ */
(function initTilt() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top ) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-6px)`;
      card.style.transition = 'transform 0.1s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    });
  });
})();


/* ══════════════════════════════
   12. CONTACT FORM
══════════════════════════════ */
(function initForm() {
  const btn = document.getElementById('formSubmit');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('#contactForm .form-input, #contactForm .form-textarea');
    let valid = true;

    inputs.forEach(input => {
      input.style.borderColor = '';
      if (!input.value.trim()) {
        input.style.borderColor = 'var(--red)';
        valid = false;
      }
    });

    if (!valid) {
      btn.textContent = '⚠ Please fill all fields';
      setTimeout(() => { btn.innerHTML = 'Send Message <span>→</span>'; }, 2000);
      return;
    }

    btn.innerHTML = '<span style="display:inline-flex;gap:.4rem;align-items:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Sending…</span>';
    btn.disabled = true;

    setTimeout(() => {
      btn.classList.add('sent');
      btn.innerHTML = '✓ Message Sent!';
      inputs.forEach(i => i.value = '');
      setTimeout(() => {
        btn.classList.remove('sent');
        btn.innerHTML = 'Send Message <span>→</span>';
        btn.disabled = false;
        btn.style.background = '';
      }, 3500);
    }, 1800);
  });
})();


/* ══════════════════════════════
   13. BACK TO TOP
══════════════════════════════ */
(function initBackTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;
  window.addEventListener('scroll', () => { btn.classList.toggle('show', window.scrollY > 500); }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();


/* ══════════════════════════════
   14. LEAF / PARTICLE CANVAS
══════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('leafCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const COLORS = ['rgba(45,106,79,', 'rgba(82,183,136,', 'rgba(192,57,43,', 'rgba(64,145,108,'];

  class Leaf {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x    = Math.random() * canvas.width;
      this.y    = init ? Math.random() * canvas.height : -12;
      this.size = 2 + Math.random() * 3.5;
      this.speedY = 0.4 + Math.random() * 0.7;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.opacity = 0.12 + Math.random() * 0.2;
      this.rot  = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.03;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.y   += this.speedY;
      this.x   += this.speedX;
      this.rot += this.rotSpeed;
      if (this.y > canvas.height + 20) this.reset();
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const leaves = Array.from({ length: 35 }, () => new Leaf());
  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    leaves.forEach(l => { l.update(); l.draw(); });
    requestAnimationFrame(draw);
  })();
})();


/* ══════════════════════════════
   15. SCRAMBLE TEXT ON HOVER (nav logo)
══════════════════════════════ */
(function initScramble() {
  const logo = document.querySelector('.nav-logo');
  if (!logo) return;
  const orig = logo.textContent;
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let frame = 0, anim = null;

  logo.addEventListener('mouseenter', () => {
    cancelAnimationFrame(anim);
    let iter = 0;
    function step() {
      logo.textContent = orig.split('').map((ch, i) => {
        if (i < iter) return ch;
        return ch === '.' ? ch : CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');
      if (iter < orig.length) { iter += 0.5; anim = requestAnimationFrame(step); }
      else logo.textContent = orig;
    }
    step();
  });
})();


/* ══════════════════════════════
   16. SECTION TITLE CHAR REVEAL
══════════════════════════════ */
(function initCharReveal() {
  const titles = document.querySelectorAll('.char-reveal');
  titles.forEach(el => {
    const text = el.textContent;
    el.innerHTML = text.split('').map((ch, i) =>
      `<span style="display:inline-block;opacity:0;transform:translateY(20px);transition:opacity 0.4s ${i * 0.03}s,transform 0.4s ${i * 0.03}s">${ch === ' ' ? '&nbsp;' : ch}</span>`
    ).join('');

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          el.querySelectorAll('span').forEach(s => {
            s.style.opacity = '1'; s.style.transform = 'translateY(0)';
          });
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
  });
})();

/* ═══════════════════════════════════════════════
   NDIWANE PORTFOLIO — hire.js
   Hire Me Page Interactions
═══════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════
   1. CURSOR
══════════════════════════ */
(function () {
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  if (!cur) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px'; cur.style.top = my + 'px';
  });
  (function anim() {
    rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(anim);
  })();
  document.querySelectorAll('a, button, .radio-opt, .check-opt, .cv-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cur.classList.add('hover'); ring.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { cur.classList.remove('hover'); ring.classList.remove('hover'); });
  });
})();


/* ══════════════════════════
   2. BACKGROUND CANVAS — floating circles
══════════════════════════ */
(function () {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const COLS = ['rgba(45,106,79,', 'rgba(82,183,136,', 'rgba(192,57,43,', 'rgba(201,212,220,'];
  const circles = Array.from({ length: 20 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 60 + Math.random() * 120,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    opacity: 0.03 + Math.random() * 0.06,
    color: COLS[Math.floor(Math.random() * COLS.length)],
  }));

  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(c => {
      c.x += c.vx; c.y += c.vy;
      if (c.x < -c.r) c.x = canvas.width + c.r;
      if (c.x > canvas.width + c.r) c.x = -c.r;
      if (c.y < -c.r) c.y = canvas.height + c.r;
      if (c.y > canvas.height + c.r) c.y = -c.r;
      const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
      g.addColorStop(0, c.color + c.opacity + ')');
      g.addColorStop(1, c.color + '0)');
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
})();


/* ══════════════════════════
   3. MULTI-STEP FORM — step navigation
══════════════════════════ */
let currentStep = 1;

function goStep(n) {
  // validate before moving forward
  if (n > currentStep && !validateStep(currentStep)) return;

  document.getElementById('step' + currentStep).classList.remove('active');
  document.getElementById('step' + n).classList.add('active');

  // update progress indicators
  document.querySelectorAll('.fs-step').forEach(el => {
    const s = parseInt(el.dataset.step);
    el.classList.remove('active', 'done');
    if (s === n) el.classList.add('active');
    if (s < n) el.classList.add('done');
  });

  document.querySelectorAll('.fs-line').forEach((line, idx) => {
    line.classList.toggle('done', idx < n - 1);
  });

  // update step dots to checkmarks when done
  document.querySelectorAll('.fs-step.done .fs-dot').forEach(d => { d.textContent = '✓'; });
  document.querySelectorAll('.fs-step:not(.done) .fs-dot').forEach(d => {
    const s = d.closest('.fs-step').dataset.step;
    if (d.textContent === '✓') d.textContent = s;
  });

  currentStep = n;

  // if going to step 3, build summary
  if (n === 3) buildSummary();

  // scroll form into view smoothly
  document.querySelector('.hire-form-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
}


/* ══════════════════════════
   4. VALIDATION
══════════════════════════ */
function validateStep(step) {
  let valid = true;

  function setErr(id, msg) {
    const el = document.getElementById('err_' + id);
    const inp = document.getElementById(id);
    if (el) el.textContent = msg;
    if (inp) inp.classList.toggle('error', !!msg);
    if (msg) valid = false;
  }

  if (step === 1) {
    const name = document.getElementById('emp_name').value.trim();
    const email = document.getElementById('emp_email').value.trim();
    setErr('emp_name', name ? '' : 'Please enter your name.');
    setErr('emp_email', email
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Please enter a valid email.'
      : 'Please enter your email.');
  }

  if (step === 3) {
    const title = document.getElementById('job_title').value.trim();
    const desc  = document.getElementById('job_desc').value.trim();
    const consent = document.getElementById('consent').checked;
    setErr('job_title', title ? '' : 'Please enter the job/role title.');
    setErr('job_desc', desc ? '' : 'Please describe the role or project.');
    const ce = document.getElementById('err_consent');
    if (ce) ce.textContent = consent ? '' : 'Please accept the privacy notice.';
    if (!consent) valid = false;
  }

  return valid;
}


/* ══════════════════════════
   5. SUMMARY PREVIEW (step 3)
══════════════════════════ */
function buildSummary() {
  const name     = document.getElementById('emp_name').value.trim();
  const company  = document.getElementById('emp_company').value.trim();
  const email    = document.getElementById('emp_email').value.trim();
  const engType  = document.querySelector('input[name="eng_type"]:checked');
  const skills   = [...document.querySelectorAll('input[name="skills"]:checked')].map(i => i.value);
  const workMode = document.getElementById('work_mode').value;
  const budget   = document.getElementById('budget').value.trim();

  const grid = document.getElementById('isSummaryGrid');
  grid.innerHTML = [
    ['From',     name + (company ? ` · ${company}` : '')],
    ['Email',    email],
    ['Type',     engType ? capitalize(engType.value) : '—'],
    ['Skills',   skills.length ? skills.join(', ') : '—'],
    ['Work Mode', workMode ? capitalize(workMode) : '—'],
    ['Budget',   budget || 'Not specified'],
  ].map(([l, v]) => `<div class="is-item"><span class="is-label">${l}</span><span class="is-val">${v}</span></div>`).join('');
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


/* ══════════════════════════
   6. SUBMIT INQUIRY
══════════════════════════ */
function submitInquiry() {
  if (!validateStep(3)) return;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔧 SETUP: Paste your Formspree endpoint URL below.
  //    1. Go to https://formspree.io and sign up free
  //    2. Create a new form → copy the endpoint URL
  //    3. Replace the placeholder below with your URL
  //    Example: 'https://formspree.io/f/xyzabcde'
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const FORMSPREE_URL = 'https://formspree.io/f/maqajeno';

  const btn = document.getElementById('submitBtn');
  const txt = document.getElementById('submitText');

  // --- collect all form data ---
  const name     = document.getElementById('emp_name').value.trim();
  const company  = document.getElementById('emp_company').value.trim();
  const email    = document.getElementById('emp_email').value.trim();
  const phone    = document.getElementById('emp_phone').value.trim();
  const website  = document.getElementById('emp_website').value.trim();
  const empRole  = document.getElementById('emp_role').value.trim();
  const engType  = document.querySelector('input[name="eng_type"]:checked');
  const skills   = [...document.querySelectorAll('input[name="skills"]:checked')].map(i => i.value);
  const workMode = document.getElementById('work_mode').value;
  const startDate = document.getElementById('start_date').value;
  const duration = document.getElementById('duration').value.trim();
  const budget   = document.getElementById('budget').value.trim();
  const jobTitle = document.getElementById('job_title').value.trim();
  const jobDesc  = document.getElementById('job_desc').value.trim();
  const whyMe    = document.getElementById('why_me').value.trim();
  const source   = document.getElementById('source').value;

  // --- loading state ---
  btn.disabled = true;
  txt.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
      style="animation:spin .8s linear infinite">
      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0"/>
    </svg> Sending…`;

  if (!document.getElementById('spinKF')) {
    const s = document.createElement('style'); s.id = 'spinKF';
    s.textContent = '@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}';
    document.head.appendChild(s);
  }

  // --- build a nicely formatted message body for the email ---
  const msgBody = `
NEW HIRE INQUIRY — Ndiwane Portfolio
=====================================

EMPLOYER DETAILS
----------------
Name:        ${name}
Company:     ${company || 'Not provided'}
Email:       ${email}
Phone:       ${phone || 'Not provided'}
Website:     ${website || 'Not provided'}
Their Role:  ${empRole || 'Not provided'}

OPPORTUNITY DETAILS
-------------------
Engagement Type: ${engType ? capitalize(engType.value) : 'Not specified'}
Job Title:       ${jobTitle}
Skills Needed:   ${skills.length ? skills.join(', ') : 'Not specified'}
Work Mode:       ${workMode ? capitalize(workMode) : 'Not specified'}
Start Date:      ${startDate || 'Not specified'}
Duration:        ${duration || 'Not specified'}
Budget / Salary: ${budget || 'Not specified'}

JOB DESCRIPTION
---------------
${jobDesc}

WHY ME?
-------
${whyMe || 'Not provided'}

HOW THEY FOUND ME
-----------------
${source ? capitalize(source) : 'Not specified'}
`.trim();

  // --- send to Formspree ---
  fetch(FORMSPREE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      _subject:    `[Hire Inquiry] ${jobTitle} — from ${name}${company ? ' @ ' + company : ''}`,
      _replyto:    email,
      name,
      email,
      phone:       phone || 'Not provided',
      company:     company || 'Not provided',
      employer_role: empRole || 'Not provided',
      website:     website || 'Not provided',
      engagement_type: engType ? capitalize(engType.value) : 'Not specified',
      job_title:   jobTitle,
      skills_needed: skills.join(', ') || 'Not specified',
      work_mode:   workMode || 'Not specified',
      start_date:  startDate || 'Not specified',
      duration:    duration || 'Not specified',
      budget,
      job_description: jobDesc,
      why_me:      whyMe || 'Not provided',
      found_via:   source || 'Not specified',
      message:     msgBody,
    }),
  })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      // ✅ SUCCESS
      showSuccess(name, email, jobTitle, company, engType);
    } else {
      // Formspree returned an error (e.g. endpoint not configured yet)
      showFormError(btn, txt, data.error || 'Submission failed. Please try emailing directly.');
    }
  })
  .catch(() => {
    // Network error or FORMSPREE_URL still has placeholder
    if (FORMSPREE_URL.includes('YOUR_FORM_ID')) {
      // Dev mode: show success anyway so you can test the UI
      showSuccess(name, email, jobTitle, company, engType, true);
    } else {
      showFormError(btn, txt, 'Network error. Please check your connection or email me directly.');
    }
  });
}

/* ── helpers ── */
function showSuccess(name, email, jobTitle, company, engType, devMode = false) {
  document.getElementById('hireForm').style.display = 'none';
  document.querySelector('.hfw-header').style.display = 'none';
  document.querySelector('.form-steps').style.display = 'none';

  const ss = document.getElementById('successState');
  ss.classList.add('show');
  document.getElementById('senderName').textContent = name;

  const details = document.getElementById('ssDetails');
  details.innerHTML = [
    devMode ? '⚠️ <strong>Dev mode</strong> — add your Formspree URL to hire.js to send real emails.' : '',
    `📧 Confirmation to: <strong>${email}</strong>`,
    `💼 Role: <strong>${jobTitle}</strong>`,
    `🏢 Company: <strong>${company || 'Not provided'}</strong>`,
    `📋 Type: <strong>${engType ? capitalize(engType.value) : 'Not specified'}</strong>`,
  ].filter(Boolean).map(s => `<div>${s}</div>`).join('');

  spawnConfetti();
}

function showFormError(btn, txt, message) {
  btn.disabled = false;
  txt.innerHTML = '⚠ Error — Try Again';
  btn.style.background = 'var(--red)';

  // show error banner
  let banner = document.getElementById('formErrorBanner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'formErrorBanner';
    banner.style.cssText = `
      background:var(--red-pale);border:1.5px solid var(--red);
      border-radius:10px;padding:.85rem 1.1rem;
      font-size:.85rem;color:var(--red);font-weight:600;
      margin-bottom:1rem;
    `;
    document.getElementById('step3').prepend(banner);
  }
  banner.textContent = '⚠ ' + message;

  setTimeout(() => {
    btn.style.background = '';
    txt.innerHTML = 'Send Inquiry 🚀';
  }, 3000);
}


/* ══════════════════════════
   7. CONFETTI on success
══════════════════════════ */
function spawnConfetti() {
  const colors = ['#1b4332','#52b788','#c0392b','#f5c842','#c9d4dc'];
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      const size = 6 + Math.random() * 8;
      const x = Math.random() * window.innerWidth;
      el.style.cssText = `
        position:fixed;top:-10px;left:${x}px;
        width:${size}px;height:${size}px;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        z-index:9999;pointer-events:none;
        animation:confettiFall ${1.5+Math.random()*1.5}s ease-in forwards;
        transform:rotate(${Math.random()*360}deg);
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3500);
    }, i * 40);
  }

  if (!document.getElementById('confettiKF')) {
    const s = document.createElement('style');
    s.id = 'confettiKF';
    s.textContent = `@keyframes confettiFall {
      to { top: 110vh; transform: rotate(${720}deg) translateX(${(Math.random()-0.5)*200}px); opacity:0; }
    }`;
    document.head.appendChild(s);
  }
}


/* ══════════════════════════
   8. RESET FORM
══════════════════════════ */
function resetForm() {
  document.getElementById('hireForm').reset();
  document.getElementById('hireForm').style.display = '';
  document.querySelector('.hfw-header').style.display = '';
  document.querySelector('.form-steps').style.display = '';
  document.getElementById('successState').classList.remove('show');
  document.querySelectorAll('.ferr').forEach(e => e.textContent = '');
  document.querySelectorAll('.fi.error').forEach(e => e.classList.remove('error'));
  goStep(1);
  currentStep = 1;
}


/* ══════════════════════════
   9. CHARACTER COUNTER
══════════════════════════ */
(function () {
  const ta = document.getElementById('job_desc');
  const counter = document.getElementById('charCount');
  if (!ta || !counter) return;
  ta.addEventListener('input', () => {
    const len = ta.value.length;
    counter.textContent = len;
    counter.style.color = len > 900 ? 'var(--red)' : 'var(--muted)';
    if (ta.value.length > 1000) ta.value = ta.value.slice(0, 1000);
  });
})();


/* ══════════════════════════
   10. CV DOWNLOAD
══════════════════════════ */
function handleCVDownload() {
  const btn = document.getElementById('cvDownloadBtn');
  const orig = btn.innerHTML;
  btn.textContent = '⏳ Preparing…';
  btn.disabled = true;

  setTimeout(() => {
    // Create a text-based CV since we don't have a PDF file
    const cvContent = `NDIWANE — CURRICULUM VITAE
=============================

CONTACT
Email:    ndiwane@email.com
GitHub:   github.com/Ndiwane
Location: Buea / Kumba, Cameroon
Phone:    +237 XXX XXX XXX

EDUCATION
---------
B.Tech in Software Development
University of Buea, Cameroon — 2020–2024

GCE Advanced Level
Cameroon GCE Board — Completed

GCE Ordinary Level
Cameroon GCE Board — Completed

CERTIFICATIONS
--------------
• Flutter & Dart Certification (2024)
• Prompt Engineering & AI Certification (2025)

SKILLS
------
Mobile: Flutter, Dart, Riverpod, Firebase
Backend: Node.js, Python, REST APIs, Cloud Functions
Security: Kali Linux, Nmap, Ethical Hacking Basics
Tools: Git, GitHub, VirtualBox, CinetPay Integration
Web: HTML, CSS, JavaScript

PROJECTS
--------
Agrinexa — Agriculture mobile app for Cameroon
  • Flutter, Firebase, Google Auth, CinetPay (MTN MoMo / Orange Money)
  • github.com/Ndiwane/agrinexa_server

Home Security Lab
  • Kali Linux VM, nmap scanning, TryHackMe CTF challenges

Student Portal
  • Web-based school management system

EXPERIENCE
----------
Freelance Flutter Developer — 2023–Present
  Building and maintaining cross-platform mobile apps

Cybersecurity Learner — 2024–Present
  Self-study via TryHackMe, HackTheBox, home lab

Software Development Intern — WandaTech
  Starting July 2026

REFERENCES
----------
Available upon request.
`;

    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'Ndiwane_CV.txt';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    btn.innerHTML = '✓ Downloaded!';
    btn.style.background = 'rgba(34,197,94,0.2)';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled = false;
      btn.style.background = '';
    }, 2500);
  }, 1000);
}


/* ══════════════════════════
   11. INPUT FOCUS ANIMATIONS
══════════════════════════ */
(function () {
  document.querySelectorAll('.fi').forEach(input => {
    input.addEventListener('focus', () => {
      input.style.transform = 'scale(1.01)';
    });
    input.addEventListener('blur', () => {
      input.style.transform = '';
    });
  });
})();


/* ══════════════════════════
   12. RADIO BUTTON RIPPLE
══════════════════════════ */
(function () {
  document.querySelectorAll('.radio-opt, .check-opt').forEach(opt => {
    opt.addEventListener('click', e => {
      const box = opt.querySelector('.ro-box, span');
      if (!box) return;
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;border-radius:50%;
        background:rgba(45,106,79,0.15);
        width:10px;height:10px;
        top:50%;left:50%;transform:translate(-50%,-50%) scale(0);
        pointer-events:none;
        animation:rippleOut .5s ease-out forwards;
      `;
      box.style.position = 'relative'; box.style.overflow = 'hidden';
      box.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  if (!document.getElementById('rippleKF')) {
    const s = document.createElement('style');
    s.id = 'rippleKF';
    s.textContent = '@keyframes rippleOut{to{transform:translate(-50%,-50%) scale(12);opacity:0;}}';
    document.head.appendChild(s);
  }
})();


/* ══════════════════════════
   13. SCROLL-BASED NAV shadow
══════════════════════════ */
(function () {
  const nav = document.querySelector('.hn');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 40 ? '0 4px 24px rgba(27,67,50,0.1)' : '';
  }, { passive: true });
})();
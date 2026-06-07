/* ═══════════════════════════════════════════════════════════════════
   OCCLUDENT — app.js
   ═══════════════════════════════════════════════════════════════════ */

/* ── NAVBAR: add .scrolled class on scroll ─────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── MOBILE MENU toggle ────────────────────────────────────────── */
const toggle     = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

toggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
}

/* ── SCROLL REVEAL via IntersectionObserver ────────────────────── */
const revealEls = document.querySelectorAll(
  '.service-card, .process-step, .contact-item, .about-grid, .stat-item, .about-highlights .highlight-item'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger cards within the same parent
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* ── ACTIVE NAV LINK on scroll ─────────────────────────────────── */
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks  = document.querySelectorAll('.nav-links a, #mobile-menu a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current
      ? '#35b5ac'
      : '';
  });
}, { passive: true });

/* ── CONTACT FORM ──────────────────────────────────────────────── */
const form     = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  feedback.className = '';
  feedback.textContent = '';

  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    feedback.className = 'error';
    feedback.textContent = 'Vul alle verplichte velden in (*)';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    feedback.className = 'error';
    feedback.textContent = 'Voer een geldig e-mailadres in.';
    return;
  }

  // Build mailto link as fallback (no server needed for static site)
  const subject = encodeURIComponent(form.subject.value || 'Bericht via website');
  const body    = encodeURIComponent(
    `Naam: ${name}\nPraktijk: ${form.practice.value}\nTelefoon: ${form.phone.value}\n\n${message}`
  );
  window.location.href = `mailto:info@occludent.nl?subject=${subject}&body=${body}`;

  feedback.className = 'success';
  feedback.textContent = '✓ Uw e-mailprogramma wordt geopend om het bericht te versturen.';
  form.reset();
});

/* ── SMOOTH SCROLL for all anchor links ───────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 70; // navbar height
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

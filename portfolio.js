/**
 * HOPE SAMUEL — TECHNICAL PROJECT MANAGER PORTFOLIO
 * High-performance interactive controller for themes, gallery filtering,
 * interactive TPM artifacts, delivery pipeline stepper, image lightbox,
 * and recruiter fast-actions.
 */

document.addEventListener('DOMContentLoaded', function () {
  // ---------- Theme Switcher ----------
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  function getStoredTheme() {
    try {
      return localStorage.getItem('hope_portfolio_theme');
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem('hope_portfolio_theme', theme);
    } catch (e) {}
  }

  function prefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (themeIcon) themeIcon.textContent = '☼';
    } else {
      root.setAttribute('data-theme', 'light');
      if (themeIcon) themeIcon.textContent = '☾';
    }
  }

  const initialTheme = getStoredTheme() || (prefersDark() ? 'dark' : 'light');
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      setStoredTheme(next);
      showToast(`Switched to ${next} mode`);
    });
  }

  // ---------- Mobile Navigation Menu ----------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
      const isOpen = mobileNav.classList.contains('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
      mobileMenuBtn.textContent = isOpen ? '✕' : '☰';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        mobileMenuBtn.textContent = '☰';
      });
    });
  }

  // ---------- Navigation Spy ----------
  const sections = document.querySelectorAll('section[id], header[id], footer[id]');
  const navLinks = document.querySelectorAll('.navlinks a');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // ---------- Interactive TPM Delivery Pipeline Stepper ----------
  const pipelineBtns = document.querySelectorAll('.pipeline-step-btn');
  const pipelinePanels = document.querySelectorAll('.pipeline-content-panel');

  pipelineBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const targetStep = this.getAttribute('data-step');

      pipelineBtns.forEach(b => b.classList.remove('active'));
      pipelinePanels.forEach(p => p.classList.remove('active'));

      this.classList.add('active');
      const targetPanel = document.getElementById(`step-panel-${targetStep}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // ---------- Platform Tabs (Case Study Gallery Filtering) ----------
  const platformTabBtns = document.querySelectorAll('.platform-tab-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  platformTabBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const filter = this.getAttribute('data-filter');

      platformTabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      galleryCards.forEach(card => {
        const platform = card.getAttribute('data-platform');
        if (filter === 'all' || platform === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ---------- Interactive TPM Artifacts Tabs ----------
  const artifactBtns = document.querySelectorAll('.artifact-tab-btn');
  const artifactPanels = document.querySelectorAll('.artifact-panel');

  artifactBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const targetArtifact = this.getAttribute('data-artifact');

      artifactBtns.forEach(b => b.classList.remove('active'));
      artifactPanels.forEach(p => p.classList.remove('active'));

      this.classList.add('active');
      const targetPanel = document.getElementById(`artifact-panel-${targetArtifact}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // ---------- Lightbox Modal for Screenshots ----------
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentGalleryIndex = 0;
  let visibleCards = [];

  function updateVisibleCards() {
    visibleCards = Array.from(galleryCards).filter(c => c.style.display !== 'none');
  }

  function openLightbox(index) {
    updateVisibleCards();
    if (index < 0 || index >= visibleCards.length) return;
    currentGalleryIndex = index;

    const card = visibleCards[currentGalleryIndex];
    const imgEl = card.querySelector('img');
    const titleEl = card.querySelector('.gallery-card-title');
    const copyEl = card.querySelector('.gallery-card-copy');

    if (imgEl && lightboxImg) {
      lightboxImg.src = imgEl.src;
      lightboxImg.alt = imgEl.alt;
    }
    if (titleEl && lightboxTitle) {
      lightboxTitle.textContent = titleEl.textContent;
    }
    if (copyEl && lightboxCaption) {
      lightboxCaption.textContent = copyEl.textContent;
    }

    if (lightboxModal) {
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  galleryCards.forEach(card => {
    card.addEventListener('click', function () {
      updateVisibleCards();
      const idx = visibleCards.indexOf(this);
      if (idx !== -1) {
        openLightbox(idx);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      updateVisibleCards();
      currentGalleryIndex = (currentGalleryIndex - 1 + visibleCards.length) % visibleCards.length;
      openLightbox(currentGalleryIndex);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      updateVisibleCards();
      currentGalleryIndex = (currentGalleryIndex + 1) % visibleCards.length;
      openLightbox(currentGalleryIndex);
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
      if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
    }
  });

  // ---------- 1-Click Copy Email & Phone with Toast ----------
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const textToCopy = this.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          showToast(`Direct copy: ${textToCopy}`);
        });
      }
    });
  });

  // ---------- Toast Notification Function ----------
  function showToast(message) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // ---------- Resume Modal Controller ----------
  const openResumeBtns = document.querySelectorAll('.open-resume-btn');
  const resumeModal = document.getElementById('resume-modal');
  const closeResumeBtn = document.getElementById('close-resume-btn');
  const printResumeBtn = document.getElementById('print-resume-btn');

  openResumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (resumeModal) {
        resumeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeResumeBtn && resumeModal) {
    closeResumeBtn.addEventListener('click', () => {
      resumeModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        resumeModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // ---------- Quick Contact Form (Mailto Generator) ----------
  const contactForm = document.getElementById('quick-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('form-name')?.value || '';
      const email = document.getElementById('form-email')?.value || '';
      const role = document.getElementById('form-role')?.value || 'Technical Project Manager / Delivery Lead Role';
      const message = document.getElementById('form-message')?.value || '';

      const subject = encodeURIComponent(`[Inquiry] ${role} - ${name}`);
      const body = encodeURIComponent(`Hi Hope,\n\nMy name is ${name} (${email}).\n\nI came across your portfolio and wanted to discuss an opportunity:\n\n${message}\n\nBest regards,\n${name}`);

      window.location.href = `mailto:samuelhopes8072@gmail.com?subject=${subject}&body=${body}`;
      showToast('Opening your email client...');
    });
  }

  // ---------- Back to Top Button ----------
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
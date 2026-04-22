/* ============================================
   OmugwoApp — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Newsletter card — scroll-triggered entrance + float ── */
  const newsletterCard = document.querySelector('.newsletter-float__card');
  if (newsletterCard) {
    new IntersectionObserver(([entry], obs) => {
      if (entry.isIntersecting) {
        newsletterCard.classList.add('is-visible');
        obs.unobserve(newsletterCard);
      }
    }, { threshold: 0.3 }).observe(newsletterCard);
  }

  /* ── Navbar — fix position after hero ── */
  const nav = document.querySelector('.nav');
  const hero = document.querySelector('.hero');

  const onScroll = () => {
    if (!hero) return;
    const heroBottom = hero.getBoundingClientRect().bottom;
    nav.classList.toggle('nav--fixed', heroBottom <= 0);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ── */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  const spans = hamburger?.querySelectorAll('span');

  hamburger?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', isOpen);
    if (spans) {
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    }
  });

  document.querySelectorAll('.nav__mobile .nav__link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      if (spans) {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
  });

  /* ── Hero image slider ── */
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dot');
  let currentSlide = 0;
  let sliderTimer = null;

  const goToSlide = (index) => {
    slides[currentSlide].classList.remove('hero__slide--active');
    const prevDot = dots[currentSlide];
    prevDot.classList.remove('hero__dot--active');
    void prevDot.offsetWidth; // force reflow to restart dot animation

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('hero__slide--active');

    const activeDot = dots[currentSlide];
    activeDot.classList.remove('hero__dot--active');
    void activeDot.offsetWidth;
    activeDot.classList.add('hero__dot--active');
  };

  const startSlider = () => {
    sliderTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
  };

  const resetSlider = () => {
    clearInterval(sliderTimer);
    startSlider();
  };

  if (slides.length > 1) {
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goToSlide(i); resetSlider(); });
    });
    startSlider();
  }

  /* ── How It Works — sticky scroll card stack ── */
  const hiwOuter = document.querySelector('.hiw__sticky-outer');
  const hiwSticky = document.querySelector('.hiw__sticky');
  const hiwCards = document.querySelectorAll('.hiw__card');
  const hiwDots = document.querySelectorAll('.hiw__progress-dot');
  const hiwCounter = document.querySelector('.hiw__counter-current');

  if (hiwOuter && hiwCards.length) {
    // Skip on mobile (cards show statically)
    const isMobile = () => window.innerWidth <= 768;
    let activeIndex = 0;

    const CARD_ORDER = [0, 1, 2, 3];

    const setCardState = (cards, active) => {
      cards.forEach((card, i) => {
        // Remove all state classes
        card.classList.remove(
          'hiw__card--active',
          'hiw__card--behind-1',
          'hiw__card--behind-2',
          'hiw__card--behind-3',
          'hiw__card--exited'
        );

        if (i < active) {
          // Cards before active — exited (flew off top)
          card.classList.add('hiw__card--exited');
        } else if (i === active) {
          card.classList.add('hiw__card--active');
        } else if (i === active + 1) {
          card.classList.add('hiw__card--behind-1');
        } else if (i === active + 2) {
          card.classList.add('hiw__card--behind-2');
        } else {
          card.classList.add('hiw__card--behind-3');
        }
      });

      // Update dots
      hiwDots.forEach((dot, i) => {
        dot.classList.toggle('hiw__progress-dot--active', i === active);
      });

      // Update counter
      if (hiwCounter) {
        hiwCounter.style.opacity = '0';
        hiwCounter.style.transform = 'translateY(-8px)';
        setTimeout(() => {
          hiwCounter.textContent = String(active + 1).padStart(2, '0');
          hiwCounter.style.opacity = '1';
          hiwCounter.style.transform = 'translateY(0)';
        }, 180);
      }
    };

    const onScrollHIW = () => {
      if (isMobile()) return;

      const rect = hiwOuter.getBoundingClientRect();
      const totalScroll = hiwOuter.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScroll));

      // Tighter zones — card switches happen in first 80% of each zone
      // so the transition feels responsive, not sluggish
      const rawZone = progress * 4;
      const zone = Math.min(3, Math.floor(rawZone));

      if (zone !== activeIndex) {
        activeIndex = zone;
        setCardState(hiwCards, activeIndex);
      }
    };

    // Init
    setCardState(hiwCards, 0);

    // Add counter transition style
    if (hiwCounter) {
      hiwCounter.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    }

    window.addEventListener('scroll', onScrollHIW, { passive: true });
  }


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     SERVICES — sticky scroll card reveal
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const svcOuter  = document.querySelector('.svc__scroll-outer');
  const svcBadges = document.querySelectorAll('.svc__badge');

  if (svcOuter && window.innerWidth > 768) {
    const svcItems = Array.from(
      document.querySelectorAll('[data-svc-index]')
    ).sort((a, b) => parseInt(a.dataset.svcIndex) - parseInt(b.dataset.svcIndex));

    const TOTAL    = svcItems.length;
    const VH_EACH  = 40;
    const TOTAL_VH = VH_EACH * (TOTAL + 0.5);

    svcOuter.style.height = `${TOTAL_VH}vh`;

    let currentIndex = -1; // tracks last revealed index

    const onScrollSvc = () => {
      const rect        = svcOuter.getBoundingClientRect();
      const totalScroll = svcOuter.offsetHeight - window.innerHeight;
      const scrolled    = -rect.top;
      const progress    = Math.max(0, Math.min(1, scrolled / totalScroll));

      // -1 means nothing shown (before zone), 0–6 means up to that index shown
      const targetIndex = scrolled <= 0
        ? -1
        : Math.min(TOTAL - 1, Math.floor(progress * TOTAL));

      if (targetIndex === currentIndex) return;

      if (targetIndex > currentIndex) {
        // Scrolling DOWN — reveal items from currentIndex+1 to targetIndex
        for (let i = currentIndex + 1; i <= targetIndex; i++) {
          const el = svcItems[i];
          if (!el) continue;
          el.classList.remove('svc-out');
          el.classList.add('svc-in');

          // Badges pop after centre (index 0)
          if (parseInt(el.dataset.svcIndex) === 0) {
            setTimeout(() => {
              svcBadges.forEach((b, bi) => {
                b.classList.remove('svc-out');
                setTimeout(() => b.classList.add('svc-in'), bi * 250);
              });
            }, 700);
          }
        }
      } else {
        // Scrolling UP — hide items from currentIndex down to targetIndex+1
        for (let i = currentIndex; i > targetIndex; i--) {
          const el = svcItems[i];
          if (!el) continue;
          el.classList.remove('svc-in');
          el.classList.add('svc-out');

          // Hide badges if centre (index 0) is being hidden
          if (parseInt(el.dataset.svcIndex) === 0) {
            svcBadges.forEach(b => {
              b.classList.remove('svc-in');
              b.classList.add('svc-out');
            });
          }
        }
      }

      currentIndex = targetIndex;
    };

    window.addEventListener('scroll', onScrollSvc, { passive: true });

  } else if (svcOuter) {
    // Mobile: no sticky, reveal all on intersection
    svcOuter.style.height = 'auto';
    const svcItems = document.querySelectorAll('[data-svc-index]');
    new IntersectionObserver(([entry], obs) => {
      if (entry.isIntersecting) {
        svcItems.forEach((el, i) => setTimeout(() => el.classList.add('svc-in'), i * 120));
        setTimeout(() => {
          svcBadges.forEach((b, bi) => setTimeout(() => b.classList.add('svc-in'), 600 + bi * 200));
        }, 0);
        obs.unobserve(svcOuter);
      }
    }, { threshold: 0.1 }).observe(svcOuter);
  }


  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger progress bar fill on stat card reveal
        const bar = entry.target.querySelector('.stat-card__bar[data-width]');
        if (bar) {
          setTimeout(() => {
            bar.style.width = bar.dataset.width + '%';
          }, 300);
        }

        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => {
    // Hero elements use CSS entrance animations — mark visible immediately
    if (el.closest('.hero')) {
      el.classList.add('visible');
      return;
    }
    revealObserver.observe(el);
  });

  /* ── Staggered delays for grid children ── */
  [
    '.services__all-services .service-mini',
    '.how-it-works__steps .step',
    '.stats__grid .stat-item',
    '.problem__pain-list .problem__pain-item',
    '.trust__qualities .trust__quality',
  ].forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.style.transitionDelay = `${i * 80}ms`;
    });
  });

  /* ── Section label draw-in underline ── */
  document.querySelectorAll(
    '.problem__label, .svc__label, .trust__label, .stats__label, .faq__label, .hiw__label'
  ).forEach(label => {
    new IntersectionObserver(([entry], obs) => {
      if (entry.isIntersecting) {
        label.classList.add('label-visible');
        obs.unobserve(label);
      }
    }, { threshold: 0.8 }).observe(label);
  });

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq__item');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq__item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── Stats counter animation ── */
  const animateCounter = (el, target, suffix = '', prefix = '') => {
    const duration  = 1800;
    const start     = performance.now();
    const isDecimal = target % 1 !== 0;
    const tick = (now) => {
      const p       = Math.min((now - start) / duration, 1);
      const eased   = 1 - Math.pow(1 - p, 4);
      const current = eased * target;
      el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // One observer per counter element — fires once, then disconnects
  document.querySelectorAll('[data-target]').forEach(el => {
    new IntersectionObserver(([entry], obs) => {
      if (entry.isIntersecting) {
        animateCounter(
          el,
          parseFloat(el.dataset.target),
          el.dataset.suffix || '',
          el.dataset.prefix || ''
        );
        obs.unobserve(el);
      }
    }, { threshold: 0.5 }).observe(el);
  });

  /* ── Newsletter form — Formspree ── */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn   = form.querySelector('button[type="submit"]');
      if (!input?.value) return;

      const original = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      try {
        const res = await fetch('https://formspree.io/f/xjgjaenk', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form),
        });

        if (res.ok) {
          btn.textContent = "You're in! ✓";
          btn.style.background = 'var(--sage)';
          btn.style.boxShadow = '0 2px 12px rgba(122,158,126,0.4)';
          input.value = '';
          setTimeout(() => {
            btn.textContent = original;
            btn.style.background = '';
            btn.style.boxShadow = '';
            btn.disabled = false;
          }, 3500);
        } else {
          btn.textContent = 'Try again';
          btn.style.background = '';
          btn.disabled = false;
        }
      } catch {
        btn.textContent = 'Try again';
        btn.style.background = '';
        btn.disabled = false;
      }
    });
  });

  /* ── Magnetic button effect ── */
  document.querySelectorAll('.btn--rust, .btn--white, .btn--ghost-white').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px) translateY(-1px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ── 3D card tilt on mouse move ── */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) scale(1.01)`;
      card.style.transition = 'transform 0.08s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = '';
    });
  });

  /* ── Hero overlay darkens on scroll ── */
  const heroOverlay = document.querySelector('.hero__bg-overlay');
  window.addEventListener('scroll', () => {
    if (!heroOverlay) return;
    const ratio = Math.min(window.scrollY / 500, 1);
    heroOverlay.style.opacity = (1 + ratio * 0.25).toString();
  }, { passive: true });

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Subtle cursor glow on hero (mouse-only devices) ── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const heroEl = document.querySelector('.hero');
    if (heroEl) {
      const trail = document.createElement('div');
      trail.style.cssText = `
        position:fixed; pointer-events:none; z-index:9999;
        width:10px; height:10px; border-radius:50%;
        background:rgba(196,103,74,0.45);
        transform:translate(-50%,-50%);
        transition:opacity 0.5s ease, left 0.05s linear, top 0.05s linear;
        opacity:0; mix-blend-mode:screen;
      `;
      document.body.appendChild(trail);

      heroEl.addEventListener('mousemove', (e) => {
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        trail.style.opacity = '1';
      });
      heroEl.addEventListener('mouseleave', () => {
        trail.style.opacity = '0';
      });
    }
  }

});

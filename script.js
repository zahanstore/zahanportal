/* ============================================================
   ZAHAN STORE — Shared Script (script.js)
   Handles: dark/light mode, mobile nav, forms, animations
   ============================================================ */

(function () {
  'use strict';

  /* ── THEME ── */
  function applyTheme(isDark) {
    document.body.classList.toggle('light-mode', !isDark);
    // Update all toggle icons on page
    document.querySelectorAll('.mode-toggle i, .mode-toggle .fa').forEach(function (icon) {
      icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    });
    localStorage.setItem('zs-theme', isDark ? 'dark' : 'light');
  }

  function initTheme() {
    var saved = localStorage.getItem('zs-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = saved ? saved === 'dark' : prefersDark;
    // Default = dark unless saved as light
    if (saved === null) isDark = true;
    applyTheme(isDark);
    return isDark;
  }

  var isDark = initTheme();

  document.querySelectorAll('.mode-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      isDark = !isDark;
      applyTheme(isDark);
    });
  });

  /* ── MOBILE NAV ── */
  var hamburger = document.querySelector('.hamburger');
  var navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('active');
      hamburger.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          navLinks.classList.remove('active');
          hamburger.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (navLinks.classList.contains('active') &&
          !navLinks.contains(e.target) &&
          !hamburger.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── SCROLL: header shadow ── */
  var header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.borderBottomColor = window.scrollY > 20 
        ? 'rgba(255,255,255,0.10)' 
        : '';
    }, { passive: true });
  }

  /* ── CONTACT FORM — handled by inline Supabase script in contact.html ── */

  /* Reset contact form */
  window.resetForm = function () {
    var contactForm = document.getElementById('contact-form');
    var thankYou = document.getElementById('thank-you-message');
    if (contactForm && thankYou) {
      contactForm.reset();
      contactForm.style.display = '';
      thankYou.classList.add('hidden');
    }
  };

  /* ── NEWSLETTER FORM ── */
  var newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var thankYou = document.getElementById('newsletter-thankyou');
      var data = new FormData(newsletterForm);
      fetch('/', { method: 'POST', body: data })
        .then(function () {
          if (thankYou) {
            newsletterForm.style.display = 'none';
            thankYou.classList.remove('hidden');
          }
        })
        .catch(function () {});
    });
  }

  /* ── SCROLL ANIMATIONS ── */
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-up').forEach(function (el) {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately
    document.querySelectorAll('.fade-up').forEach(function (el) {
      el.style.opacity = '1';
    });
  }

  /* ── EMAIL ASSEMBLY (bypasses Cloudflare email obfuscation) ── */
  /* Anchor tags: data-email — sets href + fills empty text          */
  document.querySelectorAll('[data-email]').forEach(function (el) {
    var u = el.getAttribute('data-u');
    var d = el.getAttribute('data-d');
    if (u && d) {
      var email = u + '@' + d;
      el.href = 'mailto:' + email;
      if (!el.textContent.trim()) {
        el.insertAdjacentText('beforeend', ' ' + email);
      }
    }
  });
  /* Spans: data-email-text — just ensures correct text is rendered  */
  document.querySelectorAll('[data-email-text]').forEach(function (el) {
    var u = el.getAttribute('data-u');
    var d = el.getAttribute('data-d');
    if (u && d) {
      el.textContent = u + '@' + d;
    }
  });




  /* ── FAQ ACCORDION ── */
  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = this.closest('.faq-item');
      var isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(function(openItem) {
        openItem.classList.remove('open');
      });
      // Open clicked if it was closed
      if (!isOpen) { item.classList.add('open'); }
    });
  });

  /* ── ACTIVE NAV INDICATOR ── */
  (function () {
    var page    = window.location.pathname.split('/').pop() || 'index.html';
    var hash    = window.location.hash;

    // Map filenames → which nav link href to activate
    var pageMap = {
      'index.html':    null,          // handled by scroll below
      '':              null,
      'universe.html': 'universe.html',
      'faqs.html':     'faqs.html',
      'contact.html':  'contact.html',
      'legal.html':    'legal.html',
    };

    function setActive(href) {
      document.querySelectorAll('.nav-links a').forEach(function (a) {
        a.classList.remove('active');
        // Match by href ending or exact
        if (a.getAttribute('href') === href ||
            a.getAttribute('href') && a.getAttribute('href').endsWith(href)) {
          a.classList.add('active');
        }
      });
    }

    // Non-homepage: highlight matching nav link
    if (page !== 'index.html' && page !== '') {
      var target = pageMap[page] || page;
      setActive(target);
    }

    // Homepage: highlight by scroll position
    if (page === 'index.html' || page === '') {
      var sections = ['gateway','about','manifesto','features','contact'];
      var navMap   = {
        'gateway':   '#gateway',
        'about':     '#about',
        'manifesto': '#manifesto',
        'features':  '#features',
        'contact':   '#contact',
      };

      // Set initial from hash
      if (hash) setActive(hash);
      else setActive('#gateway');

      var scrollTimer;
      window.addEventListener('scroll', function () {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function () {
          var current = 'gateway';
          sections.forEach(function (id) {
            var el = document.getElementById(id);
            if (el && el.getBoundingClientRect().top <= 120) current = id;
          });
          setActive(navMap[current] || ('#' + current));
        }, 60);
      }, { passive: true });
    }
  })();


})();
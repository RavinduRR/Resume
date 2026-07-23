/**
* Template Name: MyResume
* Template URL: https://bootstrapmade.com/free-html-bootstrap-template-my-resume/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";
  try {

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');
  function headerToggle() {
    const hdr = document.querySelector('#header');
    if (hdr) hdr.classList.toggle('header-show');
    if (headerToggleBtn) {
      headerToggleBtn.classList.toggle('bi-list');
      headerToggleBtn.classList.toggle('bi-x');
    }
  }
  if (headerToggleBtn) {
    headerToggleBtn.addEventListener('click', headerToggle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  new Swiper(".project-slider", {
  loop: true,
  speed: 800,

  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }

  
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  

  } catch (e) {
    console.error('Main script error', e);
  }
})();

// Force dark theme by default. This adds the class immediately so CSS variables apply without flash.
/* Theme Toggle: non-invasive script that adds a floating button, persists choice, and respects system preference. */
(function() {
  const THEME_KEY = 'myresume_theme'; // stored values: 'dark' | 'light' | null

  function createThemeToggle() {
    try {
      const btn = document.createElement('button');
      btn.className = 'theme-toggle';
      btn.setAttribute('aria-label', 'Toggle dark mode');
      btn.setAttribute('title', 'Toggle dark mode');
      btn.type = 'button';

      const icon = document.createElement('span');
      icon.className = 'icon';
      btn.appendChild(icon);

      document.body.appendChild(btn);

      btn.addEventListener('click', () => {
        const currentlyDark = document.documentElement.classList.toggle('dark-theme');
        const newTheme = currentlyDark ? 'dark' : 'light';
        try { localStorage.setItem(THEME_KEY, newTheme); } catch(e){}
        updateIcon(icon, currentlyDark);
      });

      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });

      return { btn, icon };
    } catch (err) {
      console.error('Theme toggle creation failed', err);
      return null;
    }
  }

  function updateIcon(iconEl, isDark) {
    if (!iconEl) return;
    iconEl.textContent = isDark ? '🌙' : '☀️';
  }

  function applyInitialTheme(iconEl) {
    try {
      const stored = (() => { try { return localStorage.getItem(THEME_KEY); } catch(e){ return null; } })();
      if (stored === 'dark') {
        document.documentElement.classList.add('dark-theme');
        updateIcon(iconEl, true);
        return;
      }
      if (stored === 'light') {
        document.documentElement.classList.remove('dark-theme');
        updateIcon(iconEl, false);
        return;
      }

      // No stored preference: respect system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark-theme');
        updateIcon(iconEl, true);
      } else {
        document.documentElement.classList.remove('dark-theme');
        updateIcon(iconEl, false);
      }
    } catch (err) {
      console.error('Applying initial theme failed', err);
    }
  }

  // Do not create or inject the visual toggle button. Only apply the initial theme
  // (respect stored preference or system preference). This removes the UI while
  // keeping theme initialization behavior.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyInitialTheme(null);
    });
  } else {
    applyInitialTheme(null);
  }

})();

function toggleGallery(id) {
    const gallery = document.getElementById(id);

    if (gallery.style.display === "block") {
      gallery.style.display = "none";
    } else {
      gallery.style.display = "block";
    }
  }
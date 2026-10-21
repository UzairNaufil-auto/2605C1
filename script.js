/**
 * COFFEE WALA - Single Page Scroll-Driven Experience
 * Built with GSAP, ScrollTrigger & Lenis Smooth Scroll.
 * Modular, clean, performant architecture.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure GSAP plugins are registered
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 1. Initialize Smooth Scrolling with Lenis
  const lenis = initLenis();

  // 2. Initialize Navigation & Anchor Scrolling
  initNavigation(lenis);

  // 3. Initialize Scroll Progress Indicator
  initScrollProgress();

  // 4. Initialize Hero Animations
  initHeroAnimations();

  // 5. Initialize Numerical Counters on Scroll
  initCounters();

  // 6. Initialize Pinned Horizontal Scroll Section (The Craft)
  initCraftHorizontalScroll();

  // 7. Initialize Signature Roasts Showcase Animations & 3D Tilt
  initRoastCards();

  // 8. Initialize Dynamic Cafe Menu with Category Filter
  initCafeMenu();

  // 9. Initialize Atmosphere Gallery Parallax Effects
  initGalleryParallax();

  // 10. Initialize Reservation Form & Interactive Toast
  initInteractions();
});

/* ==========================================================================
   1. Lenis Smooth Scroll Setup
   ========================================================================== */
function initLenis() {
  if (typeof Lenis === 'undefined') {
    console.warn('Lenis library not loaded, falling back to native scroll.');
    return null;
  }

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1.0,
  });

  // Synchronize Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/* ==========================================================================
   2. Navigation, Mobile Menu & Smooth Anchor Scrolling
   ========================================================================== */
function initNavigation(lenis) {
  const navbar = document.getElementById('main-nav');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileClose = document.getElementById('mobile-close');
  const mobileNav = document.getElementById('mobile-nav');

  // Change navbar appearance on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu open / close
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileNav.classList.add('open');
      if (lenis) lenis.stop();
    });
  }

  if (mobileClose && mobileNav) {
    mobileClose.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      if (lenis) lenis.start();
    });
  }

  // Smooth anchor scrolling using Lenis
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();

        // Close mobile drawer if open
        if (mobileNav && mobileNav.classList.contains('open')) {
          mobileNav.classList.remove('open');
          if (lenis) lenis.start();
        }

        if (lenis) {
          lenis.scrollTo(targetEl, {
            offset: -30,
            duration: 1.2,
          });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/* ==========================================================================
   3. Top Scroll Progress Indicator
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      progressBar.style.width = `${(self.progress * 100).toFixed(1)}%`;
    },
  });
}

/* ==========================================================================
   4. Hero Section Animations (Intro & Parallax)
   ========================================================================== */
function initHeroAnimations() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero-content .section-tag', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
  })
  .from('.hero-title', {
    y: 35,
    opacity: 0,
    duration: 1,
  }, '-=0.5')
  .from('.hero-description', {
    y: 25,
    opacity: 0,
    duration: 0.8,
  }, '-=0.6')
  .from('.hero-actions .btn', {
    y: 20,
    opacity: 0,
    stagger: 0.15,
    duration: 0.7,
  }, '-=0.5')
  .from('.hero-image-frame', {
    scale: 0.92,
    opacity: 0,
    duration: 1.1,
  }, '-=0.8')
  .from('.floating-badge', {
    y: 15,
    opacity: 0,
    stagger: 0.2,
    duration: 0.8,
  }, '-=0.6');

  // Hero image subtle scroll parallax
  gsap.to('#hero-img', {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  // Story image subtle parallax
  gsap.to('#story-img', {
    yPercent: 8,
    ease: 'none',
    scrollTrigger: {
      trigger: '#story',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}

/* ==========================================================================
   5. Numerical Counters on Scroll
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  ScrollTrigger.create({
    trigger: '.hero-stats',
    start: 'top 85%',
    once: true,
    onEnter: () => {
      counters.forEach((counter) => {
        const target = parseFloat(counter.getAttribute('data-target')) || 0;
        const suffix = counter.getAttribute('data-suffix') || '';
        const isDecimal = target % 1 !== 0;

        gsap.to({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function () {
            const current = isDecimal ? this.targets()[0].val.toFixed(1) : Math.floor(this.targets()[0].val);
            counter.textContent = current + suffix;
          },
        });
      });
    },
  });
}

/* ==========================================================================
   6. The Craft - Pinned Horizontal Scroll Section
   ========================================================================== */
function initCraftHorizontalScroll() {
  const section = document.getElementById('craft');
  const track = document.getElementById('craft-track');
  const pinContainer = document.getElementById('craft-pin-container');

  if (!section || !track || !pinContainer) return;

  // On desktop/tablet, create smooth horizontal pin
  const mm = gsap.matchMedia();

  mm.add('(min-width: 769px)', () => {
    const getScrollDistance = () => track.scrollWidth - window.innerWidth + 80;

    gsap.to(track, {
      x: () => -getScrollDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => `+=${getScrollDistance()}`,
        invalidateOnRefresh: true,
      },
    });
  });

  mm.add('(max-width: 768px)', () => {
    // On small screens, keep cards naturally scrollable horizontally or stacked
    track.style.overflowX = 'auto';
    track.style.width = '100%';
  });
}

/* ==========================================================================
   7. Signature Roasts Showcase Animations & 3D Tilt
   ========================================================================== */
function initRoastCards() {
  const cards = document.querySelectorAll('.roast-card');
  if (!cards.length) return;

  gsap.from(cards, {
    y: 50,
    opacity: 0,
    duration: 0.9,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#roasts',
      start: 'top 75%',
    },
  });

  // Subtle 3D mouse tilt effect on desktop
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(1000px) rotateY(${x * 0.04}deg) rotateX(${-y * 0.04}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
    });
  });
}

/* ==========================================================================
   8. Dynamic Cafe Menu with Category Filtering
   ========================================================================== */
const MENU_DATA = {
  hot: [
    { name: 'Traditional Filter Kaapi', tag: 'Heritage', price: '₹180', desc: 'Slow-dripped chicory dark roast with whipped whole milk in pure brass dabarah.' },
    { name: 'Cortado Double Ristretto', tag: 'Specialty', price: '₹220', desc: 'Equal parts dense double shot espresso and velvety textured micro-foam.' },
    { name: 'Manual V60 Pour-Over', tag: 'Single Origin', price: '₹260', desc: 'Single-estate Chikmagalur beans dialed for clean honeyed jasmine clarity.' },
    { name: 'Spiced Cardamom Flat White', tag: 'House Special', price: '₹240', desc: 'Smooth oat milk latte infused with freshly crushed green Idukki cardamom.' },
    { name: 'Single Origin Aeropress', tag: 'Smooth', price: '₹250', desc: 'Full-bodied extraction emphasizing round chocolate and toasted hazelnut.' },
    { name: 'Dark Mocha Valrhona', tag: 'Decadent', price: '₹280', desc: '70% artisanal French cocoa folded with espresso and steamed velvety milk.' },
  ],
  cold: [
    { name: 'Kashmir Saffron Nitro Cold Brew', tag: 'Signature', price: '₹320', desc: 'Steeped for 20 hours, infused with genuine saffron threads & poured on nitrogen.' },
    { name: 'Vanilla Bean Iced Shakerato', tag: 'Refreshing', price: '₹260', desc: 'Double espresso vigorously shaken with crushed ice and Madagascar bourbon vanilla.' },
    { name: 'Coconut Water Cold Drip', tag: 'Light & Crisp', price: '₹290', desc: 'Slow cold-drip coffee over fresh tender coconut water and lime twist.' },
    { name: 'Salted Caramel Cold Foam Latte', tag: 'Favorite', price: '₹310', desc: 'Cold espresso over oat milk capped with whipped pink Himalayan sea salt foam.' },
    { name: 'Espresso Tonic with Orange Zest', tag: 'Bubbly', price: '₹270', desc: 'Single estate espresso poured over crisp craft tonic and charred citrus.' },
    { name: 'Iced Oat Milk Kaapi', tag: 'Vegan', price: '₹240', desc: 'Classic south Indian filter decoction poured over silky chilled oat milk and jaggery.' },
  ],
  signatures: [
    { name: 'The Mysore Royal Flight', tag: 'Tasting Flight', price: '₹450', desc: 'Tri-sample tray: Filter decoction shot, V60 clarity pour, and Nitro cold brew.' },
    { name: 'Ghee Roast Kaapi Affogato', tag: 'Dessert Pour', price: '₹340', desc: 'Double espresso poured over artisanal roasted almond gelato and clarified ghee crisp.' },
    { name: 'Smoked Cardamom Cappuccino', tag: 'Smoked Table-side', price: '₹310', desc: 'Prepared with whole milk and applewood smoked cinnamon stick essence.' },
    { name: 'Golden Turmeric Velvet Drip', tag: 'Wellness', price: '₹260', desc: 'Lakadong organic turmeric, black pepper, and espresso with oat milk foam.' },
  ],
  bakes: [
    { name: 'Almond Frangipane Croissant', tag: 'Fresh Baked', price: '₹260', desc: 'Double-baked flaky French laminated dough with toasted California almonds.' },
    { name: 'Cardamom Cinnamon Babka Knot', tag: 'Artisanal', price: '₹240', desc: 'Pillowy sourdough brioche twisted with spiced brown butter and dark sugar.' },
    { name: 'Pistachio Dark Cocoa Tart', tag: 'Signature', price: '₹290', desc: 'Crisp sable shell with 70% dark ganache and Sicilian pistachio cream.' },
    { name: 'Wild Mushroom Sourdough Toast', tag: 'Savory', price: '₹320', desc: 'Toasted house sourdough topped with truffled wild mushrooms and whipped ricotta.' },
  ],
};

function initCafeMenu() {
  const container = document.getElementById('menu-container');
  const tabs = document.querySelectorAll('.menu-tab-btn');
  if (!container || !tabs.length) return;

  function renderCategory(cat) {
    const items = MENU_DATA[cat] || [];
    container.innerHTML = items.map((item) => `
      <div class="menu-item-row">
        <div class="menu-item-info">
          <div class="menu-item-name">
            <span>${item.name}</span>
            <span class="menu-tag-pill">${item.tag}</span>
          </div>
          <p class="menu-item-desc">${item.desc}</p>
        </div>
        <div class="menu-item-price">${item.price}</div>
      </div>
    `).join('');

    // Animate item rows entrance
    gsap.fromTo(
      container.children,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power2.out' }
    );
  }

  // Render initial 'hot' category
  renderCategory('hot');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-category');
      renderCategory(cat);
    });
  });
}

/* ==========================================================================
   9. Atmosphere Gallery Parallax Effects
   ========================================================================== */
function initGalleryParallax() {
  const galleryItems = document.querySelectorAll('.gallery-item img');
  if (!galleryItems.length) return;

  galleryItems.forEach((img, i) => {
    const speed = (i % 2 === 0) ? -15 : 15;
    gsap.to(img, {
      yPercent: speed,
      ease: 'none',
      scrollTrigger: {
        trigger: img.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

/* ==========================================================================
   10. Interactive Toast & Reservation Form
   ========================================================================== */
function initInteractions() {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  let toastTimer = null;

  function showToast(message, icon = '☕') {
    if (!toast) return;
    const toastIcon = toast.querySelector('.toast-icon');
    if (toastIcon) toastIcon.textContent = icon;
    if (toastText) toastText.textContent = message;

    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  // "Add to Tray" toast buttons on roast cards
  document.querySelectorAll('.order-toast-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const itemName = btn.getAttribute('data-item') || 'Selected Roast';
      showToast(`${itemName} added to your tasting tray!`, '✨');
    });
  });

  // Pre-fill reservation date with tomorrow's date
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  // Reservation form submission
  const resForm = document.getElementById('reservation-form');
  if (resForm) {
    resForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('res-name').value;
      const guests = document.getElementById('res-guests').value;
      const time = document.getElementById('res-time').options[document.getElementById('res-time').selectedIndex].text;

      showToast(`Reservation confirmed for ${name} (${guests} Guests • ${time})!`, '🎉');
      resForm.reset();

      // Reset date to tomorrow
      if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
      }
    });
  }

  // Newsletter form submission
  const newsForm = document.getElementById('newsletter-form');
  if (newsForm) {
    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Welcome to The Wala Journal! First cupping invite on the way.', '📩');
      newsForm.reset();
    });
  }
}

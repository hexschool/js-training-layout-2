/**
 * Vanilla JS replacements for Bootstrap JS components:
 * 1. Navbar Toggle (collapse without data-bs-parent)
 * 2. Accordion (collapse with data-bs-parent)
 * 3. Carousel (auto-play + prev/next)
 */
document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     1. Collapse Toggle (Navbar & Accordion)
     Both use data-bs-toggle="collapse"
     Accordion has data-bs-parent, navbar does not
     ============================================ */
  document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSelector = trigger.getAttribute('data-bs-target');
      if (!targetSelector) return;
      const target = document.querySelector(targetSelector);
      if (!target) return;

      const parentSelector = target.getAttribute('data-bs-parent');

      if (parentSelector) {
        // Accordion mode: close all siblings first
        const parent = document.querySelector(parentSelector);
        if (parent) {
          parent.querySelectorAll('.collapse.show').forEach(openItem => {
            if (openItem !== target) {
              openItem.classList.remove('show');
              // Toggle icon: set to bi-plus
              const openTrigger = parent.querySelector(`[data-bs-target="#${openItem.id}"]`);
              if (openTrigger) {
                const icon = openTrigger.querySelector('.bi.bi-dash');
                if (icon) {
                  icon.classList.remove('bi-dash');
                  icon.classList.add('bi-plus');
                }
              }
            }
          });
        }
        // Toggle target
        target.classList.toggle('show');
        // Toggle icon on current trigger
        const icon = trigger.querySelector('.bi.bi-dash, .bi.bi-plus');
        if (icon) {
          icon.classList.toggle('bi-dash');
          icon.classList.toggle('bi-plus');
        }
      } else {
        // Navbar mode: simple toggle
        target.classList.toggle('show');
      }
    });
  });

  /* ============================================
     2. Carousel
     - data-ride="carousel" triggers auto-play
     - .carousel-control-prev / .carousel-control-next for manual nav
     ============================================ */
  document.querySelectorAll('.carousel').forEach(carousel => {
    const inner = carousel.querySelector('.carousel-inner');
    const items = carousel.querySelectorAll('.carousel-item');
    if (!inner || items.length === 0) return;

    let currentIndex = 0;
    const total = items.length;

    function goTo(index) {
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      currentIndex = index;
      inner.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // Prev / Next buttons
    const prevBtn = carousel.querySelector('.carousel-control-prev');
    const nextBtn = carousel.querySelector('.carousel-control-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goTo(currentIndex - 1);
        resetAutoPlay();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goTo(currentIndex + 1);
        resetAutoPlay();
      });
    }

    // Auto-play
    let autoPlayInterval = null;
    const autoPlay = carousel.getAttribute('data-ride') === 'carousel';

    function startAutoPlay() {
      if (autoPlay) {
        autoPlayInterval = setInterval(() => goTo(currentIndex + 1), 5000);
      }
    }

    function resetAutoPlay() {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
      startAutoPlay();
    }

    startAutoPlay();
  });
});

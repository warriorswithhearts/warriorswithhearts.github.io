// Warriors with Hearts Website JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Warriors with Hearts website loaded');
  
  // Mobile Navigation Toggle
  initMobileNavigation();
  
  // Smooth Scroll Navigation
  initSmoothScrollNavigation();
  
  // Active Link Tracking
  initActiveNavTracking();

  // Expandable Program Cards
  initExpandableProgramCards();

  // Board Member Modal
  initBoardModal();

  // Mission Gallery Carousel
  initMissionCarousel();

  // Financials Accordion
  initFinancialsAccordion();

  // Temporary Donation Raffle Feature
  initRaffleFeature();

  // Public Raffle Ticket Assignments
  initRaffleTicketAssignments();
});

// Flip this to false when the raffle is over.
// All raffle-related UI will stay hidden without needing to remove markup.
const RAFFLE_FEATURE_ENABLED = true;

/**
 * Initialize mobile navigation functionality
 * Handles hamburger menu toggle, overlay clicks, and menu link clicks
 */
function initMobileNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  // Toggle mobile menu when hamburger button is clicked
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      toggleMobileMenu();
    });
  }
  
  // Close mobile menu when overlay is clicked
  if (navOverlay) {
    navOverlay.addEventListener('click', function() {
      closeMobileMenu();
    });
  }
  
  // Close mobile menu when a navigation link is clicked
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      closeMobileMenu();
    });
  });
  
  // Close mobile menu when Escape key is pressed
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeMobileMenu();
    }
  });
}

/**
 * Toggle mobile menu open/closed state
 */
function toggleMobileMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navOverlay = document.querySelector('.nav-overlay');
  
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
  navOverlay.classList.toggle('active');
  
  // Update ARIA attribute for accessibility
  const isExpanded = navMenu.classList.contains('active');
  navToggle.setAttribute('aria-expanded', isExpanded);
  
  // Prevent body scroll when menu is open
  if (isExpanded) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navOverlay = document.querySelector('.nav-overlay');
  
  navToggle.classList.remove('active');
  navMenu.classList.remove('active');
  navOverlay.classList.remove('active');
  
  // Update ARIA attribute for accessibility
  navToggle.setAttribute('aria-expanded', 'false');
  
  // Restore body scroll
  document.body.style.overflow = '';
}

/**
 * Initialize smooth scroll navigation
 * Handles click events on navigation links to smoothly scroll to target sections
 */
function initSmoothScrollNavigation() {
  const navLinks = document.querySelectorAll('.nav-menu a, .footer-links a, .cta-button');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#') || href === '#') return;

    link.addEventListener('click', (event) => {
      event.preventDefault();

      const targetSection = document.querySelector(href);
      if (!targetSection) return;

      // Close mobile menu first so layout is stable
      if (typeof closeMobileMenu === 'function') closeMobileMenu();

      // Wait for any menu/header transitions to finish before computing position
      setTimeout(() => {
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const extraOffset = 16;

        const targetY =
          targetSection.getBoundingClientRect().top +
          window.pageYOffset -
          navbarHeight -
          extraOffset;

        window.scrollTo({ top: targetY, behavior: 'smooth' });

        // Update hash without jump
        if (history.pushState) history.pushState(null, '', href);

        // Accessibility focus WITHOUT triggering another scroll
        targetSection.setAttribute('tabindex', '-1');
        if (typeof targetSection.focus === 'function') {
          try {
            targetSection.focus({ preventScroll: true });
          } catch {
            // Safari fallback (no preventScroll support)
            targetSection.focus();
          }
        }
      }, 300);
    });
  });
}

/**
 * Initialize active navigation link tracking
 * Updates the active link based on current scroll position
 */
function initActiveNavTracking() {
  const navLinks = document.querySelectorAll('.nav-menu a');
  const sections = document.querySelectorAll('section[id]');
  
  // Throttle scroll event for better performance
  let ticking = false;
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateActiveNavLink(navLinks, sections);
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // Set initial active link on page load
  updateActiveNavLink(navLinks, sections);
}

/**
 * Update active navigation link based on scroll position
 * @param {NodeList} navLinks - Navigation link elements
 * @param {NodeList} sections - Section elements
 */
function updateActiveNavLink(navLinks, sections) {
  const scrollPosition = window.scrollY;
  const navbar = document.querySelector('.navbar');
  const navbarHeight = navbar ? navbar.offsetHeight : 0;
  
  // Find the current section based on scroll position
  let currentSection = '';
  
  sections.forEach(function(section) {
    const sectionTop = section.offsetTop - navbarHeight - 100; // 100px offset for better UX
    const sectionBottom = sectionTop + section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      currentSection = section.getAttribute('id');
    }
  });
  
  // If at the very top of the page, set home as active
  if (scrollPosition < 100) {
    currentSection = 'home';
  }
  
  // Update active class on navigation links
  navLinks.forEach(function(link) {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const linkSection = href.substring(1);
      
      if (linkSection === currentSection) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

/**
 * Initialize expandable program cards.
 * Reveals the full program description while keeping the preview visible.
 */
function initExpandableProgramCards() {
  const toggles = document.querySelectorAll('.program-toggle[aria-controls]');

  toggles.forEach(function(toggle) {
    const detailsId = toggle.getAttribute('aria-controls');
    const details = document.getElementById(detailsId);
    const card = toggle.closest('.program-item');

    if (!details || !card) return;

    toggle.addEventListener('click', function() {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      const shouldExpand = !isExpanded;

      toggle.setAttribute('aria-expanded', String(shouldExpand));
      toggle.textContent = shouldExpand
        ? toggle.dataset.lessText || 'Show less'
        : toggle.dataset.moreText || 'Read more';
      details.hidden = !shouldExpand;
      card.classList.toggle('is-expanded', shouldExpand);
    });
  });
}

/**
 * Initialize board member modal interactions.
 * Displays the selected member's portrait and biography in a modal dialog.
 */
function initBoardModal() {
  const modal = document.querySelector('.board-modal');
  const dialog = modal ? modal.querySelector('.board-modal-dialog') : null;
  const modalImage = modal ? modal.querySelector('.board-modal-image') : null;
  const modalPlaceholder = modal ? modal.querySelector('.board-modal-image-placeholder') : null;
  const modalName = modal ? modal.querySelector('#board-modal-name') : null;
  const modalTitle = modal ? modal.querySelector('.board-modal-title') : null;
  const modalBio = modal ? modal.querySelector('.board-modal-bio') : null;
  const closeButtons = modal ? modal.querySelectorAll('[data-board-close]') : [];
  const memberButtons = document.querySelectorAll('.board-member');

  if (!modal || !dialog || !modalImage || !modalPlaceholder || !modalName || !modalTitle || !modalBio || memberButtons.length === 0) {
    return;
  }

  let lastTrigger = null;
  let isClosingFromHistory = false;

  memberButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      lastTrigger = button;
      openBoardModal(button, true);
    });
  });

  closeButtons.forEach(function(button) {
    button.addEventListener('click', closeBoardModal);
  });

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && !modal.hidden) {
      closeBoardModal();
    }
  });

  window.addEventListener('popstate', function() {
    if (!modal.hidden) {
      isClosingFromHistory = true;
      closeBoardModal();
    }
  });

  function openBoardModal(button, pushHistory) {
    const name = button.dataset.name || 'Board Member';
    const title = button.dataset.title || 'Board Member';
    const fullImage = button.dataset.fullImage || '';
    const alt = button.dataset.alt || '';
    const initials = button.dataset.initials || '';
    const bio = button.dataset.bio || '<p>Full biography coming soon.</p>';

    modalName.textContent = name;
    modalTitle.textContent = title;
    modalBio.innerHTML = bio;

    if (fullImage) {
      modalImage.src = fullImage;
      modalImage.alt = alt;
      modalImage.hidden = false;
      modalPlaceholder.hidden = true;
      modalPlaceholder.textContent = '';
    } else {
      modalImage.src = '';
      modalImage.alt = '';
      modalImage.hidden = true;
      modalPlaceholder.hidden = false;
      modalPlaceholder.textContent = initials;
    }

    modal.hidden = false;
    document.body.classList.add('modal-open');
    dialog.setAttribute('tabindex', '-1');
    dialog.focus();

    if (pushHistory) {
      history.pushState({ boardModalOpen: true, memberName: name }, '', window.location.href);
    }
  }

  function closeBoardModal() {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    modalImage.src = '';
    modalImage.alt = '';
    modalBio.innerHTML = '';

    if (!isClosingFromHistory && window.history.length > 1) {
      history.back();
    }

    isClosingFromHistory = false;

    if (lastTrigger) {
      lastTrigger.focus();
    }
  }
}

/**
 * Initialize the hero mission gallery carousel.
 * Handles autoplay, thumbnail navigation, hover pause, and modal enlargement.
 */
function initMissionCarousel() {
  const slideDefinitions = [
    { src: 'images/gallery/1.webp', title: 'Mission Moments', meta: 'Warriors with Hearts in action' },
    { src: 'images/gallery/2.webp', title: 'Mission Moments', meta: 'Warriors with Hearts in action' },
    { src: 'images/gallery/3.webp', title: 'Mission Moments', meta: 'Warriors with Hearts in action' },
    { src: 'images/gallery/4.webp', title: 'Mission Moments', meta: 'Warriors with Hearts in action' },
    { src: 'images/gallery/5.webp', title: 'Mission Moments', meta: 'Warriors with Hearts in action' },
    { src: 'images/gallery/6.webp', title: 'Mission Moments', meta: 'Warriors with Hearts in action' },
    { src: 'images/gallery/7.webp', title: 'Mission Moments', meta: 'Warriors with Hearts in action' },
    { src: 'images/gallery/8.webp', title: 'Mission Moments', meta: 'Warriors with Hearts in action' },
    { src: 'images/gallery/9.webp', title: 'Mission Moments', meta: 'Warriors with Hearts in action' },
    { src: 'images/gallery/10.webp', title: 'Mission Moments', meta: 'Warriors with Hearts in action' },
    { src: 'images/gallery/11.webp', title: 'Mission Moments', meta: 'Warriors with Hearts in action' },
    { src: 'images/gallery/12.webp', title: 'Mission Moments', meta: 'Warriors with Hearts in action' },
    { src: 'images/gallery/13.webp', title: 'Mission Moments', meta: 'Warriors with Hearts in action' },
    { src: 'images/gallery/14.webp', title: 'Mission Moments', meta: 'Warriors with Hearts in action' },
    { src: 'images/gallery/animal 1.webp', title: 'Mission Moments', meta: 'Warriors with Hearts in action' },
    { src: 'images/gallery/animal 2.webp', title: 'Mission Moments', meta: 'Warriors with Hearts in action' },
    { src: 'images/gallery/animal 3.webp', title: 'Mission Moments', meta: 'Warriors with Hearts in action' },
    { src: 'images/gallery/animal 4.webp', title: 'Mission Moments', meta: 'Warriors with Hearts in action' },
    { src: 'images/gallery/animal 5.webp', title: 'Mission Moments', meta: 'Warriors with Hearts in action' },
    { src: 'images/gallery/animal 6.webp', title: 'Mission Moments', meta: 'Warriors with Hearts in action' },
    { src: 'images/gallery/animal 7.webp', title: 'Mission Moments', meta: 'Warriors with Hearts in action' },
    { src: 'images/gallery/animal 2014.webp', title: 'Mission Moments', meta: 'Archive image from 2014' },
    { src: 'images/gallery/animal 2017.webp', title: 'Mission Moments', meta: 'Archive image from 2017' },
    { src: 'images/gallery/animal 2018.webp', title: 'Mission Moments', meta: 'Archive image from 2018' },
    { src: 'images/gallery/animal 2019.webp', title: 'Mission Moments', meta: 'Archive image from 2019' },
    { src: 'images/gallery/animal 2020.webp', title: 'Mission Moments', meta: 'Archive image from 2020' },
    { src: 'images/gallery/animal 2021.webp', title: 'Mission Moments', meta: 'Archive image from 2021' }
  ];

  const carousel = document.querySelector('.mission-carousel');
  const stageButton = carousel ? carousel.querySelector('.mission-carousel-stage') : null;
  const primaryImage = carousel ? carousel.querySelector('.mission-carousel-image-primary') : null;
  const secondaryImage = carousel ? carousel.querySelector('.mission-carousel-image-secondary') : null;
  const title = carousel ? carousel.querySelector('.mission-carousel-title') : null;
  const meta = carousel ? carousel.querySelector('.mission-carousel-meta') : null;
  const count = carousel ? carousel.querySelector('.mission-carousel-count') : null;
  const thumbnails = carousel ? carousel.querySelector('.mission-carousel-thumbnails') : null;
  const prevButton = carousel ? carousel.querySelector('.mission-carousel-prev') : null;
  const nextButton = carousel ? carousel.querySelector('.mission-carousel-next') : null;
  const modal = document.querySelector('.gallery-modal');
  const modalImage = modal ? modal.querySelector('.gallery-modal-image') : null;
  const modalTitle = modal ? modal.querySelector('.gallery-modal-title') : null;
  const modalMeta = modal ? modal.querySelector('.gallery-modal-meta') : null;
  const modalPrevButton = modal ? modal.querySelector('.gallery-modal-prev') : null;
  const modalNextButton = modal ? modal.querySelector('.gallery-modal-next') : null;
  const modalCloseButtons = modal ? modal.querySelectorAll('[data-gallery-close]') : [];

  if (
    !carousel ||
    !stageButton ||
    !primaryImage ||
    !secondaryImage ||
    !title ||
    !meta ||
    !count ||
    !thumbnails ||
    !prevButton ||
    !nextButton ||
    !modal ||
    !modalImage ||
    !modalTitle ||
    !modalMeta ||
    !modalPrevButton ||
    !modalNextButton ||
    slideDefinitions.length === 0
  ) {
    return;
  }

  const slides = slideDefinitions.map(function(definition, index) {
    return {
      src: definition.src,
      alt: 'Warriors with Hearts gallery image ' + (index + 1),
      label: 'Photo ' + (index + 1) + ' of ' + slideDefinitions.length,
      title: definition.title,
      meta: definition.meta,
      countLabel:
        String(index + 1).padStart(2, '0') +
        ' / ' +
        String(slideDefinitions.length).padStart(2, '0')
    };
  });

  const autoplayDelay = 6200;
  let currentIndex = 0;
  let autoplayId = null;
  let hoverPaused = false;
  let modalOpen = false;
  let lastTrigger = null;
  let isClosingFromHistory = false;
  let activeImage = primaryImage;
  let inactiveImage = secondaryImage;
  let autoplayStartedAt = 0;
  let remainingAutoplayMs = autoplayDelay;
  let isVisible = false;
  let touchStartX = 0;
  let touchStartY = 0;

  thumbnails.innerHTML = '';

  slides.forEach(function(slide, index) {
    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.className = 'mission-carousel-thumbnail';
    thumb.setAttribute('role', 'tab');
    thumb.setAttribute('aria-label', 'Show ' + slide.label.toLowerCase());
    thumb.setAttribute('aria-selected', 'false');
    thumb.dataset.index = String(index);

    const thumbImage = document.createElement('img');
    thumbImage.src = encodeURI(slide.src);
    thumbImage.alt = slide.alt;
    thumbImage.loading = 'lazy';

    thumb.appendChild(thumbImage);
    thumbnails.appendChild(thumb);

    thumb.addEventListener('click', function() {
      lastTrigger = thumb;
      showSlide(index, true);
    });
  });

  const thumbnailButtons = thumbnails.querySelectorAll('.mission-carousel-thumbnail');

  prevButton.addEventListener('click', function() {
    lastTrigger = prevButton;
    showSlide(currentIndex - 1, true);
  });

  nextButton.addEventListener('click', function() {
    lastTrigger = nextButton;
    showSlide(currentIndex + 1, true);
  });

  stageButton.addEventListener('click', function() {
    lastTrigger = stageButton;
    openGalleryModal(true);
  });

  carousel.addEventListener('mouseenter', function() {
    hoverPaused = true;
    stopAutoplay();
  });

  carousel.addEventListener('mouseleave', function() {
    hoverPaused = false;
    startAutoplay();
  });

  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', function() {
    window.setTimeout(function() {
      const activeElement = document.activeElement;
      if (!carousel.contains(activeElement) && !modal.contains(activeElement)) {
        startAutoplay();
      }
    }, 0);
  });

  modalCloseButtons.forEach(function(button) {
    button.addEventListener('click', closeGalleryModal);
  });

  modalPrevButton.addEventListener('click', function() {
    lastTrigger = modalPrevButton;
    showSlide(currentIndex - 1, true);
  });

  modalNextButton.addEventListener('click', function() {
    lastTrigger = modalNextButton;
    showSlide(currentIndex + 1, true);
  });

  modalImage.addEventListener(
    'touchstart',
    function(event) {
      if (event.touches.length !== 1) {
        return;
      }

      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    },
    { passive: true }
  );

  modalImage.addEventListener(
    'touchend',
    function(event) {
      if (event.changedTouches.length !== 1) {
        return;
      }

      const deltaX = event.changedTouches[0].clientX - touchStartX;
      const deltaY = event.changedTouches[0].clientY - touchStartY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX < 40 && absY < 40) {
        return;
      }

      lastTrigger = modalImage;

      if (absX > absY) {
        if (deltaX < 0) {
          showSlide(currentIndex + 1, true);
        } else {
          showSlide(currentIndex - 1, true);
        }
      } else {
        if (deltaY < 0) {
          showSlide(currentIndex + 1, true);
        } else {
          showSlide(currentIndex - 1, true);
        }
      }
    },
    { passive: true }
  );

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && !modal.hidden) {
      closeGalleryModal();
      return;
    }

    if (!modal.hidden) {
      if (event.key === 'ArrowRight') {
        showSlide(currentIndex + 1, true);
      } else if (event.key === 'ArrowLeft') {
        showSlide(currentIndex - 1, true);
      }
      return;
    }

    if (carousel.contains(document.activeElement)) {
      if (event.key === 'ArrowRight') {
        showSlide(currentIndex + 1, true);
      } else if (event.key === 'ArrowLeft') {
        showSlide(currentIndex - 1, true);
      }
    }
  });

  window.addEventListener('popstate', function() {
    if (!modal.hidden) {
      isClosingFromHistory = true;
      closeGalleryModal();
    }
  });

  const visibilityObserver = new IntersectionObserver(
    function(entries) {
      const entry = entries[0];
      isVisible = Boolean(entry && entry.isIntersecting && entry.intersectionRatio >= 0.35);

      if (isVisible) {
        startAutoplay();
      } else {
        stopAutoplay();
      }
    },
    {
      threshold: [0, 0.35, 0.75]
    }
  );

  visibilityObserver.observe(carousel);

  primaryImage.classList.add('is-active');
  primaryImage.src = encodeURI(slides[0].src);
  primaryImage.alt = slides[0].alt;
  secondaryImage.src = encodeURI(slides[0].src);
  secondaryImage.alt = '';
  showSlide(0, false);

  function showSlide(index, userInitiated) {
    const previousIndex = currentIndex;
    const nextIndex = (index + slides.length) % slides.length;
    const isWrapToStart = previousIndex === slides.length - 1 && nextIndex === 0;
    currentIndex = nextIndex;

    const slide = slides[currentIndex];
    const encodedSrc = encodeURI(slide.src);

    title.textContent = slide.title;
    meta.textContent = slide.meta + ' \u2022 ' + slide.label;
    count.textContent = slide.countLabel;
    stageButton.setAttribute('aria-label', 'Open larger view of ' + slide.label.toLowerCase());

    thumbnailButtons.forEach(function(button, buttonIndex) {
      const isActive = buttonIndex === currentIndex;
      button.setAttribute('aria-selected', String(isActive));
      button.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    scrollActiveThumbnailIntoView();

    if (!modal.hidden) {
      modalImage.src = encodedSrc;
      modalImage.alt = slide.alt;
      modalTitle.textContent = slide.title;
      modalMeta.textContent = slide.meta + ' \u2022 ' + slide.label;
    }

    if (previousIndex === nextIndex && userInitiated === false) {
      activeImage.src = encodedSrc;
      activeImage.alt = slide.alt;
      activeImage.classList.add('is-active');
      inactiveImage.classList.remove('is-active', 'is-wrapping');
    } else {
      inactiveImage.src = encodedSrc;
      inactiveImage.alt = slide.alt;
      inactiveImage.classList.toggle('is-wrapping', isWrapToStart);
      activeImage.classList.toggle('is-wrapping', isWrapToStart);

      if (inactiveImage.complete) {
        requestAnimationFrame(runCrossfade);
      } else {
        inactiveImage.onload = function() {
          inactiveImage.onload = null;
          requestAnimationFrame(runCrossfade);
        };
      }
    }

    if (userInitiated) {
      restartAutoplay();
    }

    function runCrossfade() {
      inactiveImage.classList.add('is-active');
      activeImage.classList.remove('is-active');

      const previousActive = activeImage;
      activeImage = inactiveImage;
      inactiveImage = previousActive;

      window.setTimeout(function() {
        inactiveImage.classList.remove('is-wrapping');
        activeImage.classList.remove('is-wrapping');
        inactiveImage.alt = '';
      }, isWrapToStart ? 820 : 620);
    }
  }

  function scrollActiveThumbnailIntoView() {
    const activeThumb = thumbnailButtons[currentIndex];
    if (!activeThumb) {
      return;
    }

    if (!isVisible) {
      return;
    }

    const trackLeft = thumbnails.scrollLeft;
    const trackWidth = thumbnails.clientWidth;
    const thumbLeft = activeThumb.offsetLeft;
    const thumbWidth = activeThumb.offsetWidth;
    const targetLeft = thumbLeft - (trackWidth / 2) + (thumbWidth / 2);

    thumbnails.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: 'smooth'
    });
  }

  function startAutoplay() {
    if (!isVisible || hoverPaused || modalOpen || autoplayId !== null) {
      return;
    }

    autoplayStartedAt = performance.now();
    autoplayId = window.setTimeout(function advanceSlide() {
      showSlide(currentIndex + 1, false);
      remainingAutoplayMs = autoplayDelay;
      autoplayStartedAt = performance.now();
      autoplayId = window.setTimeout(advanceSlide, autoplayDelay);
    }, remainingAutoplayMs);
  }

  function stopAutoplay() {
    if (autoplayId !== null) {
      remainingAutoplayMs = Math.max(250, remainingAutoplayMs - (performance.now() - autoplayStartedAt));
      window.clearTimeout(autoplayId);
      autoplayId = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();
    remainingAutoplayMs = autoplayDelay;
    startAutoplay();
  }

  function openGalleryModal(pushHistory) {
    const slide = slides[currentIndex];

    modal.hidden = false;
    modalOpen = true;
    stopAutoplay();
    modalImage.src = encodeURI(slide.src);
    modalImage.alt = slide.alt;
    modalTitle.textContent = slide.title;
    modalMeta.textContent = slide.meta + ' \u2022 ' + slide.label;
    document.body.classList.add('modal-open');

    if (pushHistory) {
      history.pushState({ galleryModalOpen: true, imageIndex: currentIndex }, '', window.location.href);
    }
  }

  function closeGalleryModal() {
    modal.hidden = true;
    modalOpen = false;
    modalImage.src = '';
    modalImage.alt = '';
    modalTitle.textContent = 'Warriors with Hearts gallery image';
    modalMeta.textContent = '';
    document.body.classList.remove('modal-open');

    if (!isClosingFromHistory && window.history.length > 1) {
      history.back();
    }

    isClosingFromHistory = false;

    if (lastTrigger) {
      lastTrigger.focus();
    }

    startAutoplay();
  }
}

/**
 * Initialize bottom-of-page financials accordion.
 */
function initFinancialsAccordion() {
  const toggle = document.querySelector('.financials-toggle');
  const content = document.querySelector('.financials-content');

  if (!toggle || !content) {
    return;
  }

  toggle.addEventListener('click', function() {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    const shouldExpand = !isExpanded;

    toggle.setAttribute('aria-expanded', String(shouldExpand));
    content.hidden = !shouldExpand;
  });
}


/**
 * Initialize the temporary raffle feature.
 * One toggle controls every raffle-related surface on the site.
 */
function initRaffleFeature() {
  const raffleElements = document.querySelectorAll('[data-raffle-feature]');
  const openButtons = document.querySelectorAll('[data-raffle-open]');
  const modal = document.querySelector('.raffle-modal');
  const dialog = modal ? modal.querySelector('.raffle-modal-dialog') : null;
  const closeButtons = modal ? modal.querySelectorAll('[data-raffle-close]') : [];
  const flyerOpenButtons = document.querySelectorAll('[data-raffle-flyer-open]');
  const flyerModal = document.querySelector('.raffle-flyer-modal');
  const flyerDialog = flyerModal ? flyerModal.querySelector('.raffle-flyer-modal-dialog') : null;
  const flyerCloseButtons = flyerModal ? flyerModal.querySelectorAll('[data-raffle-flyer-close]') : [];

  if (!RAFFLE_FEATURE_ENABLED) {
    raffleElements.forEach(function(element) {
      element.hidden = true;
    });
    return;
  }

  raffleElements.forEach(function(element) {
    element.hidden = false;
  });

  if (!modal || !dialog || openButtons.length === 0) {
    return;
  }

  let lastTrigger = null;

  openButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      lastTrigger = button;
      modal.hidden = false;
      document.body.classList.add('modal-open');
      dialog.setAttribute('tabindex', '-1');
      dialog.focus();
    });
  });

  closeButtons.forEach(function(button) {
    button.addEventListener('click', closeRaffleModal);
  });

  flyerOpenButtons.forEach(function(button) {
    button.addEventListener('click', openRaffleFlyerModal);
  });

  flyerCloseButtons.forEach(function(button) {
    button.addEventListener('click', closeRaffleFlyerModal);
  });

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && flyerModal && !flyerModal.hidden) {
      closeRaffleFlyerModal();
      return;
    }

    if (event.key === 'Escape' && !modal.hidden) {
      closeRaffleModal();
    }
  });

  function closeRaffleModal() {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    closeRaffleFlyerModal();

    if (lastTrigger) {
      lastTrigger.focus();
    }
  }

  function openRaffleFlyerModal() {
    if (!flyerModal || !flyerDialog) {
      return;
    }

    flyerModal.hidden = false;
    flyerDialog.setAttribute('tabindex', '-1');
    flyerDialog.focus();
  }

  function closeRaffleFlyerModal() {
    if (!flyerModal) {
      return;
    }

    flyerModal.hidden = true;
  }
}

/**
 * Load public raffle ticket assignments from a replaceable CSV file.
 * Future updates only require swapping out data/raffle-ticket-assignments.csv.
 */
function initRaffleTicketAssignments() {
  const tableWrap = document.querySelector('.raffle-ticket-table-wrap');
  const tableBody = document.querySelector('.raffle-ticket-table tbody');
  const status = document.querySelector('.raffle-ticket-status');
  const searchInput = document.querySelector('.raffle-ticket-search');
  const modalContent = document.querySelector('.raffle-modal-content');
  const modalDialog = document.querySelector('.raffle-modal-dialog');

  if (!tableWrap || !tableBody || !status || !searchInput || !modalContent || !modalDialog) {
    return;
  }

  let assignments = [];

  fetch('data/raffle-ticket-assignments.csv')
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Unable to load raffle ticket assignments.');
      }

      return response.text();
    })
    .then(function(csvText) {
      const rows = parseCsv(csvText);
      const dataRows = rows.slice(1).filter(function(row) {
        return row.some(function(cell) {
          return cell.trim() !== '';
        });
      });

      tableBody.innerHTML = '';

      if (dataRows.length === 0) {
        status.textContent = 'Ticket assignments will appear here once the first reconciled update is published.';
        tableWrap.hidden = true;
        return;
      }

      assignments = dataRows.map(function(row) {
        return {
          ticketNumber: row[0] || '',
          purchaserName: row[1] || ''
        };
      });

      status.textContent = 'Start typing a purchaser name to view matching ticket assignments.';
      tableWrap.hidden = true;
    })
    .catch(function() {
      status.textContent = 'Ticket assignments will appear here once the first reconciled update is published.';
      tableWrap.hidden = true;
    });

  searchInput.addEventListener('input', function() {
    const query = searchInput.value.trim().toLowerCase();
    tableBody.innerHTML = '';

    if (!assignments.length) {
      return;
    }

    if (!query) {
      status.textContent = 'Start typing a purchaser name to view matching ticket assignments.';
      tableWrap.hidden = true;
      return;
    }

    const matches = assignments.filter(function(assignment) {
      return assignment.purchaserName.toLowerCase().includes(query);
    });

    if (matches.length === 0) {
      status.textContent = 'No matching purchaser names found.';
      tableWrap.hidden = true;
      return;
    }

    matches.forEach(function(assignment) {
      const tr = document.createElement('tr');

      const ticketCell = document.createElement('td');
      ticketCell.textContent = assignment.ticketNumber;
      tr.appendChild(ticketCell);

      const nameCell = document.createElement('td');
      nameCell.textContent = assignment.purchaserName;
      tr.appendChild(nameCell);

      tableBody.appendChild(tr);
    });

    status.textContent = matches.length + ' matching assignment' + (matches.length === 1 ? '' : 's') + ' found.';
    tableWrap.hidden = false;

    window.requestAnimationFrame(function() {
      const scrollContainer =
        modalContent.scrollHeight > modalContent.clientHeight
          ? modalContent
          : modalDialog;

      scrollContainer.scrollTo({
        top: tableWrap.offsetTop - 16,
        behavior: 'smooth'
      });
    });
  });
}

/**
 * Minimal CSV parser supporting quoted fields and commas inside quotes.
 */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      cell += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i += 1;
      }

      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    cell += char;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

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
  
  // Mobile QR Code Click Functionality
  initMobileQRCode();

  // Expandable Program Cards
  initExpandableProgramCards();

  // Board Member Modal
  initBoardModal();
});

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
 * Detect if the user is on a mobile device
 * @returns {boolean} True if mobile device, false otherwise
 */
function isMobileDevice() {
  // Check for touch support and screen width
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobileWidth = window.innerWidth < 768;
  
  // Check user agent for mobile devices
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUserAgent = mobileRegex.test(navigator.userAgent);
  
  return (hasTouchScreen && isMobileWidth) || isMobileUserAgent;
}

/**
 * Initialize mobile QR code click functionality
 * Makes QR code clickable on mobile devices to directly open payment link
 */
function initMobileQRCode() {
  const qrCodeImage = document.querySelector('.qr-code');
  const qrLink = 'https://www.paypal.com/qrcodes/managed/a84d018b-f8d9-4a26-9c41-b27b1644aae3';
  
  if (qrCodeImage && isMobileDevice()) {
    // Make QR code clickable on mobile
    qrCodeImage.style.cursor = 'pointer';
    qrCodeImage.setAttribute('role', 'button');
    qrCodeImage.setAttribute('tabindex', '0');
    qrCodeImage.setAttribute('aria-label', 'Open Venmo donation link');
    
    // Add click handler
    qrCodeImage.addEventListener('click', function() {
      window.location.href = qrLink;
    });
    
    // Add keyboard support for accessibility
    qrCodeImage.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        window.location.href = qrLink;
      }
    });
    
    // Add visual feedback for mobile users
    qrCodeImage.addEventListener('touchstart', function() {
      qrCodeImage.style.opacity = '0.7';
    });
    
    qrCodeImage.addEventListener('touchend', function() {
      qrCodeImage.style.opacity = '1';
    });
  }
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


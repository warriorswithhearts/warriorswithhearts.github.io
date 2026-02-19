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
  
  navLinks.forEach(function(link) {
    // Only handle internal anchor links
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          // Get the navbar height to offset scroll position
          const navbar = document.querySelector('.navbar');
          const navbarHeight = navbar ? navbar.offsetHeight : 0;
          
          // Calculate target position accounting for fixed navbar
          const targetPosition = targetSection.offsetTop - navbarHeight;
          
          // Smooth scroll to target position
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL hash without jumping
          if (history.pushState) {
            history.pushState(null, null, href);
          }
          
          // Set focus to target section for accessibility
          targetSection.setAttribute('tabindex', '-1');
          targetSection.focus();
        }
      });
    }
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
  const venmoLink = 'https://venmo.com/warriorswithhearts';
  
  if (qrCodeImage && isMobileDevice()) {
    // Make QR code clickable on mobile
    qrCodeImage.style.cursor = 'pointer';
    qrCodeImage.setAttribute('role', 'button');
    qrCodeImage.setAttribute('tabindex', '0');
    qrCodeImage.setAttribute('aria-label', 'Open Venmo donation link');
    
    // Add click handler
    qrCodeImage.addEventListener('click', function() {
      window.location.href = venmoLink;
    });
    
    // Add keyboard support for accessibility
    qrCodeImage.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        window.location.href = venmoLink;
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


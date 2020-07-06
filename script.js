'use strict'

window.addEventListener('DOMContentLoaded', () => {
  setupHamburgerMenu();
  setupMenuHideOnScroll();

  setupProductGallery();
});

function setupHamburgerMenu() {

  let hamburgerMenuToggle = document.querySelector(".hamburger-menu-toggle");
  let navMenu = document.querySelector('.nav-main');

  hamburgerMenuToggle.addEventListener('click', (e) => {

    if (hamburgerMenuToggle.classList.contains('hamburger-menu-toggle--cross')) {
      // meaning hamburger already opened
      hamburgerMenuToggle.classList.remove('hamburger-menu-toggle--cross');
      navMenu.classList.remove('nav-main--expanded');
    } else {
      // hamburger menu is collapsed
      hamburgerMenuToggle.classList.add('hamburger-menu-toggle--cross');
      navMenu.classList.add('nav-main--expanded');
    }

  });
};

// adapted from 
// https://www.w3schools.com/howto/howto_js_navbar_hide_scroll.asp
function setupMenuHideOnScroll() {

  let prevScrollpos = window.pageYOffset;
  let minScrolPos = 30; // when does it start shrinking

  let hamburgerMenuToggle = document.querySelector(".hamburger-menu-toggle");
  let navBar = document.querySelector('nav');

  window.addEventListener('scroll', (e) => {
    let currentScrollPos = window.pageYOffset;
    if (prevScrollpos < currentScrollPos && currentScrollPos > minScrolPos) {
      // hide nav bar here
      if (!navBar.classList.contains('nav-hidden') && !hamburgerMenuToggle.classList.contains('hamburger-menu-toggle--cross'))
        navBar.classList.add('nav-hidden');
    } else {
      // show nav bar here
      if (navBar.classList.contains('nav-hidden'))
        navBar.classList.remove('nav-hidden');
    }

    prevScrollpos = currentScrollPos;
  });
}

function setupProductGallery() {
  let productGallery = document.querySelector(".product-gallery");
  if (!productGallery) {
    console.log('".product-gallery" element not found, abort setting up product gallery');
    return;
  }

  console.log('setting up product gallery');

  let displayedImg = document.querySelector('.displayed-img');
  let galleryBar = document.querySelector('.gallery-bar');

  for (let i = 0; i < galleryBar.children.length; i++) {
    let currentImgElement = galleryBar.children[i];
    if (currentImgElement.nodeName == 'IMG') {
      currentImgElement.addEventListener('click', (e) => {
        displayedImg.setAttribute('src', e.target.getAttribute('src'));
      })
    }
  }
}

// Trick adapted from the following link
// purpose is to stop the menu animation showing when window resizing
// https://css-tricks.com/stop-animations-during-window-resizing/
let resizeTimer;
window.addEventListener("resize", () => {
  document.body.classList.add("resize-animation-stopper");
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove("resize-animation-stopper");
  }, 400);
});
'use strict'

window.addEventListener('load', ()=>{
  setupHamburgerMenu();
  setupMenuHideOnScroll();
});

function setupHamburgerMenu() {
  
  let hamburgerMenuToggle = document.querySelector(".hamburger-menu-toggle");
  let navMenu = document.querySelector('.nav-main');

  hamburgerMenuToggle.addEventListener('click', (e) => {

    if(hamburgerMenuToggle.classList.contains('hamburger-menu-toggle--cross')) {
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

  let hamburgerMenuToggle = document.querySelector(".hamburger-menu-toggle");
  let navBar = document.querySelector('nav');

  window.addEventListener('scroll', (e) => {
    let currentScrollPos = window.pageYOffset;
    if (prevScrollpos < currentScrollPos) {
      // hide nav bar here
      if(!navBar.classList.contains('nav-hidden') && !hamburgerMenuToggle.classList.contains('hamburger-menu-toggle--cross'))
        navBar.classList.add('nav-hidden');
    } else {
      // show nav bar here
      if(navBar.classList.contains('nav-hidden'))
        navBar.classList.remove('nav-hidden');
    }

    prevScrollpos = currentScrollPos;
  });
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

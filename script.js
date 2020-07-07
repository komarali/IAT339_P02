"use strict";

window.addEventListener("DOMContentLoaded", () => {
  setupHamburgerMenu();
  setupMenuHideOnScroll();

  setupProductGallery();

  setupProductFilter();
});

function setupHamburgerMenu() {
  let hamburgerMenuToggle = document.querySelector(".hamburger-menu-toggle");
  let navMenu = document.querySelector(".nav-main");

  hamburgerMenuToggle.addEventListener("click", (e) => {
    if (
      hamburgerMenuToggle.classList.contains("hamburger-menu-toggle--cross")
    ) {
      // meaning hamburger already opened
      hamburgerMenuToggle.classList.remove("hamburger-menu-toggle--cross");
      navMenu.classList.remove("nav-main--expanded");
    } else {
      // hamburger menu is collapsed
      hamburgerMenuToggle.classList.add("hamburger-menu-toggle--cross");
      navMenu.classList.add("nav-main--expanded");
    }
  });
}

// adapted from
// https://www.w3schools.com/howto/howto_js_navbar_hide_scroll.asp
function setupMenuHideOnScroll() {
  let prevScrollpos = window.pageYOffset;
  let minScrolPos = 30; // when does it start shrinking

  let hamburgerMenuToggle = document.querySelector(".hamburger-menu-toggle");
  let navBar = document.querySelector("nav");

  window.addEventListener("scroll", (e) => {
    let currentScrollPos = window.pageYOffset;
    if (prevScrollpos < currentScrollPos && currentScrollPos > minScrolPos) {
      // hide nav bar here
      if (
        !navBar.classList.contains("nav-hidden") &&
        !hamburgerMenuToggle.classList.contains("hamburger-menu-toggle--cross")
      )
        navBar.classList.add("nav-hidden");
    } else {
      // show nav bar here
      if (navBar.classList.contains("nav-hidden"))
        navBar.classList.remove("nav-hidden");
    }

    prevScrollpos = currentScrollPos;
  });
}

function setupProductGallery() {
  let productGallery = document.querySelector(".product-gallery");
  if (!productGallery) {
    // console.log('".product-gallery" element not found, abort setting up product gallery');
    return;
  }

  console.log("setting up product gallery");

  let displayedImg = document.querySelector(".displayed-img");
  let galleryBar = document.querySelector(".gallery-bar");

  forEachChild(
    galleryBar,
    (elm) => {
      elm.addEventListener("click", (e) => {
        displayedImg.setAttribute("src", e.target.getAttribute("src"));
      });
    },
    ["IMG"]
  );
}

function setupProductFilter() {
  let chipContainer = document.querySelector(".chip-container");
  let productFilteringSideBar = document.querySelector(
    ".product-filtering-sidebar"
  );
  if (!chipContainer) {
    console.log("chip container not found, abort setting up product filter");
    return;
  }
  if (!productFilteringSideBar) {
    console.log(
      "product-filtering-sidebar not found, abort setting up product filter"
    );
    return;
  }

  // grab all the select box component, potentially buggy but ish alright
  let checkBoxes = document.querySelectorAll('input[type="checkbox"]');
  checkBoxes.forEach((elm) => elm.addEventListener('change', (e) => {
    updateChipFilter();
  }));


  let filteringChip = ChipUI.createChipContainer({
    elm: chipContainer,
    onUpdate: (oldChipList, newChipList) => {
      updateCheckboxFilter(newChipList.map((chipItem) => chipItem.label));
    },
  });

  function updateCheckboxFilter(newFilterList) {
    if (!newFilterList) return;
    checkBoxes.forEach((elm) => {
      if (newFilterList.includes(elm.value))
        elm.checked = true;
      else
        elm.checked = false;
    });
  }

  function updateChipFilter(e) {
    // grab list of active filter
    const activeFilters = getActiveFiltersFromCheckbox();

    // compile list for the chip list display
    ChipUI.setChipList(filteringChip, ChipUI.createChipList(activeFilters));
  }


  function getActiveFiltersFromCheckbox() {
    let activeFilterName = [];
    checkBoxes.forEach((elm) => {
      if (elm.checked)
        activeFilterName.push(elm.value);
    });
    return activeFilterName;
  }

  updateChipFilter();
  //
  // example of setting up chip ui element
  //
  // const chipUI = ChipUI.createChipContainer({
  //   elm: chipContainer,
  //   onUpdate: (oldChipList, newChipList) => {},
  //   chipList: ChipUI.createChipList(["test"]),
  // });
}

/* 

  for the chip ui, i tried to adhere to the functional javascript paradigm

  add/remove an item in immutable object
  https://codeburst.io/use-es2015-object-rest-operator-to-omit-properties-38a3ecffe90


  HTML structure of hip ui
  <section class="chip-container">
    <div href="#" class="chip">
      <span class="chip__label">Cherry MX Brown</span>
      <a href="#" class="chip__close">
        <i class="fa fa-times" aria-hidden="true"></i>
      </a>
    </div>
  </section> 

*/

const ChipObject = {
  label: "",
};

const ChipContainerObject = {
  elm: document.createElement("section"),
  onUpdate: (oldChipList, newChipList) => {},
  chipList: [], // string array
};

const ChipUI = {
  createChipContainer: (options = ChipContainerObject) => {
    // if (options.elm) {
    //   console.error("please specify chip container element");
    //   return false;
    // }
    if (options.elm)
      options.elm.classList.add("chip-container");

    // add the elmeent to html
    ChipUI.renderHTML(options);

    return {
      ...ChipContainerObject,
      ...options
    };
  },

  createChipList: (list = []) => {
    return list.map((v) => {
      return {
        label: v
      };
    });
  },

  setChipList: (chipContainerObject, chipList = []) => {

    const newChipContainerObject = {
      ...chipContainerObject,
      chipList: chipList
    };

    // call back when the list update
    chipContainerObject.onUpdate(newChipContainerObject.chipList, chipList);

    // render the chip object to html
    ChipUI.renderHTML(newChipContainerObject);

    return newChipContainerObject;
  },

  has: (chipContainerObject, label) => {
    if (typeof label !== "string") return;

    // Array.prototype.some
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
    return chipContainerObject.chipList.some(
      (current) => current.label == label
    );
  },

  // for rendering
  renderHTML: (chipContainerObject) => {
    if (!chipContainerObject.chipList) return;

    chipContainerObject.elm.innerHTML = ChipUI.chipContainerHTML(
      chipContainerObject.chipList
    );

    forEachChild(chipContainerObject.elm, (elm) => {
      elm.querySelector(".chip__close").addEventListener("click", (e) => {
        // trigger chip update
        let [chipRemoved, ...newChipList] = chipContainerObject.chipList;
        ChipUI.setChipList(chipContainerObject, newChipList);
      });
    });
  },

  chipContainerHTML: (chipList) => `
    ${chipList.map((chipCurrent) => ChipUI.chipItemHTML(chipCurrent.label)).join('')}
  `,

  chipItemHTML: (label) => `
    <div class="chip">
      <span class="chip__label">${label}</span>
      <a href="#" class="chip__close">
        <i class="fa fa-times" aria-hidden="true"></i>
      </a>
    </div>
  `,
};

// forEachChild utility function
// author: Alvin Leung
//
// use cases:
//
//   forEachChild(parentElm, (elm) => { do sth... });
//   forEachChild(parentElm, (elm) => { do sth... }, ['DIV', 'IMG']);
//   forEachChild(parentElm, (elm) => { do sth... }, 'IMG');
//
function forEachChild(parentElm, func, acceptType) {
  for (let i = 0; i < parentElm.children.length; i++) {
    let currentElm = parentElm.children[i];
    if (!acceptType) func(currentElm);
    else if (acceptType instanceof Array) {
      acceptType.forEach((acceptedElementType) => {
        if (currentElm.nodeName == acceptedElementType) func(currentElm);
      });
    } else if (acceptType instanceof String) {
      if (currentElm.nodeName == acceptType) func(currentElm);
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
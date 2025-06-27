var swiper = new Swiper(".review_carousel", {
  slidesPerView: 1,
  spaceBetween: 25,
  loop: true,
  autoplay: {
    enabled: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    300: {
      slidesPerView: 1,
      spaceBetween: 18,
      autoplay: {
        enabled: true,
        delay: 3000,
      },
    },
    768: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 1,
      spaceBetween: 25,
    },
  },
});

(() => {
  const openNavMenu = document.querySelector(".open-nav-menu"),
    closeNavMenu = document.querySelector(".close-nav-menu"),
    navMenu = document.querySelector(".nav-menu"),
    menuOverlay = document.querySelector(".menu-overlay"),
    mediaSize = 991;

  openNavMenu.addEventListener("click", toggleNav);
  closeNavMenu.addEventListener("click", toggleNav);
  // close the navMenu by clicking outside
  menuOverlay.addEventListener("click", toggleNav);

  function toggleNav() {
    navMenu.classList.toggle("open");
    menuOverlay.classList.toggle("active");
    document.body.classList.toggle("hidden-scrolling");
  }

  navMenu.addEventListener("click", (event) => {
    if (
      event.target.hasAttribute("data-toggle") &&
      window.innerWidth <= mediaSize
    ) {
      // prevent default anchor click behavior
      event.preventDefault();
      const menuItemHasChildren = event.target.parentElement;
      // if menuItemHasChildren is already expanded, collapse it
      if (menuItemHasChildren.classList.contains("active")) {
        collapseSubMenu();
      } else {
        // collapse existing expanded menuItemHasChildren
        if (navMenu.querySelector(".menu-item-has-children.active")) {
          collapseSubMenu();
        }
        // expand new menuItemHasChildren
        menuItemHasChildren.classList.add("active");
        const subMenu = menuItemHasChildren.querySelector(".sub-menu");
        subMenu.style.maxHeight = subMenu.scrollHeight + "px";
      }
    }
  });
  function collapseSubMenu() {
    navMenu
      .querySelector(".menu-item-has-children.active .sub-menu")
      .removeAttribute("style");
    navMenu
      .querySelector(".menu-item-has-children.active")
      .classList.remove("active");
  }
  function resizeFix() {
    // if navMenu is open ,close it
    if (navMenu.classList.contains("open")) {
      toggleNav();
    }
    // if menuItemHasChildren is expanded , collapse it
    if (navMenu.querySelector(".menu-item-has-children.active")) {
      collapseSubMenu();
    }
  }

  window.addEventListener("resize", function () {
    if (this.innerWidth > mediaSize) {
      resizeFix();
    }
  });
})();

function initProductSlider() {
  var sliderThumbnail = new Swiper(".slider-thumbnail", {
    loop: true,
    spaceBetween: 5,
    slidesPerView: 3,
    freeMode: true,
    watchSlidesProgress: true,
    autoplay: false,
    breakpoints: {
      300: {
        slidesPerView: 3,
        spaceBetween: 8,
        loop: false,
        freeMode: false,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
  });

  var slider = new Swiper(".slider", {
    spaceBetween: 10,
    effect: "fade",
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    thumbs: {
      swiper: sliderThumbnail,
    },
  });
}

function showTab(tabId) {
  // Hide all content
  document
    .querySelectorAll(".tab-content")
    .forEach((c) => c.classList.remove("active"));

  // Deactivate all buttons
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));

  // Activate current tab and button
  document.getElementById(tabId).classList.add("active");
  event.currentTarget.classList.add("active");
}

// Select all quantity selectors
document.querySelectorAll(".quantity-selector").forEach(function (selector) {
  const minusBtn = selector.querySelector(".qty-btn.minus");
  const plusBtn = selector.querySelector(".qty-btn.plus");
  const input = selector.querySelector(".qty-input");

  // Handle plus
  plusBtn.addEventListener("click", function () {
    let currentValue = parseInt(input.value);
    input.value = currentValue + 1;
  });

  // Handle minus
  minusBtn.addEventListener("click", function () {
    let currentValue = parseInt(input.value);
    if (currentValue > 1) {
      input.value = currentValue - 1;
    }
  });
});

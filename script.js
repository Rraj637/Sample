// Mobile Menu Toggle Functionality
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeMenu = document.getElementById("closeMenu");

  // Open mobile menu
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
  });

  // Close mobile menu
  closeMenu.addEventListener("click", function () {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("active");
  });

  // Close menu when clicking on a menu item
  const menuItems = document.querySelectorAll(".mobile-menu-item");
  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("active");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    const isClickInsideMenu = mobileMenu.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);

    if (!isClickInsideMenu && !isClickOnHamburger) {
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("active");
    }
  });
});

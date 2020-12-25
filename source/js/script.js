"use strict";

(function () {
  var navToggle = document.querySelector(".nav-toggle");
  var navList = document.querySelector(".nav-list");

  if (navToggle === null || navList === null) {
    return;
  }

  navToggle.addEventListener("click", function (evt) {
    evt.preventDefault();

    this.classList.toggle("nav-toggle--opened");
    this.classList.toggle("nav-toggle--closed");

    navList.classList.toggle("nav-list--closed");
  });

})();

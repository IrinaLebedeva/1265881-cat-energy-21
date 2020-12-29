"use strict";

(function () {
  let navToggle = document.querySelector(".nav-toggle");
  let navList = document.querySelector(".nav-list");

  if (navToggle === null || navList === null) {
    return;
  }

  navToggle.addEventListener("click", function (evt) {
    evt.preventDefault();

    this.classList.toggle("nav-toggle--opened");
    this.classList.toggle("nav-toggle--closed");

    navList.classList.toggle("nav-list--closed");
  });

  //Hide opened menu on mobile, if javascript is enabled
  const clickEvent = new Event("click");
  navToggle.dispatchEvent(clickEvent);
})();

(function () {
  let showCatalogLatestProducts = document.querySelector(".js-show-catalog-latest-products");

  if (showCatalogLatestProducts === null) {
    return;
  }

  showCatalogLatestProducts.addEventListener("click", function (evt) {
    evt.preventDefault();

    let productsArray = document.querySelectorAll(".product");
    productsArray.forEach(function (item) {
      if (item.classList.contains("js-is-catalog-latest-product") !== true &&
          item.classList.contains("visually-hidden") !== true) {
        item.classList.add("visually-hidden");
      }
    })
  });
})();

document.addEventListener("DOMContentLoaded", function() {
  (function () {
    let mapElement = document.querySelector("#map");
    if (mapElement === null) {
      return;
    }

    ymaps.ready(init);

    function init() {
      const companyCoordinates = [59.93863506417266, 30.323117499999945];
      let companyMap = new ymaps.Map("map", {
        center: companyCoordinates,
        zoom: 14
      });
      let companyPlacemark = new ymaps.Placemark(companyCoordinates, {
          hintContent: 'ул. Большая Конюшенная, д. 19/8, Санкт-Петербург'
        }, {
          iconLayout: 'default#image',
          iconImageHref: 'img/map-pin.png',
          iconImageSize: [57, 53],
          iconImageOffset: [-26, -48]
        }
      );
      companyMap.geoObjects.add(companyPlacemark);
    }

    //Hide map image, if map container was found
    document.querySelector(".page-footer__map").classList.add("visually-hidden");
  })();
});

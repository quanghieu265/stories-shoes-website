// Swipe for bootstrap carousel
$(".carousel").swipe({
  swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
    if (direction == 'left') $(this).carousel('next');
    if (direction == 'right') $(this).carousel('prev');
  },
  allowPageScroll: "vertical"
});


// event scroll
// let firstCenter=($(window).innerHeight() + $(this).scrollTop()) / 2;;
let positionTypeProduct = "";
let viewportCenter = "";
$(window).scroll(function (event) {
  // Parameter
  positionTypeProduct = $(".product-type").position()
  viewportCenter = ($(window).innerHeight() / 2) + $(this).scrollTop()
  let positionNews = $(".news").position()
  let positionBanner = $(".banner-sale").position()
  let positionPolicy = $(".policy").position()

  // Type Product
  if (viewportCenter > positionTypeProduct.top) {
    $(".product-type-card").addClass("opacity-show");
  } else {
    $(".product-type-card").removeClass("opacity-show");
  }
  //banner sale event
  if (viewportCenter > positionBanner.top) {
    $(".sale-img").addClass("opacity-show");
    $(".banner-text-sale").addClass("text-show");
  } else {
    $(".sale-img").removeClass("opacity-show");
    $(".banner-text-sale").removeClass("text-show");
  }
  // News
  if (viewportCenter > positionNews.top) {
    $(".news-hide").addClass("news-show");
  } else {
    $(".news-hide").removeClass("news-show");
  }
  //Policy
  if (viewportCenter > positionPolicy.top) {
    $(".policy-content").addClass("opacity-show");
  } else {
    $(".policy-content").removeClass("opacity-show");
  }

});

// -----------------------------------------------------------------------------------------------

// Own Carousel
$(document).ready(function () {
  $(".owl-carousel").owlCarousel({
    margin: 10,
    loop: true,
    dots: true,
    dotsEach: 2,
    items: 4,
    nav: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    responsiveClass: true,
    responsive: {
      1: {
        items: 1,
        nav: false
      },
      576: {
        items: 2,
        nav: false
      },
      768: {
        items: 3,
        nav: true,
      },
      968: {
        items: 4,
        nav: true,
      }
    }
  });

  positionTypeProduct = $(".product-type").position();
  if (firstCenter > positionTypeProduct.top) {
    $(".product-type-card").addClass("opacity-show");
  };
});


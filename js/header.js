// Header 
// pop-up add to cart
$(".toast-close").on("click", function () {
    $('.toast').toast('hide')
})

$(".button-cart").on("click", function () {
    $('.toast').toast('show')
})

// Sidebar mobi
$(".fa-bars").on("click", function () {
    $(".side-bar").addClass("sidebar-show")
})

$(".fa-times").on("click", function () {
    $(".side-bar").removeClass("sidebar-show")
})

// Search-mobi
$(".fa-search").on("click", function () {
    $(".search-mobi-box").toggleClass("search-show")
})

//   Nav-scroll
let lastScrollTop = 0;
let firstCenter = ($(window).innerHeight() + $(this).scrollTop()) / 2;;
$(window).scroll(function (event) {
    let st = $(this).scrollTop();
    //Nav event
    if (st > firstCenter) {
        if (st > lastScrollTop) {
            // Scroll down
            $(".header").addClass("hide-nav");
        } else {
            // Scroll up
            $(".header").removeClass("hide-nav");
        }
        lastScrollTop = st;
    }
})

//trigger event "Preview img hover"
$('.preview-img > img').hover(function () {
    let eq = $(".preview-img > img").index(this)
    $(`.fade-in:eq(${eq})`).toggleClass("fade-out");
});

// Header 

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

// danh sach cac bien 
let myData = "";
let buildingHtml = ""
let totalItem = "";
let numberPage = "";
let sortBy = "";
let orderBy = "";
let type = "";
let currentPage = "";
let gteArray = "0";
let lteArray = "1000";
let limitNumber = 6;
// get data from sever ( 1st time)
$.ajax({
    type: "GET",
    url: "https://stories-shoes-website.herokuapp.com/products" + `?_page=1&_limit=${limitNumber}&_sort=id&_order=desc`
}).done(renderData)

//function build htlm and button base on data get from server
function renderData(data, textStatus, request) {
    myData = data;
    totalItem = request.getResponseHeader('x-Total-Count');
    $(".result-item").text(totalItem);
    buildHtml()
    buildPagination()
}

// function build html 
function buildHtml() {
    if (myData.length === 0) {
        $(".product-list-item").html(`<div style="padding: 16px 0px;">No matches found for your search: ${searchValue}</div>`);
    }
    else {
        let finalHtml = "";
        for (i = 0; i < myData.length; i++) {
            buildingHtml = `
        <div class="col-sm-12 col-lg-4 col-md-6">
        <div class="product-details">
            <a href="./product-detail.html" target="_blank">
                <div class="over-flow">
                    <img src="${myData[i].product_img}" alt="shoes-img">
                    <div class="mini-box-sale">
                        <span>-50%</span>
                    </div>
                </div>
                <div class="product-details-info">
                    <div class="preview-box">
                        <div class="preview-img">
                        </div>
                        <div class="product-color">
                            <span>${myData[i].product_relate.length} colors</span>
                        </div>
                    </div>
                    <div class="product-name">${myData[i].product_name}</div>
                    <div class="product-price">$${myData[i].price}.00<span class="text-sale"></span></div>
                    <div class="product-cart">
                        <button class="button-cart">
                            <div>Add to cart</div>
                            <div>|</div>
                            <div><i class="fas fa-shopping-cart"></i></div>
                        </button>
                    </div>
                </div>
            </a>
        </div>
    </div>
        `
            $(".product-list-item").html(buildingHtml);
            for (k = 0; k < myData[i].product_relate.length; k++) {
                $(".mini-box-sale").after(`<img class="fade-in" src="${myData[i].product_relate[k]}" alt="shoes-img">`)
                $(".preview-img").append(`<img src="${myData[i].product_relate[k]}" alt="shoes-img">`)
            }
            finalHtml += $(".product-list-item").html();
        }
        $(".product-list-item").html(finalHtml);
        //trigger event "Preview img hover"
        $('.preview-img > img').hover(function () {
            let eq = $(".preview-img > img").index(this)
            $(`.fade-in:eq(${eq})`).toggleClass("fade-out");
        });
    }
}

// function build pagination base on data length
function buildPagination() {
    // Remove all old button event
    $(".page-item").off("click", clickToPage)

    if (myData.length === 0) {
        $(".pagination").html("")
    }
    else {
        // Remove all old button
        $(".pagination").html(`<li class="page-item page-back disabled">
    <div class="page-link" tabindex="-1"><i class="fas fa-chevron-left"></i></div>
</li>
<li class="page-item  pagination-active"><div class="page-link">1</div></li>
<li class="page-item page-forward">
    <div class="page-link"><i class="fas fa-chevron-right"></i></div>
</li>`)

        // build new button 
        currentPage = $(".pagination-active").text()
        numberPage = Math.ceil(totalItem / limitNumber);

        let pagiContent = "";
        for (i = 0; i < numberPage - 1; i++) {
            pagiContent += `<li class="page-item"><div class="page-link">${i + 2}</div></li>`
        }
        $(".pagination-active").after(pagiContent);
        $(".page-item").on("click", clickToPage)
    }

}

function clickToPage() {
    window.scrollTo(0,0)
    if ($(this).hasClass("page-back") == true) {
        if (currentPage > 1) {
            currentPage--;
            changePage()
        }
    } else if ($(this).hasClass("page-forward") == true) {
        if (currentPage < numberPage) {
            currentPage++;
            changePage()
        }
    } else {
        currentPage = $(this).text();
        changePage();
    }
}

function changePage() {
    //sửa lại html theo giá trị số trang hiện tại (number) và theo thứ tự (sort)
    changeValue()

    //Tạo trường hợp để sửa CSS cho nút Page
    $(".page-item").removeClass("pagination-active");
    $(".page-item").eq(currentPage).addClass("pagination-active")

    if (currentPage == "1") {
        $(".page-item").removeClass("disabled")
        $(".page-item:first-child").addClass("disabled")
    } else if (currentPage == numberPage) {
        $(".page-item").removeClass("disabled")
        $(".page-item:last-child").addClass("disabled")
    } else {
        $(".page-item").removeClass("disabled")
    }
}
//  --------------------  --------------------  -------------------- 

// function get and build data from querry param WITHOUT REBUILD PAGINATION
function changeValue() {
    $.ajax({
        type: "GET",
        url: "https://stories-shoes-website.herokuapp.com/products" + `?type_like=${type}&size_like=${size}&price_gte=${gteArray}&price_lte=${lteArray}&_sort=${sortBy}&_order=${orderBy}&_page=${currentPage}&_limit=${limitNumber}`
    }).done(renderCurrentData)
}

// build htlm WITHOUT REBUILD PAGINATION
function renderCurrentData(data) {
    myData = data;
    buildHtml()
}

//  --------------------  --------------------  -------------------- 

// function build html base on query params AND ALSO REBUILD PAGINATION
function changeHtml() {
    $.ajax({
        type: "GET",
        url: "https://stories-shoes-website.herokuapp.com/products" + `?q=${searchValue}&type_like=${type}&size_like=${size}&product_color_like=${color}&price_gte=${gteArray}&price_lte=${lteArray}&_sort=${sortBy}&_order=${orderBy}&_limit=${limitNumber}`
        // _page=${currentPage}
    }).done(renderData)
}

// --------------------  sorting -------------------- 
$(".ascending").on("click", function () {
    // CSS for mobi
    $(".soft-text").toggleClass("soft-text-show")
    $('.price-checkbox-mobi > div > span > i').removeClass('sort-item-active')
    $(this).find("i").toggleClass("sort-item-active");
    // ------------------------------------
    sortBy = "price";
    orderBy = "asc"
    changeValue();
    $(".type-sort").html(`${$(".ascending").eq(0).text()}`)
})

$(".descending").on("click", function () {
    // CSS for mobi
    $(".soft-text").toggleClass("soft-text-show")
    $('.price-checkbox-mobi > div > span > i').removeClass('sort-item-active')
    $(this).find("i").toggleClass("sort-item-active");
    // ------------------------------------
    sortBy = "price";
    orderBy = "desc"
    changeValue();
    $(".type-sort").html(`${$(".descending").eq(0).text()}`)
})

$(".fromNew").on("click", function () {
    // CSS for mobi
    $(".soft-text").toggleClass("soft-text-show")
    $('.price-checkbox-mobi > div > span > i').removeClass('sort-item-active')
    $(this).find("i").toggleClass("sort-item-active");
    // ------------------------------------
    sortBy = "id";
    orderBy = "desc"
    changeValue();
    $(".type-sort").html(`${$(".fromNew").eq(0).text()}`)
})

$(".fromOld").on("click", function () {
    // CSS for mobi
    $(".soft-text").toggleClass("soft-text-show")
    $('.price-checkbox-mobi > div > span > i').removeClass('sort-item-active')
    $(this).find("i").toggleClass("sort-item-active");
    // ------------------------------------
    sortBy = "id";
    orderBy = "asc"
    changeValue();
    $(".type-sort").html(`${$(".fromOld").eq(0).text()}`)
})

// -------------------- filter function  -------------------- 

// filter by type
$(".sidebar-filter").on("click", function () {
    // CSS for mobi
    $('.sidebar-filter').find("i").removeClass('type-item-active')
    $(this).find("i").toggleClass("type-item-active");
    // ------------------------------------
    type = $(this).text();
    if (type === "View All") {
        type = "";
    }
    changeHtml()
})

// filter by price
$(".filter-price").change(function () {
    gteArray = []
    lteArray = [];

    if ($(this).val() === "low") {
        $('#price1').prop('checked', true)
        $('#price1-mobi').prop('checked', true)
        gteArray.push(0);
        lteArray.push(25);
    }
    if ($(this).val() === "medium") {
        $('#price2').prop('checked', true)
        $('#price2-mobi').prop('checked', true)
        gteArray.push(25);
        lteArray.push(50);
    }

    if ($(this).val() === "high") {
        $('#price3').prop('checked', true)
        $('#price3-mobi').prop('checked', true)
        gteArray.push(50);
        lteArray.push(100);
    }
    if ($(this).val() === "over") {
        $('#price4').prop('checked', true)
        $('#price4-mobi').prop('checked', true)
        gteArray.push(100);
        lteArray.push(1000);
    }
    if ($(this).val() === "all") {
        $('#priceAll').prop('checked', true)
        $('#priceAll-mobi').prop('checked', true)
        gteArray.push(0);
        lteArray.push(1000);
    }

    changeHtml()
})

// filter by size
let size = ""
$(".size-button").on("click", function () {
    if ($(this).hasClass("size-button-active") === false) {
        size = $(this).text();
    }
    else {
        size = "";
    }

    changeHtml()
})

// filter by color
let color = ""
$(".color-button").on("click", function () {
    if ($(this).find("i").hasClass("color-item-active") === false) {
        color = $(this).find("span").text();
    }
    else {
        color = "";
    }

    changeHtml()
})

// Search input
let searchValue = "";

$(".input-filter").change(function () {
    searchValue = $(".input-filter").val()
    changeHtml()
})

$(".input-filter2").change(function () {
    searchValue = $(".input-filter2").val()
    changeHtml()
})

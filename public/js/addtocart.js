// pop-up add to cart
let toastTimer = "";
function startTimer() {
    toastTimer = setTimeout(function () {
        $('.toast').toast('hide')
        $(".toast-container").removeClass("toast-container-show")
    }, 5000)
}

function clearTimer() {
    clearTimeout(toastTimer)
}

$(".toast-close").on("click", function () {
    clearTimer()
})

$(".toast-container").on("click", function () {
    clearTimer()
    $('.toast').toast('hide')
    $(".toast-container").removeClass("toast-container-show")
})

$(".button-cart").on("click", function () {
    addToCart()
})

let cartPatch = null;
function addToCart() {
    if ($(".size-button").hasClass("size-button-active") == true) {
        $(".size-error").text("")
        let itemCart ={
            shoes_img: $(".easyzoom").find("img").eq(0).attr('src'),
            shoes_name: $(".shoes-name").text(),
            shoes_price: $(".shoes-price").text(),
            shoes_size: $(".size-button-active").text(),
            shoes_quantity: $("#quantity").val()
        }
        userData[0].cart.push(itemCart)
        cartPatch = {"cart":[]};
        for(i=0;i<userData[0].cart.length;i++){
            cartPatch.cart.push(userData[0].cart[i]);
        }

        CartPopHtml();
        $('.toast').toast('show')
        $(".toast-container").addClass("toast-container-show")
        startTimer();
        CartUploadData();

    } else {
        $(".size-error").text("Please select your size")
        return
    }

}

function CartPopHtml() {
    let html = `<div>
                        <img class="toast-img" src="${$(".easyzoom").find("img").eq(0).attr('src')}" alt="toast-img">
                    </div>
                    <div class="toast-text">
                        <div>${$(".shoes-name").text()}</div>
                        <div>Size: ${$(".size-button-active").text()}</div>
                        <div>Price: ${$(".shoes-price").text()}.00</div>
                        <div>Quantity: ${$("#quantity").val()}</div>
                    </div>`
    $(".toast-body-content").html(html);
    $(".view-cart").text(`View Cart (${userData[0].cart.length})`);
    
}

function CartUploadData() {
    $.ajax({
        url: "https://stories-shoes-website.herokuapp.com/users/" + `${userData[0].id}`,
        data: JSON.stringify(cartPatch),
        type: 'PATCH',
        contentType: 'application/json',
        processData: false,
        dataType: 'json'
    }).done(function(){
        $(".number").html(`${userData[0].cart.length}`)
    });
}
let subTotal = 0;
let total = 0;
let discount = 0
// render checkout page html
async function checkOutRender() {
    userData = await loginSuccess();
    for (i = 0; i < userData[0].cart.length; i++) {
        // Count all money
        subTotal += Number(userData[0].cart[i].shoes_price.replace("$", "") * userData[0].cart[i].shoes_quantity)
    }
    loginNav();
    orderSum()
    orderDetail();
    if (window.localStorage.getItem("promo-code") === null) {
        return
    } else {
        $(".promotion-code").val(`${window.localStorage.getItem("promo-code")}`)
        promotionCode();    
    }

}
checkOutRender()

// render order summary html
function orderSum() {
    $(".order-summary").html(`
    <h5 style="margin-bottom: 20px;">ORDER SUMMARY</h5>
    <div class="order-summary-box">
        <p>PRODUCT</p>
        <p>${userData[0].cart.length} ITEMS</p>
    </div>
    <div class="order-summary-box">
        <p>SUBTOTAL</p>
        <p>$${subTotal}.00</p>
    </div>
    <div class="order-summary-box">
        <p>DELIVERY</p>
        <p>FREE</p>
    </div>
    <div class="order-summary-promotion">
        <p>PROMOTION</p>
        <p>- $<span class="promotion-price">${discount}</span></p>
    </div>
    <div class="order-summary-total">
        <p>TOTAL</p>
        <p>$${subTotal - discount}.00</p>
    </div>`)
}

//render order detail html
function orderDetail(){
    let detailHtml=""
    for (i=0;i<userData[0].cart.length;i++){
        detailHtml+= `
        <div class="order-items">
                    <img src="${userData[0].cart[i].shoes_img}" alt="order-items">
                    <div class="order-items-info">
                        <span>${userData[0].cart[i].shoes_name}</span>
                        <span>SIZE: ${userData[0].cart[i].shoes_size}</span>
                        <span>Quantity: ${userData[0].cart[i].shoes_quantity}</span>
                        <span>${userData[0].cart[i].shoes_price}</span>
                    </div>
                </div>
        `
    }
    $(".order-details").html(detailHtml);
} 

// Promotion Code function
$(".promotion-code").change(function () {
    promotionCode()
})

function promotionCode() {
    let promoCode = $(".promotion-code").val();
    if (promoCode === "Sale50%") {
        discount = Math.ceil(subTotal * 0.5)
        orderSum()
        $(".order-summary-promotion").css("display", "flex")
        $(".promotion-error").text("Promotion code has been applied").css("color", "green")
    } else if (promoCode === "") {
        discount = 0;
        orderSum()
        $(".order-summary-promotion").css("display", "none")
        $(".promotion-error").text("")
    } else {
        discount = 0;
        orderSum()
        $(".order-summary-promotion").css("display", "none")
        $(".promotion-error").text("Promotion code not available, try this: Sale50%").css("color", "red")
    }
}
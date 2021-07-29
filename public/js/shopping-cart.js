// ------------------------ shopping cart ------------------------------
// Render table html
let total = 0;
let discount = 0

function tableCart() {
    subTotal = 0
    let disabledClass = ""
    let cartHtml = "";
    if (userData[0].cart.length === 0) {
        $("tbody").html(`<div style="padding: 16px 0px;">There are no items in your cart.</div>`)
    } else {
        for (i = 0; i < userData[0].cart.length; i++) {
            if (userData[0].cart[i].shoes_quantity == 1) {
                disabledClass = "decrease-off"
            } else {
                disabledClass = ""
            }

            // Count all money
            subTotal += Number(userData[0].cart[i].shoes_price.replace("$", "") * userData[0].cart[i].shoes_quantity)

            // render item in cart
            cartHtml += `
        <tr>
                            <td>
                                <div class="d-flex gap-3 align-items-center ">
                                    <div>
                                        <img class="cart-img" src="${userData[0].cart[i].shoes_img}" alt="cart-img">
                                    </div>
                                    <div>
                                        ${userData[0].cart[i].shoes_name}
                                    </div>
                                    <div>
                                        Size ${userData[0].cart[i].shoes_size}
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="current-price">${userData[0].cart[i].shoes_price}.00</span>
                            </td>
                            <td>
                                <div class="quantity-button">
                                    <span class="decrease ${disabledClass}">-</span>
                                    <input class="quantity-input" type="number" name="quantity" id="quantity" value="${userData[0].cart[i].shoes_quantity}" min="1" max="100">
                                    <span class="increase">+</span>
                                </div>
                            </td>
                            <td>
                                <span class="total-price">$${userData[0].cart[i].shoes_price.replace("$", "") * userData[0].cart[i].shoes_quantity}.00</span>
                            </td>
                            <td>
                                <i data-bs-target="#modal3" data-bs-toggle="modal"
                                data-bs-dismiss="modal" class="far fa-trash-alt"></i>
                            </td>
                        </tr>
        `

        }
        $("tbody").html(cartHtml)

        // add Quantity adjust to button
        $(".increase").on("click", function () {
            let index = $(".quantity-button > .increase").index(this)
            $(".decrease").eq(index).removeClass("decrease-off")
            value = $(".quantity-input").eq(index).val()
            value++;
            $(".quantity-input").eq(index).val(value);
            $(".total-price").eq(index).text(`$${$(".current-price").eq(index).text().replace("$", "") * value}.00`)
            subTotal += Number($(".current-price").eq(index).text().replace("$", ""))
            promotionCode()
        })

        $(".decrease").on("click", function () {
            let index = $(".quantity-button > .decrease").index(this)
            value = $(".quantity-input").eq(index).val()
            value--;
            if (value <= 1) {
                $(".quantity-input").eq(index).val(value)
                $(".decrease").eq(index).addClass("decrease-off")
            } else {
                $(".quantity-input").eq(index).val(value)
            }
            $(".quantity-input").eq(index).val(value);
            $(".total-price").eq(index).text(`$${$(".current-price").eq(index).text().replace("$", "") * value}.00`)
            subTotal -= Number($(".current-price").eq(index).text().replace("$", ""))
            promotionCode()
        })

        $(".quantity-input").change(function () {
            let index = $(".quantity-button > .quantity-input").index(this)
            value = $(".quantity-input").eq(index).val()
            if (value < 1) {
                value = 1
                $(".quantity-input").eq(index).val(value)
            }
            oldPrice = $(".total-price").eq(index).text().replace("$", "")
            newPrice = $(".current-price").eq(index).text().replace("$", "") * value
            $(".total-price").eq(index).text(`$${newPrice}.00`)
            subTotal += newPrice - oldPrice
            promotionCode()
        })

        // Remove item
        $(".fa-trash-alt").on("click", function () {
            indexRemove = $("td > .fa-trash-alt").index(this)

        })
    }
}

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

// render entire cart page html
async function shoppingCartRender() {
    userData = await loginSuccess();
    loginNav();
    tableCart();
    orderSum();
}
shoppingCartRender();

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

// Check out function
$(".checkout-button").on("click", checkOutButton);
function checkOutButton() {
    if (userData == undefined) {
        window.location.replace("/checkout.html");
    } else {

        // Get data needed and save to local storage,and reuse in checkout page
        window.localStorage.setItem('promo-code', `${$(".promotion-code").val()}`)
        // renew user database ( in case user detele item from cart or change quantity)
        let cartPatch = { "cart": [] };
        for (i = 0; i < userData[0].cart.length; i++) {
            userData[0].cart[i].shoes_quantity = $(".quantity-input").eq(i).val()
            cartPatch.cart.push(userData[0].cart[i]);
        }

        $.ajax({
            url: "https://stories-shoes-website.herokuapp.com/users/" + `${userData[0].id}`,
            data: JSON.stringify(cartPatch),
            type: 'PATCH',
            contentType: 'application/json',
            processData: false,
            dataType: 'json'
        })
            .done(function () {
                window.location.replace("https://stories-shoes-website.herokuapp.com/checkout.html");
            });
    }
}

// Remove button function
$(".remove-button").hover(function () {
    $(".remove-button").removeClass("active")
    $(this).addClass("active");
})

$(".remove-agree").on("click", function () {
    userData[0].cart.splice(indexRemove, 1)
    subTotal -= $(".total-price").eq(indexRemove).text().replace("$", "")
    promotionCode()
    // $(".fa-trash-alt").eq(indexRemove).closest('tr').remove()
    loginNav()

    $(".btn-close").trigger("click");
    let cartPatch = { "cart": [] };
    for (i = 0; i < userData[0].cart.length; i++) {
        userData[0].cart[i].shoes_quantity = $(".quantity-input").eq(i).val()
        cartPatch.cart.push(userData[0].cart[i]);
    }
    $.ajax({
        url: "https://stories-shoes-website.herokuapp.com/users/" + `${userData[0].id}`,
        data: JSON.stringify(cartPatch),
        type: 'PATCH',
        contentType: 'application/json',
        processData: false,
        dataType: 'json'
    }).done(
        tableCart
    )
})

$(".remove-disagree").on("click", function () {
    $(".btn-close").trigger("click");
})
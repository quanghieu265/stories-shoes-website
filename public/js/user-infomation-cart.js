// danh sach cac bien
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
let userData = "";

// function get data user when login success
function loginSuccess() {
    if (window.localStorage.getItem('email-login') == null && window.localStorage.getItem('password-login') == null) {
        navHtml();
        return userData;
    } else {
        return $.ajax({
            type: "GET",
            url: "https://stories-shoes-website.herokuapp.com/users" + `?email=${window.localStorage.getItem('email-login')}&password=${window.localStorage.getItem('password-login')}`
        })
    }
}

// render nav html when login success
function loginNav() {
    if (userData.length == 1) {
        navHtml();
    }
    else {
        alert("Có lỗi xảy ra, Đăng nhập tài khoản không thành công");
    }
}

function navHtml() {
    // Guest User
    if (userData.length !== 1) {
        cartGuest = JSON.parse(window.localStorage.getItem("cart-guest"));
        if(cartGuest===null){
            cartGuest="";
        }
        $(".number").html(`${cartGuest.length}`)
    }
    // login user
    else {
        let navBuild = `
    <button class="logout">
    <i class="fas fa-sign-out-alt"></i>
        <span class="mobi-respon">LOGOUT</span>
    </button>
    |
    <button class="user-avatar" >
        <i class="far fa-user"></i>
        <span class="mobi-respon">Hi ${userData[0].name}</span>
    </button>
`;
        $(".user-section").html(navBuild);
        $(".number").html(`${userData[0].cart.length}`)

        // function logout
        $(".logout").on("click", function () {
            window.localStorage.removeItem('email-login');
            window.localStorage.removeItem('password-login');
            window.localStorage.removeItem('promo-code')
            location.reload()
        })
    }
}

// ---------------------------------------- Register---------------------------------------

// get data base on email or password
function getData(type, url) {
    return $.ajax({
        type: "GET",
        url: "https://stories-shoes-website.herokuapp.com/users" + `?${type}=${url}`
    })
}

// Check validate register form 
async function checkRegister() {
    let validStatus = true;
    $(".error").text("");
    if ($("#name").val() === "") {
        validStatus = false;
        $("#name ~ div").text('Please enter your name');
    }
    if ($("#password").val() === "") {
        validStatus = false;
        $("#password ~ div").text('Please enter a password');
    }

    if (emailRegex.test($("#email").val()) === false) {
        validStatus = false;
        $("#email ~ div").text(`Please enter a valid e-mail address`);
    }
    else {
        // Check email có tồn tại trong database hay chưa
        let emailValid = $("#email").val();
        let emailCheck = await getData("email", emailValid);
        if (emailCheck.length > 0) {
            validStatus = false;
            $("#email ~ div").text("This email already exists");
        }
    }
    return validStatus;
}

// submit data register form 
$("#register-form").submit(async function (event) {
    event.preventDefault();
    let status = await checkRegister();

    // Dữ liệu hợp lệ thì bắt đầu POST(tạo mới) dữ liệu lên sever
    if (status) {

        // lấy dữ liệu từ các ô input trong <form>
        let data = new FormData(event.target);

        let formJSON = Object.fromEntries(data.entries());
        
        let results = JSON.stringify(formJSON);

        //   Gửi(Post) dữ liệu lên database
        $.ajax({
            type: "POST",
            url: "https://stories-shoes-website.herokuapp.com/users",
            data: results,
            contentType: "application/json",
            dataType: 'json'
        }).done(function () {
            $(".login-message").text("Successfully Register")
            $(".login-success").trigger('click');
            setTimeout(function(){ location.reload(); }, 1500);
        }).fail(function () {
            alert("Có lỗi xảy ra, Đăng ký tài khoản không thành công");
            location.reload()
        });
    }
});

// bind event submit to button ( chạy sau khi khai báo function submit cho form)
$(".register-button").on("click", function () {
    $("#register-form").submit();
})

// ---------------------------------------- login---------------------------------------

// Check validate login form 
async function checkLogin() {
    let validStatus = true;
    $(".error").text("");

    if ($("#password-login").val() === "") {
        validStatus = false;
        $("#password-login ~ div").text('Please enter a password');
    }
    else {
        let passValid = $("#password-login").val();
        let passCheck = await getData("password", passValid);
        if (passCheck.length == 0) {
            validStatus = false;
            $("#password-login ~ div").text('Incorrect email/password – please check and retry');
        }
    }

    if (emailRegex.test($("#email-login").val()) === false) {
        validStatus = false;
        $("#email-login ~ div").text(`Please enter a valid e-mail address`);
    }
    else {
        // Check email có khớp với database hay không
        let emailValid = $("#email-login").val();
        let emailCheck = await getData("email", emailValid);
        if (emailCheck.length == 0) {
            validStatus = false;
            $("#password-login ~ div").text('Incorrect email/password – please check and retry');
        }
    }
    return validStatus;
}

// submit data login form 
$("#login-form").submit(async function (event) {
    event.preventDefault();
    let status = await checkLogin();

    if (status) {
        let data = new FormData(event.target);

        let formJSON = Object.fromEntries(data.entries());

        let emailLogin = formJSON["email_login"]
        let passwordLogin = formJSON["password_login"]

        window.localStorage.setItem('email-login', `${emailLogin}`);
        window.localStorage.setItem('password-login', `${passwordLogin}`);
        window.localStorage.setItem('promo-code', ``)
        $(".login-message").text("Successfully Login")
        $(".login-success").trigger('click');
        setTimeout(function(){ location.reload(); }, 1500);
    }
});

// bind event submit to button ( chạy sau khi khai báo function submit cho form)
$(".login-button").on("click", function () {
    $("#login-form").submit();
})



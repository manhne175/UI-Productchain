

function validateEmail() {
    var email = document.getElementById("email").value;
    var error = document.getElementById("email_address1_error");
    if(!email.includes("@")) {
        error.textContent = "Invalid email address. Please include an '@' symbol.";
    }
    else {
        error.textContent = "";
    }
}

function ChangeText() {
    validateEmail();
}
var $ = function (id) {
    return document.getElementById(id);
}

var togglePassword = function () {
    var passwordInput = $("password");
    var checkbox = $("hidden");


    if (checkbox.checked) {

        passwordInput.type = "text";
    } else {
        // Nếu bỏ tích -> Đổi về dạng password để ẩn
        passwordInput.type = "password";
    }
}

var $ = function (id) {
    return document.getElementById(id);
}

var validateName = function() {
    var firstnameInput = $("firstname").value; // Lấy giá trị
    var lastnameInput = $("lastname").value; // Lấy giá trị
    var errorSpan = $("firstname_error");     // Lấy thẻ hiện lỗi
    var errorSpan2 = $("lastname_error");   // Lấy thẻ hiện lỗi

    // Kiểm tra nếu ô trống

    // Cấu hình số ký tự mong muốn
    var minLength = 2;

    // 1. Kiểm tra nếu ô trống (khi xóa hết)
    if (firstnameInput.length == 0 || lastnameInput.length == 0) {
        errorSpan.innerHTML = ""; // Xóa thông báo lỗi
        errorSpan2.innerHTML = ""; // Xóa thông báo lỗi
        return; // Dừng hàm
    }

    // 2. Kiểm tra độ dài
    if (firstnameInput.length < minLength || lastnameInput.length < minLength) {
        // TRƯỜNG HỢP LỖI: Ngắn quá
        errorSpan.innerHTML = "Tên quá ngắn! Phải có ít nhất " + minLength + " ký tự.";
        errorSpan.style.color = "red";
        errorSpan2.innerHTML = "Họ quá ngắn! Phải có ít nhất " + minLength + " ký tự.";
        errorSpan2.style.color = "red";
    }
    else {
        // TRƯỜNG HỢP ĐÚNG - Tự động viết hoa chữ đầu
        var capitalizedFirstname = firstnameInput.charAt(0).toUpperCase() + firstnameInput.slice(1).toLowerCase();
        var capitalizedLastname = lastnameInput.charAt(0).toUpperCase() + lastnameInput.slice(1).toLowerCase();
        
        $("firstname").value = capitalizedFirstname;
        $("lastname").value = capitalizedLastname;
        
        errorSpan.innerHTML = "Độ dài hợp lệ ✔";
        errorSpan.style.color = "green";
        errorSpan2.innerHTML = "Độ dài hợp lệ ✔";
        errorSpan2.style.color = "green"; 
    }
}


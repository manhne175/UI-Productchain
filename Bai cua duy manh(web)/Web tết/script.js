// Danh sách lời chúc
const wishes = [
    "Năm mới an khang thịnh vượng, vạn sự như ý!",
    "Tiền vào như nước sông Đà, tiền ra nhỏ giọt như cà phê phin.",
    "Sức khỏe dồi dào, công danh thăng tiến.",
    "Hay ăn chóng lớn, học giỏi chăm ngoan (dành cho bé).",
    "Tấn tài tấn lộc, tấn bình an.",
    "Cung hỷ phát tài, tiền vô xồng xộc!",
    "Chúc bạn năm mới thoát kiếp F.A (ib mình nhé hehe)!"
];

// Danh sách số tiền ảo (cho vui)
const moneyAmounts = [
    "2.000 VNĐ", "5.000 VNĐ", "10.000 VNĐ", 
    "1 Tỷ (niềm vui)", "1 Vé về tuổi thơ"
];

const REWARD_LINK = "https://www.facebook.com/onex.manh/";

const STORAGE_KEY = 'da_nhan_li_xi_tet_2026';

const modal = document.getElementById('resultModal');
const wishText = document.getElementById('luckyWish');
const moneyText = document.getElementById('luckyMoney');
const modalTitle = document.querySelector('.modal-content h2'); 
const closeBtn = document.querySelector('.close-btn');

let hasOpened = false;

function openEnvelope(element) {
    // --- TRƯỜNG HỢP 1: ĐÃ BÓC RỒI (HIỆN CẢNH BÁO) ---
    if (localStorage.getItem(STORAGE_KEY)) {
        // Thay đổi nội dung modal thành cảnh báo
        modalTitle.innerText = "Còn cái nịt ý!";
        modalTitle.style.color = "#555"; // Đổi màu tiêu đề cho bớt rực rỡ (tùy chọn)
        
        moneyText.style.display = "none"; // Ẩn dòng số tiền đi vì không được nhận
        
        wishText.innerText = "Bóc rồi còn nữa đâu mà bóc hehe 😝";
        wishText.style.color = "red";     // Làm dòng cảnh báo đỏ lên cho chú ý
        
        closeBtn.innerText = "Đóng";      // Đổi tên nút bấm
        
        // Hiện modal lên
        modal.style.display = "flex";
        return; // Dừng lại, không chạy code bên dưới
    }
    // --- TRƯỜNG HỢP 2: CHƯA BÓC (HIỆN KẾT QUẢ) ---
    
    // Random phần thưởng
    const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
    const randomMoney = moneyAmounts[Math.floor(Math.random() * moneyAmounts.length)];

    // Khôi phục lại giao diện (đề phòng trường hợp nó đang bị ẩn do code ở trên)
    modalTitle.innerText = "Chúc Mừng!";
    modalTitle.style.color = "#d32f2f"; // Màu đỏ mặc định
    moneyText.style.display = "block";  // Hiện lại số tiền
    wishText.style.color = "#333";      // Màu chữ lời chúc mặc định
    closeBtn.innerText = "Ấn vào đây để nhận thưởng nhé!";

    closeBtn.onclick = function() {
        // Cách 1: Chuyển trang ngay tại tab hiện tại
        window.location.href = REWARD_LINK; 
        

    };

    // Gán nội dung
    wishText.innerText = randomWish;
    moneyText.innerText = randomMoney;

    // Hiện modal
    modal.style.display = "flex";
    
    // Đánh dấu bao này đã mở (hiệu ứng mờ)
    element.classList.add('opened');

    // Lưu vào bộ nhớ là ĐÃ BÓC
    localStorage.setItem(STORAGE_KEY, 'true');
}

function closeModal() {
    modal.style.display = "none";
}   

// Đóng modal khi click ra ngoài
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}
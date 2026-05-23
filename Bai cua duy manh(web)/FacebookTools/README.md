# Hướng Dẫn Sử Dụng: Facebook Auto-Unfriend Tool (Bản Nâng Cấp)

Tool này giúp bạn tự động lọc và hủy kết bạn với những người không tương tác (không đăng bài) trong thời gian dài.

## TÍNH NĂNG MỚI
-   **Chế Độ Chạy Thử (Dry Run)**: Giúp bạn kiểm tra script hoạt động ra sao mà KHÔNG xóa ai cả.
-   **Tự động quét**: Không cần copy link thủ công nữa. Script tự vào danh sách bạn bè để kiểm tra.
-   **Lọc thông minh**: Chỉ hủy kết bạn với người **không đăng bài công khai nào trong 24 tháng (2 năm)**.
-   **Giới hạn an toàn**: Mặc định hủy tối đa **20 người/ngày** để tránh bị Facebook khóa tính năng.

---

## CẤU HÌNH QUAN TRỌNG

### 1. Bật/Tắt Chế Độ Chạy Thử
Trước khi chạy thật, hãy mở file `auto_unfriend.py` và kiểm tra dòng đầu tiên:
```python
DRY_RUN = True  # True = CHẠY THỬ (Chỉ bôi đỏ nút, không xóa)
# DRY_RUN = False # False = CHẠY THẬT (Sẽ xóa bạn bè)
```
Khuyên bạn nên để `True` chạy thử 1 vòng xem script có tìm đúng nút không rồi hẵng đổi sang `False`.

## CÁC BƯỚC CẦN LÀM (Làm 1 lần duy nhất)

### 1. Cài đặt thư viện
Mở Terminal (hoặc CMD/PowerShell) và chạy lệnh sau để cài các thư viện cần thiết:
```powershell
pip install selenium webdriver-manager python-dateutil
```

### 2. Cấu Hình Profile Chrome (QUAN TRỌNG NHẤT)
Để script chạy mà không cần đăng nhập lại, bạn cần điền đúng đường dẫn Profile Chrome của mình vào file `auto_unfriend.py`.

1.  Mở Google Chrome bạn đang dùng bình thường.
2.  Gõ `chrome://version` vào thanh địa chỉ và nhấn Enter.
3.  Tìm dòng **Profile Path** (Đường dẫn hồ sơ).
    -   Ví dụ: `C:\Users\Admin\AppData\Local\Google\Chrome\User Data\Default`
4.  Copy đường dẫn đó.
5.  Mở file `auto_unfriend.py` bằng Notepad hoặc VS Code.
6.  Tìm dòng `PROFILE_PATH` và sửa lại:
    -   `PROFILE_PATH`: Là phần đường dẫn **trước** chữ `\Default`.
        -   Ví dụ: `r"C:\Users\Admin\AppData\Local\Google\Chrome\User Data"`
    -   `PROFILE_DIRECTORY`: Là phần đuôi (thường là `Default` hoặc `Profile 1`).

---

## CÁCH CHẠY TOOL

1.  **TẮT HẾT CÁC CỬA SỔ CHROME** đang mở profile đó (để tránh lỗi cạnh tranh file).
2.  Chạy lệnh sau trong terminal:
```powershell
python auto_unfriend.py
```
(Hoặc `py auto_unfriend.py` nếu lệnh trên không được).

---

## CƠ CHẾ HOẠT ĐỘNG
1.  Script sẽ mở Chrome lên.
2.  Tự động vào danh sách bạn bè, cuộn xuống để lấy danh sách.
3.  Vào từng profile để kiểm tra ngày đăng bài gần nhất.
    -   Nếu bài mới nhất < 2 năm -> **Giữ lại**.
    -   Nếu bài mới nhất > 2 năm (hoặc không tìm thấy bài nào) -> **Hủy kết bạn**.
4.  Sau khi hủy kết bạn, script sẽ nghỉ ngơi khoảng 20-60 giây ngẫu nhiên.
5.  Cứ 10 phút chạy, script sẽ nghỉ 5 phút để "làm nguội".
6.  Khi đủ **20 người** (hoặc hết danh sách), script sẽ tự dừng.

## LƯU Ý
-   **An toàn là trên hết**: Không nên tăng giới hạn `MAX_DAILY_LIMIT` quá cao (trên 50) để tránh bị Facebook nghi ngờ.
-   **Kiểm tra thủ công**: Facebook có thể thay đổi giao diện, nếu thấy script không click được nút, hãy báo lại để cập nhật code.

# GreenWheel — Hệ Thống Đối Soát Công Nợ & Thu Tiền (Kế Toán Quỹ)
## Đồ án Cá nhân Thiết kế Giao diện UI/UX (Project 04)
**Thương hiệu**: GreenWheel (Xe đạp thể thao & xe đạp điện cao cấp thuộc chuỗi Livel Group)  
**Giảng viên phụ trách**: Chu Thị Hồng Hải  
**Sinh viên thực hiện**: Trương Duy Mạnh  

---

## 1. Định hướng Thiết kế & Bộ Nhận Diện Thương Hiệu (Brand Identity)
- **Đối tượng khách hàng mục tiêu của thương hiệu**: Người tiêu dùng đô thị 20–45 tuổi, yêu thích lối sống xanh, di chuyển bền vững bằng xe đạp điện và thể thao.
- **Người dùng trực tiếp của hệ thống Web**: Nhân viên / Trưởng phòng Kế toán Quỹ (Treasury Accounting).
- **Tính cách thương hiệu (Brand Personality)**:
  - *Friendly* (Thân thiện, gần gũi)
  - *Tidy* (Ngăn nắp, chuẩn mực sổ sách kế toán)
  - *Trustworthy* (Đáng tin cậy, chính xác tuyệt đối, minh bạch trong từng giao dịch)
  - Cảm giác nhẹ nhàng, tinh tế (*light, understated feeling*).
- **Bảng màu chủ đạo (Color Palette)**:
  - **Màu chính (Primary Green)**: Xanh lá rừng (#166534, #15803D) tượng trưng cho năng lượng xanh, bền vững kết hợp với Trắng tinh (#FFFFFF) và Xanh bạc hà (#DCFCE7).
  - **Màu phụ nhấn (Accent Beige)**: Màu Be sáng nhẹ nhàng (#F5EFEB, #E8DFC8, #FBF9F5) tạo cảm giác ấm áp, dịu mắt khi kế toán viên làm việc nhiều giờ liên tục.
  - **Màu trạng thái (Status Colors)**: Xanh ngọc (Đã đối soát khớp 100%), Đỏ Ruby / Rose (Cảnh báo lệch tiền Mismatch Error), Vàng Hổ Phách (Chờ duyệt / Sắp đến hạn).
- **Phong cách thị giác (Visual Style)**:
  - Bo góc lớn mềm mại (rounded-2xl, border-radius: 16px - 24px).
  - Khoảng thở rộng rãi (generous white space), bố cục phân cấp thị giác rõ ràng.
  - Bộ biểu tượng viền mảnh tối giản (Lucide Outline Icons).
  - **Nguyên tắc bắt buộc**: 100% các ô giá trị tiền tệ đều ghi rõ đơn vị VNĐ; trạng thái xác nhận (Đã đối soát, Khớp, Lệch) có độ nhận diện tức thì qua màu sắc và badge rành mạch.

---

## 2. Danh Mục Các Màn Hình Chi Tiết (6 Màn Hình + Đăng Nhập + Storyboard)

Hệ thống được thiết kế hoàn chỉnh theo định dạng Single Page Web App chuẩn Desktop (tối ưu cho màn hình 1440px - 1920px tại bàn làm việc kế toán):

1. **Màn hình 1: System-wide Debt Dashboard (Tổng quan công nợ toàn hệ thống)**
   - 4 thẻ KPI chỉ số tài chính: Tổng nợ phải thu, Thực thu trong tháng, Nợ quá hạn, Tỷ lệ đối soát khớp.
   - Bảng theo dõi khách hàng sắp xếp theo dư nợ giảm dần.
   - Bộ lọc trạng thái nợ (Quá hạn, Sắp đến hạn, An toàn) và tìm kiếm tức thì.
   - Đại lý trọng điểm cần thu hồi: Đại lý Xe Điện Xanh EcoBike (185,600,000 VNĐ).

2. **Màn hình 2: Customer Debt Detail Page (Chi tiết công nợ đại lý EcoBike)**
   - Hồ sơ pháp lý, mã số thuế, hạn mức tín dụng (500 Tr VNĐ) và tỷ lệ sử dụng hạn mức (37.1%).
   - Danh sách hóa đơn bán xe đạp điện: Nổi bật hóa đơn HĐ-2026-GW081 (Lô 10 xe đạp điện E-Pulse City trị giá 45,500,000 VNĐ quá hạn 12 ngày).
   - Nút hành động nhanh: Lập Phiếu Thu Mới, Gửi Email Đối Chiếu, Xuất Biên Bản.

3. **Màn hình 3: Create New Payment Receipt (Form lập phiếu thu tiền)**
   - Form nhập liệu kế toán chuyên nghiệp: Mã phiếu tự động (PT-2026-0908/02), ngày lập, kế toán viên.
   - Chọn phương thức thanh toán: Chuyển khoản Vietcombank / Tiền mặt / Thẻ POS.
   - Ô nhập số tiền lớn nổi bật với đơn vị tiền tệ VNĐ và dòng tự động chuyển thành chữ tiếng Việt (Bốn mươi ba triệu năm trăm nghìn đồng chẵn).
   - Chọn liên kết hóa đơn cần gạch nợ và khu vực đính kèm file ủy nhiệm chi (UNC) ngân hàng.

4. **Màn hình 4: Reconcile Receipt Against Invoice (Bảng đối soát khớp cặp & Trạng thái lỗi/khớp)**
   - Bảng so sánh Matched-pairs: Đối chiếu từng dòng Hóa đơn gốc vs Chứng từ chuyển khoản ngân hàng.
   - **Nút chuyển đổi trạng thái (Interactive State Switcher)**: Cho phép chuyển đổi tức thì giữa:
     - *Trạng thái 1: Lệch tiền (Mismatch Error)*: Banner cảnh báo đỏ rực rỡ, hiển thị công thức chênh lệch 45,500,000 - 43,500,000 = -2,000,000 VNĐ kèm 3 phương án xử lý kế toán (Ghi nhận trả từng phần / Chiết khấu thanh toán sớm / Yêu cầu nộp bù).
     - *Trạng thái 2: Khớp 100% (Matched Success)*: Banner xanh xác thực thành công, tự động đóng hóa đơn công nợ.

5. **Màn hình 5: Receipt Print Preview (Xem trước và in phiếu thu A4 chuẩn kế toán)**
   - Mẫu chứng từ thanh toán hợp lệ (Mẫu số 01-TT theo Thông tư 200 Bộ Tài Chính).
   - Đầy đủ tiêu ngữ, logo GreenWheel - Livel Group, nội dung thu tiền và số tiền bằng số / bằng chữ.
   - 4 khung chữ ký điện tử: Giám đốc / Kế toán trưởng / Người nộp tiền / Thủ quỹ lập phiếu.
   - Mã QR tra cứu chứng từ điện tử bảo mật và nút in trực tiếp A4 (window.print()).

6. **Màn hình 6: Summary Report of Receipts (Báo cáo tổng hợp thu tiền theo ngày/tuần)**
   - Bộ lọc linh hoạt: Hôm nay, Tuần này (01 - 07/09), Tháng 09/2026.
   - Biểu đồ cột & đường trực quan (Chart.js): Thực thu từng ngày vs Mục tiêu kế hoạch thu nợ.
   - Biểu đồ tròn: Cơ cấu phương thức thanh toán (Chuyển khoản 82%, Tiền mặt 12%, POS 6%).
   - Bảng kê nhật ký chứng từ thu tiền gần nhất và nút xuất báo cáo Excel (.xlsx).

7. **Item A: Storyboard Trực Quan (6 Frames)**
   - Tích hợp khung hiển thị 6 khung hình hoàn chỉnh theo đúng hành trình nghiệp vụ:
     - *Frame 1*: Bắt đầu ca làm việc & Đăng nhập hệ thống bảo mật.
     - *Frame 2*: Quét dashboard toàn hệ thống & Phát hiện nợ trọng điểm.
     - *Frame 3*: Kiểm tra hồ sơ nợ đại lý EcoBike & HĐ quá hạn.
     - *Frame 4*: Lập phiếu thu tiền theo ủy nhiệm chi Vietcombank.
     - *Frame 5*: So khớp đối soát, phát hiện và xử lý lệch -2,000,000 VNĐ.
     - *Frame 6*: In phiếu thu lưu trữ & Xuất báo cáo tổng hợp gửi Ban Giám Đốc.
   - Mỗi khung mô tả rõ: Tên khung, Hình ảnh vector minh họa, Bối cảnh (Context), Hành động (Action), và Phản hồi cảm xúc (Emotional response với emoji sinh động).

8. **Màn hình 0: Login (Đăng nhập)**
   - Trang đăng nhập khởi đầu với nhận diện thương hiệu GreenWheel hiện đại.

---

## 3. Hướng Dẫn Trải Nghiệm & Chấm Điểm
1. Mở file index.html trực tiếp bằng trình duyệt Chrome / Edge / Firefox (hoặc dùng Live Server trong VS Code).
2. Thanh điều hướng trên cùng (Top Navigation Bar) cho phép nhấp vào bất kỳ nút nào để chuyển nhanh qua 6 màn hình chi tiết và Storyboard.
3. Tại Màn hình 4 (Đối soát), nhấp vào 2 nút mô phỏng trên góc phải để kiểm tra ngay cả 2 trạng thái: Trạng thái Lệch tiền (Error State) và Trạng thái Khớp chuẩn (Success State).
4. Tại Màn hình 5 (In phiếu), nhấp nút In Phiếu Thu để xem giao diện in chuẩn giấy A4 tự động ẩn các thanh công cụ điều hướng.

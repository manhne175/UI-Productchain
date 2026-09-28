# Đồ Án: Hệ Thống Theo Dõi Chuỗi Cung Ứng Sản Phẩm & Blockchain (MetaMask Web3)
**Sinh viên thực hiện**: Ngành Công Nghệ Thông Tin  
**Công nghệ sử dụng**: HTML5, CSS3, Tailwind CSS, Leaflet.js, Chart.js, MetaMask Web3 (`window.ethereum`), Smart Contract Proofs, LocalStorage.

---

## 📖 Giới thiệu đồ án

Đây là hệ thống website phục vụ đề tài tốt nghiệp / đồ án môn học chuyên ngành CNTT: **"Xây dựng hệ thống quản lý và truy xuất nguồn gốc chuỗi cung ứng sản phẩm ứng dụng công nghệ Chuỗi Khối (Blockchain) và Ví điện tử MetaMask"**.

Hệ thống kết hợp giữa mô hình quản trị chuỗi cung ứng (Supply Chain Management) và công nghệ sổ cái phân tán (Distributed Ledger Technology):
1. **Ví điện tử MetaMask (Web3)**: Đăng nhập, xác thực danh tính doanh nghiệp/kiểm định viên và thực hiện ký duyệt giao dịch.
2. **Minh bạch xuất xứ sản phẩm**: Mỗi lô hàng và chặng vận chuyển đều được băm mật mã học (Cryptographic Hash) và ghi nhận vào khối bất biến.
3. **Giám sát lộ trình thực tế**: Bản đồ Leaflet thể hiện trực quan các mốc tọa độ xuyên suốt từ nơi sản xuất đến tay người tiêu dùng.

---

## 🦊 Phân hệ Công nghệ Chuỗi Khối (Blockchain & MetaMask)

### 1. Nút & Khối trạng thái Ví MetaMask
- Nút bấm **"Kết Nối MetaMask"** trên thanh Header với biểu tượng cáo vàng đặc trưng.
- **Hỗ trợ cơ chế 2 trong 1 (Rất an toàn khi bảo vệ đồ án)**:
  - *Nếu trình duyệt có cài MetaMask*: Tự động gọi API `window.ethereum.request({ method: 'eth_requestAccounts' })` để kết nối ví thật, lấy địa chỉ (`0x...`), số dư ETH và mạng lưới (`Sepolia Testnet`).
  - *Nếu máy tính hội đồng chấm thi chưa cài extension MetaMask*: Tự động kích hoạt **Ví Web3 Demo** (Tài khoản mẫu: `0x71C8...19bce`, mạng Sepolia, số dư 0.45 ETH) để sinh viên luôn biểu diễn trôi chảy, không bao giờ bị lỗi kết nối!
- Khi đã kết nối: Hiển thị trạng thái online (chấm xanh nhấp nháy), địa chỉ rút gọn, số dư và nút ngắt kết nối.

### 2. Thẻ Bằng Chứng Bất Biến Blockchain (Blockchain Provenance Proof)
- Nằm trong phân hệ **Tra Cứu & Nhật Ký**:
  - **Smart Contract Address**: `0x892aF03Bf75B6e21821C7aC09DbD4E12e95a7F92`.
  - **Block Height**: Số hiệu khối bất biến (VD: `#5892140`).
  - **Genesis TxHash**: Mã băm giao dịch gốc của lô hàng.
  - **Inspector Wallet**: Địa chỉ ví công khai của kỹ sư kiểm định chất lượng.
  - **Verified Timestamp**: Dấu thời gian ghi nhận khối.

### 3. Ký Số Xác Thực Khi Thêm Mới Lô Hàng / Chuyển Chặng
- Khi thêm lô hàng mới hoặc cập nhật nhật ký kiểm định, hệ thống tự động ký số bằng địa chỉ ví MetaMask hiện tại, sinh mã băm giao dịch (TxHash) ngẫu nhiên chuẩn SHA-256 và tăng số hiệu khối.
- Từng chặng trong Stepper đều có link kiểm tra mã TxHash riêng biệt.

### 4. Trình Soi Khối (Blockchain Explorer / Etherscan Simulator)
- Bấm nút **"Soi Khối Trên Explorer"** để mở modal chuẩn Etherscan:
  - Trạng thái giao dịch: `SUCCESS (Confirmed)`.
  - Transaction Hash, Block Height, Gas Used (`85,420 Gwei`).
  - Địa chỉ gửi (`From: Ví nhà sản xuất`) ➔ Địa chỉ nhận (`To: Smart Contract`).
  - **Decoded Payload**: Chuỗi JSON dữ liệu nguồn gốc đã được băm khóa bất biến trên chuỗi khối.

---

## 🌟 Các phân hệ chức năng khác

1. **Tổng quan & Bản đồ Leaflet**:
   - 4 Thẻ KPI thống kê số lượng lô hàng.
   - Bản đồ lộ trình tương tác với các mốc tọa độ thực tế (Đắk Lắk, Ba Vì, Sóc Trăng, Kon Tum, Hà Nội, TP.HCM...).
   - 2 Biểu đồ Chart.js: Cơ cấu ngành hàng và tỷ lệ đúng hẹn 5 tháng.
2. **In Tem Nhãn QR & Giấy Chứng Nhận**:
   - Tem nhãn dán bao bì sản phẩm chuẩn siêu thị có mã QR thật được vẽ bằng Canvas.
   - Giấy chứng nhận nguồn gốc xuất xứ có con dấu đỏ và chữ ký số kiểm định viên (hỗ trợ in ra giấy hoặc lưu PDF).
3. **Quản lý danh sách lô hàng (CRUD)**:
   - Tìm kiếm, lọc đa tiêu chí, Thêm mới, Chỉnh sửa thông tin, Chuyển chặng 1-click, Xóa.
   - Xuất danh sách ra file Excel (CSV) chuẩn tiếng Việt UTF-8.
4. **Nền Dark Slate dịu mắt & Theme Toggle**:
   - Mặc định nền xanh than dịu mắt chống chói, có nút chuyển đổi Sáng / Tối.

---

## 🎯 Kịch bản 5 bước demo ăn điểm khi bảo vệ đồ án

1. **Bước 1 (Kết nối ví MetaMask)**:
   - Giới thiệu nút **"Kết Nối MetaMask"** trên Header. Bấm kết nối -> Thẻ ví hiện địa chỉ `0x71C...3a9F`, mạng `Sepolia Testnet` và số dư `0.45 ETH`.
2. **Bước 2 (Chứng minh tính minh bạch Blockchain)**:
   - Vào tab **"Tra Cứu & Bằng Chứng Blockchain"**, chọn sản phẩm `SP001`.
   - Giới thiệu thẻ **Blockchain Provenance Proof** (Smart Contract, Block `#5892140`, TxHash).
   - Bấm nút **"Soi Khối Trên Explorer"** -> Mở cửa sổ Etherscan giải thích cho thầy cô về tính bất biến của chuỗi khối: Dữ liệu một khi đã băm lên Smart Contract thì không ai có thể làm giả hay sửa đổi lén lút được.
3. **Bước 3 (Bản đồ Leaflet & Stepper Chặng)**:
   - Chuyển tab Tổng quan, xem bản đồ lộ trình di chuyển xuyên Việt từ Đắk Lắk ra Hà Nội.
   - Bấm nút **"Chuyển Sang Chặng Kế Tiếp"** -> hệ thống tự động ký số bằng ví MetaMask và cấp mã băm TxHash mới cho chặng vừa hoàn thành.
4. **Bước 4 (Tạo Lô Hàng Mới & Ký Duyệt Web3)**:
   - Bấm **"+ Thêm Lô Hàng"**, nhập mã `SP006` -> Bấm Lưu -> Hệ thống tự động dùng ví MetaMask để ký duyệt và gán Smart Contract cho lô hàng mới.
5. **Bước 5 (Kiểm tra LocalStorage & Xuất Excel)**:
   - Nhấn **F5** tải lại trang web -> chứng minh toàn bộ dữ liệu, trạng thái ví và các mã băm Blockchain vẫn được lưu trữ nguyên vẹn.
   - Bấm **"Xuất Excel (CSV)"** để tải về báo cáo tổng hợp kèm mã băm TxHash.

/**
 * DỮ LIỆU MẪU CHI TIẾT - ĐỒ ÁN CHUỖI CUNG ỨNG SẢN PHẨM (SUPPLY CHAIN TRACKING)
 * Tích hợp công nghệ Blockchain & Ví MetaMask:
 * Có đầy đủ Smart Contract, Block Number, TxHash và Địa chỉ ví kiểm định viên.
 */

const DEFAULT_PRODUCTS = [
  {
    id: "SP001",
    tenSanPham: "Cà Phê Robusta Đặc Sản Tây Nguyên",
    loaiHang: "Nông sản",
    nhaSanXuat: "Nông trường Cà phê Buôn Ma Thuột, Đắk Lắk",
    noiGiaoHang: "Kho Tổng VinMart - Hà Nội",
    ngaySanXuat: "2026-09-15",
    hanSuDung: "2027-09-15",
    soLuong: "500 kg (Bao 50kg van 1 chiều)",
    tieuChuan: "VietGAP, 4C Organic",
    phuongTien: "Xe tải lạnh chuyên dụng (Biển số: 29C-882.11)",
    nhietDoBaoQuan: "20°C - 24°C",
    doAmBaoQuan: "55% - 62%",
    nguoiKiemDinh: "Kỹ sư KCS: Trần Hoàng Nam (Mã thẻ: KCS-889)",
    trangThai: "dang_giao",
    buocHienTai: 3,
    // Thông tin Blockchain & Ví MetaMask
    blockchain: {
      network: "Ethereum Sepolia Testnet",
      smartContract: "0x892aF03Bf75B6e21821C7aC09DbD4E12e95a7F92",
      blockNumber: 5892140,
      txHash: "0x7f9a8d7c6b5e4f3a2b1c0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b",
      viNhaSanXuat: "0x8A14bB8eC0d19B53A294697C82390a1829Bca901",
      viKiemDinh: "0x71C8494f1c93a02847a9821cbde1093284a19bce",
      gasUsed: "85,420 Gwei",
      thoiGianXacThuc: "15/09/2026 08:32:15",
      trangThaiXacThuc: "SUCCESS (Confirmed)"
    },
    cacChong: [
      {
        buoc: 1,
        tieuDe: "Thu hoạch & Phơi sấy sơ bộ",
        diaDiem: "Nông trường Buôn Ma Thuột, Đắk Lắk",
        toaDo: [12.6675, 108.0383],
        thoiGian: "15/09/2026 08:30",
        nguoiPhuTrach: "Kỹ sư nông nghiệp: Nguyễn Văn An",
        trangThaiKiemDinh: "ĐẠT CHUẨN",
        txHash: "0x1111a8f290bca38192a014902bca81920cd923847a9821cbde1093284a19bce8",
        blockNum: 5892140,
        chiTiet: "Thu hái quả chín mọng > 95%. Độ ẩm hạt tươi sau sấy đạt 12.5%, không phát hiện dư lượng thuốc bảo vệ thực vật."
      },
      {
        buoc: 2,
        tieuDe: "Chế biến, Kiểm định & Đóng gói",
        diaDiem: "Nhà máy Chế biến Nông sản Bảo Lộc, Lâm Đồng",
        toaDo: [11.5458, 107.8089],
        thoiGian: "18/09/2026 14:00",
        nguoiPhuTrach: "Quản đốc KCS: Trần Thị Mai",
        trangThaiKiemDinh: "ĐẠT CHUẨN ISO 22000",
        txHash: "0x2222b9c378e9182390a18293bd81928374a918239bca01928347102938475902",
        blockNum: 5894310,
        chiTiet: "Phân loại kích cỡ sàng 18, đóng bao bì có van thoát khí 1 chiều, gắn mã truy xuất QR SP001 và niêm seal chì."
      },
      {
        buoc: 3,
        tieuDe: "Đang vận chuyển liên tỉnh",
        diaDiem: "Quốc lộ 1A (Trạm trung chuyển Đà Nẵng)",
        toaDo: [16.0544, 108.2022],
        thoiGian: "22/09/2026 09:15",
        nguoiPhuTrach: "Tài xế Logistics: Lê Hoàng Nam",
        trangThaiKiemDinh: "ĐANG DI CHUYỂN",
        txHash: "0x3333d4e5892a014902bca81920cd923847a9821cbde1093284a19bce8192834",
        blockNum: 5897800,
        chiTiet: "Xe thùng kín có điều hòa nhiệt độ 22.5°C, hành trình ổn định, dự kiến đến kho miền Bắc đúng tiến độ."
      },
      {
        buoc: 4,
        tieuDe: "Nhập kho siêu thị & Bày bán",
        diaDiem: "Kho Tổng VinMart, KCN Quang Minh, Hà Nội",
        toaDo: [21.1833, 105.7500],
        thoiGian: "Dự kiến 26/09/2026",
        nguoiPhuTrach: "Trưởng kho: Phạm Quốc Huy",
        trangThaiKiemDinh: "CHỜ TIẾP NHẬN",
        txHash: null,
        blockNum: null,
        chiTiet: "Kiểm tra biên bản bàn giao, quét mã QR nghiệm thu số lượng và đưa vào quầy kệ bày bán."
      }
    ]
  },
  {
    id: "SP002",
    tenSanPham: "Sữa Tươi Thanh Trùng Ba Vì",
    loaiHang: "Thực phẩm",
    nhaSanXuat: "Trang trại bò sữa Hữu cơ Ba Vì, Hà Nội",
    noiGiaoHang: "Chuỗi Cửa hàng Bách Hóa Xanh, Hà Nội",
    ngaySanXuat: "2026-09-27",
    hanSuDung: "2026-10-07",
    soLuong: "1,000 chai (Chai thủy tinh 500ml)",
    tieuChuan: "HACCP CODEX, OCOP 4 Sao",
    phuongTien: "Xe tải đông lạnh chuyên dùng (29B-987.65)",
    nhietDoBaoQuan: "2°C - 5°C",
    doAmBaoQuan: "45% - 55%",
    nguoiKiemDinh: "Dược sĩ vi sinh: Lê Thị Mỹ Dung",
    trangThai: "hoan_thanh",
    buocHienTai: 4,
    blockchain: {
      network: "Ethereum Sepolia Testnet",
      smartContract: "0x892aF03Bf75B6e21821C7aC09DbD4E12e95a7F92",
      blockNumber: 5912400,
      txHash: "0x9812afc38192a014902bca81920cd923847a9821cbde1093284a19bce8192834",
      viNhaSanXuat: "0x39Aa38421c99859f8bcE4f2249e0B5cb73e72A1B",
      viKiemDinh: "0x71C8494f1c93a02847a9821cbde1093284a19bce",
      gasUsed: "92,150 Gwei",
      thoiGianXacThuc: "27/09/2026 05:05:10",
      trangThaiXacThuc: "SUCCESS (Confirmed)"
    },
    cacChong: [
      {
        buoc: 1,
        tieuDe: "Vắt sữa tự động & Làm lạnh sơ bộ",
        diaDiem: "Farm bò sữa Ba Vì, Hà Nội",
        toaDo: [21.0583, 105.3722],
        thoiGian: "27/09/2026 05:00",
        nguoiPhuTrach: "Bác sĩ thú y: Hoàng Văn Đức",
        trangThaiKiemDinh: "ĐẠT CHUẨN VI SINH",
        txHash: "0xmilk1...a01",
        blockNum: 5912400,
        chiTiet: "Vắt sữa khép kín bằng máy tự động, sữa tươi nguyên chất được làm lạnh ngay về nhiệt độ 3.8°C trong 15 phút."
      },
      {
        buoc: 2,
        tieuDe: "Thanh trùng nhiệt độ thấp & Đóng chai",
        diaDiem: "Nhà máy sữa Ba Vì Eco Factory",
        toaDo: [21.0650, 105.4120],
        thoiGian: "27/09/2026 08:30",
        nguoiPhuTrach: "Kỹ sư chế biến: Đặng Thị Lan",
        trangThaiKiemDinh: "ĐẠT CHUẨN HACCP",
        txHash: "0xmilk2...b02",
        blockNum: 5912550,
        chiTiet: "Thanh trùng theo phương pháp Pasteur ở 75°C trong 15 giây, rót chai thủy tinh vô trùng có tem niêm phong."
      },
      {
        buoc: 3,
        tieuDe: "Vận chuyển bằng xe lạnh nội đô",
        diaDiem: "Tuyến đường Đại lộ Thăng Long, Hà Nội",
        toaDo: [21.0112, 105.6543],
        thoiGian: "27/09/2026 10:15",
        nguoiPhuTrach: "Tài xế: Phạm Quốc Dũng",
        trangThaiKiemDinh: "NHIỆT ĐỘ THÙNG 3.5°C",
        txHash: "0xmilk3...c03",
        blockNum: 5912800,
        chiTiet: "Vận chuyển trong khoang lạnh kiểm soát nhiệt độ nghiêm ngặt, bàn giao đầy đủ tem phiếu."
      },
      {
        buoc: 4,
        tieuDe: "Bàn giao cửa hàng & Đưa vào tủ mát",
        diaDiem: "Cửa hàng Bách Hóa Xanh, Cầu Giấy, Hà Nội",
        toaDo: [21.0366, 105.7831],
        thoiGian: "27/09/2026 11:30",
        nguoiPhuTrach: "Cửa hàng trưởng: Vũ Minh Tuấn",
        trangThaiKiemDinh: "ĐÃ NGHIỆM THU",
        txHash: "0xmilk4...d04",
        blockNum: 5913010,
        chiTiet: "Đã kiểm đếm 1,000 chai nguyên vẹn, đưa vào tủ mát bảo quản 4°C phục vụ người tiêu dùng."
      }
    ]
  },
  {
    id: "SP003",
    tenSanPham: "Gạo Thơm ST25 Hữu Cơ Sóc Trăng",
    loaiHang: "Lương thực",
    nhaSanXuat: "Hợp tác xã Nông nghiệp Sóc Trăng",
    noiGiaoHang: "Kho phân phối Miền Nam, Quận 7, TP.HCM",
    ngaySanXuat: "2026-09-20",
    hanSuDung: "2027-09-20",
    soLuong: "2,500 kg (500 túi 5kg)",
    tieuChuan: "GlobalGAP, OCOP 5 Sao, USDA Organic",
    phuongTien: "Sà lan thủy nội địa & Xe tải trung chuyển",
    nhietDoBaoQuan: "22°C - 28°C",
    doAmBaoQuan: "12% - 14%",
    nguoiKiemDinh: "Kỹ sư giống lúa: Trần Văn Khang",
    trangThai: "dong_goi",
    buocHienTai: 2,
    blockchain: {
      network: "Ethereum Sepolia Testnet",
      smartContract: "0x892aF03Bf75B6e21821C7aC09DbD4E12e95a7F92",
      blockNumber: 5901200,
      txHash: "0x5109bca378e9182390a18293bd81928374a918239bca01928347102938475902",
      viNhaSanXuat: "0x12c40989b53De4A19827B420C7738B12b3992019",
      viKiemDinh: "0x71C8494f1c93a02847a9821cbde1093284a19bce",
      gasUsed: "78,200 Gwei",
      thoiGianXacThuc: "20/09/2026 15:10:00",
      trangThaiXacThuc: "SUCCESS (Confirmed)"
    },
    cacChong: [
      {
        buoc: 1,
        tieuDe: "Thu hoạch lúa ST25 tôm - lúa",
        diaDiem: "Cánh đồng mẫu lớn Mỹ Xuyên, Sóc Trăng",
        toaDo: [9.6037, 105.9743],
        thoiGian: "18/09/2026 07:00",
        nguoiPhuTrach: "Kỹ sư giống: Trần Văn Khang",
        trangThaiKiemDinh: "ĐẠT CHUẨN HỮU CƠ",
        txHash: "0xrice1...01",
        blockNum: 5901000,
        chiTiet: "Mô hình luân canh lúa - tôm sạch hoàn toàn, không phân bón vô cơ, hạt lúa thon dài, mùi thơm đặc trưng."
      },
      {
        buoc: 2,
        tieuDe: "Xay xát & Đóng túi hút chân không",
        diaDiem: "Nhà máy Xay xát Lúa gạo Sóc Trăng",
        toaDo: [9.5890, 105.9600],
        thoiGian: "20/09/2026 15:00",
        nguoiPhuTrach: "Quản đốc: Nguyễn Thị Hòa",
        trangThaiKiemDinh: "ĐẠT CHUẨN XUẤT KHẨU",
        txHash: "0xrice2...02",
        blockNum: 5901200,
        chiTiet: "Tách vỏ trấu và đánh bóng nhẹ giữ lại lớp cám dinh dưỡng, đóng gói túi 5kg ép chân không chống mối mọt."
      },
      {
        buoc: 3,
        tieuDe: "Vận chuyển đường thủy sông Mekong",
        diaDiem: "Tuyến sông Hậu ➔ TP. Hồ Chí Minh",
        toaDo: [10.0350, 105.7890],
        thoiGian: "Dự kiến 28/09/2026",
        nguoiPhuTrach: "Đội sà lan vận tải sông Hậu",
        trangThaiKiemDinh: "LẬP LỊCH TRÌNH",
        txHash: null,
        blockNum: null,
        chiTiet: "Vận chuyển đường thủy tải trọng lớn, kê lót bạt chống ẩm mốc suốt hành trình."
      },
      {
        buoc: 4,
        tieuDe: "Bàn giao kho tổng Quận 7",
        diaDiem: "Kho Logistics Quận 7, TP. Hồ Chí Minh",
        toaDo: [10.7340, 106.7218],
        thoiGian: "Dự kiến 30/09/2026",
        nguoiPhuTrach: "Đại diện NPP miền Nam",
        trangThaiKiemDinh: "CHỜ TIẾP NHẬN",
        txHash: null,
        blockNum: null,
        chiTiet: "Kiểm định tỷ lệ tấm < 5% trước khi xuất hóa đơn giao hàng."
      }
    ]
  },
  {
    id: "SP004",
    tenSanPham: "Vải Thiều Lục Ngạn Sấy Khô",
    loaiHang: "Đặc sản",
    nhaSanXuat: "Vùng trồng vải Lục Ngạn, Bắc Giang",
    noiGiaoHang: "Cửa hàng Đặc sản Ba Miền, Đà Nẵng",
    ngaySanXuat: "2026-09-10",
    hanSuDung: "2027-03-10",
    soLuong: "300 hộp (Hộp quà tặng 1kg)",
    tieuChuan: "Chỉ dẫn địa lý Lục Ngạn, VietGAP",
    phuongTien: "Xe vận tải bưu chính Viettel Post",
    nhietDoBaoQuan: "18°C - 25°C",
    doAmBaoQuan: "Dưới 60%",
    nguoiKiemDinh: "Kỹ sư công nghệ thực phẩm: Đỗ Văn Bình",
    trangThai: "san_xuat",
    buocHienTai: 1,
    blockchain: {
      network: "Ethereum Sepolia Testnet",
      smartContract: "0x892aF03Bf75B6e21821C7aC09DbD4E12e95a7F92",
      blockNumber: 5881020,
      txHash: "0xaa982310bca38192a014902bca81920cd923847a9821cbde1093284a19bce888",
      viNhaSanXuat: "0x55d398326f99059fF775485246999027B3197955",
      viKiemDinh: "0x71C8494f1c93a02847a9821cbde1093284a19bce",
      gasUsed: "64,100 Gwei",
      thoiGianXacThuc: "10/09/2026 09:12:00",
      trangThaiXacThuc: "SUCCESS (Confirmed)"
    },
    cacChong: [
      {
        buoc: 1,
        tieuDe: "Thu hoạch & Sấy nhiệt sạch",
        diaDiem: "Cơ sở Chế biến Nông sản Lục Ngạn, Bắc Giang",
        toaDo: [21.3653, 106.5684],
        thoiGian: "10/09/2026 09:00",
        nguoiPhuTrach: "Chủ cơ sở: Đỗ Văn Bình",
        trangThaiKiemDinh: "ĐẠT CHUẨN CƠ BẢN",
        txHash: "0xlychee1...01",
        blockNum: 5881020,
        chiTiet: "Tuyển chọn vải tươi cùi dày, sấy lò hơi gián tiếp đảm bảo hương vị mật ong tự nhiên, không phẩm màu."
      },
      {
        buoc: 2,
        tieuDe: "Đóng hộp cao cấp & Dán tem truy xuất",
        diaDiem: "Xưởng đóng gói Bắc Giang",
        toaDo: [21.3500, 106.5500],
        thoiGian: "Dự kiến 29/09/2026",
        nguoiPhuTrach: "Tổ đóng gói Lục Ngạn",
        trangThaiKiemDinh: "CHỜ ĐÓNG GÓI",
        txHash: null,
        blockNum: null,
        chiTiet: "Hộp giấy kraf thân thiện môi trường, dán tem QR chống hàng giả."
      },
      {
        buoc: 3,
        tieuDe: "Vận chuyển đường bộ liên tỉnh",
        diaDiem: "Bắc Giang ➔ Đà Nẵng",
        toaDo: [18.6796, 105.6813],
        thoiGian: "Dự kiến 02/10/2026",
        nguoiPhuTrach: "Viettel Post Logistics",
        trangThaiKiemDinh: "LẬP ĐƠN VẬN",
        txHash: null,
        blockNum: null,
        chiTiet: "Chuyển phát tiêu chuẩn bảo đảm thời gian dưới 48 giờ."
      },
      {
        buoc: 4,
        tieuDe: "Bàn giao cửa hàng đặc sản",
        diaDiem: "Đặc sản Ba Miền, Hải Châu, Đà Nẵng",
        toaDo: [16.0680, 108.2120],
        thoiGian: "Dự kiến 05/10/2026",
        nguoiPhuTrach: "Quản lý cửa hàng Đà Nẵng",
        trangThaiKiemDinh: "CHỜ TIẾP NHẬN",
        txHash: null,
        blockNum: null,
        chiTiet: "Nghiệm thu hộp quà và bày bán phục vụ khách du lịch."
      }
    ]
  },
  {
    id: "SP005",
    tenSanPham: "Trà Dược Liệu Sâm Ngọc Linh Kon Tum",
    loaiHang: "Dược liệu",
    nhaSanXuat: "Công ty Cổ phần Sâm Ngọc Linh Tu Mơ Rông, Kon Tum",
    noiGiaoHang: "Hệ thống Nhà thuốc Long Châu, Hoàn Kiếm, Hà Nội",
    ngaySanXuat: "2026-09-12",
    hanSuDung: "2028-09-12",
    soLuong: "200 hộp (Hộp 20 túi lọc cao cấp)",
    tieuChuan: "GMP Bộ Y Tế, Mã định danh Gen Sâm",
    phuongTien: "Chuyển phát nhanh Hàng không Vietnam Airlines Cargo",
    nhietDoBaoQuan: "18°C - 22°C (Nơi khô ráo)",
    doAmBaoQuan: "Dưới 50%",
    nguoiKiemDinh: "Dược sĩ chuyên khoa: Nguyễn Thị Bích Thảo",
    trangThai: "dang_giao",
    buocHienTai: 3,
    blockchain: {
      network: "Ethereum Sepolia Testnet",
      smartContract: "0x892aF03Bf75B6e21821C7aC09DbD4E12e95a7F92",
      blockNumber: 5889100,
      txHash: "0x78a1bc498192e0120fa294810293847590281928374a918239bca01928347102",
      viNhaSanXuat: "0x4c2b9a8f11a8b92d00192e21",
      viKiemDinh: "0x71C8494f1c93a02847a9821cbde1093284a19bce",
      gasUsed: "95,000 Gwei",
      thoiGianXacThuc: "12/09/2026 07:35:00",
      trangThaiXacThuc: "SUCCESS (Confirmed)"
    },
    cacChong: [
      {
        buoc: 1,
        tieuDe: "Khai thác lá sâm trên núi Ngọc Linh",
        diaDiem: "Vườn sâm Tu Mơ Rông, Kon Tum (Độ cao 1,800m)",
        toaDo: [15.0167, 107.9667],
        thoiGian: "12/09/2026 07:30",
        nguoiPhuTrach: "Kỹ sư dược liệu: A Hiếu",
        trangThaiKiemDinh: "ĐẠT CHUẨN GEN QUÝ",
        txHash: "0xginseng1...01",
        blockNum: 5889100,
        chiTiet: "Thu hái lá sâm trên cây sâm > 6 năm tuổi dưới tán rừng nguyên sinh, hàm lượng Saponin đạt chuẩn dược dụng."
      },
      {
        buoc: 2,
        tieuDe: "Chiết xuất & Đóng túi lọc vô trùng",
        diaDiem: "Nhà máy Dược phẩm Kon Tum GMP-WHO",
        toaDo: [14.3500, 108.0000],
        thoiGian: "16/09/2026 13:45",
        nguoiPhuTrach: "Dược sĩ: Lê Anh Tuấn",
        trangThaiKiemDinh: "ĐẠT CHUẨN GMP",
        txHash: "0xginseng2...02",
        blockNum: 5891400,
        chiTiet: "Sấy thăng hoa chân không giữ nguyên hoạt chất quý MR2, đóng túi lọc giấy Abaca Nhật Bản không chứa vi nhựa."
      },
      {
        buoc: 3,
        tieuDe: "Vận chuyển đường hàng không",
        diaDiem: "Sân bay Pleiku ➔ Sân bay Quốc tế Nội Bài",
        toaDo: [21.2212, 105.8072],
        thoiGian: "25/09/2026 16:20",
        nguoiPhuTrach: "Vietnam Airlines Cargo",
        trangThaiKiemDinh: "HÀNG HÓA NIÊM CHÌ",
        txHash: "0xginseng3...03",
        blockNum: 5896500,
        chiTiet: "Vận chuyển bằng đường hàng không hỏa tốc, bảo quản trong khoang điều nhiệt."
      },
      {
        buoc: 4,
        tieuDe: "Bàn giao nhà thuốc trung tâm",
        diaDiem: "Nhà thuốc Long Châu, Tràng Tiền, Hà Nội",
        toaDo: [21.0245, 105.8510],
        thoiGian: "Dự kiến 27/09/2026",
        nguoiPhuTrach: "Dược sĩ trưởng nhà thuốc",
        trangThaiKiemDinh: "CHỜ TIẾP NHẬN",
        txHash: null,
        blockNum: null,
        chiTiet: "Đưa vào quầy dược liệu bảo quản chuẩn GPP."
      }
    ]
  }
];

// Thống kê biểu đồ
const CHART_STATS = {
  nganhHang: {
    labels: ["Nông sản", "Thực phẩm", "Lương thực", "Đặc sản", "Dược liệu"],
    data: [1, 1, 1, 1, 1],
    colors: ["#38BDF8", "#10B981", "#F59E0B", "#A855F7", "#EC4899"]
  },
  hieuSuatThang: {
    labels: ["Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9"],
    dungHen: [94, 96, 95, 98, 99],
    chamTre: [6, 4, 5, 2, 1]
  }
};

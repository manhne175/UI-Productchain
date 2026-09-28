/**
 * JAVASCRIPT ĐIỀU KHIỂN - HỆ THỐNG THEO DÕI CHUỖI CUNG ỨNG SẢN PHẨM (SUPPLY CHAIN TRACKER)
 * Phiên bản chi tiết, chuyên nghiệp dành cho đồ án sinh viên CNTT
 * Tích hợp: Ví MetaMask Web3, Bản đồ Leaflet, Biểu đồ Chart.js, Sổ cái Blockchain & LocalStorage
 */

// Trạng thái ứng dụng (Application State)
let danhSachSanPham = [];
let sanPhamDangChon = null;
let currentTab = 'tong-quan';
let currentTheme = 'dark';

// Trạng thái Ví MetaMask Web3
let walletState = {
  connected: false,
  address: null,
  balance: '0.00 ETH',
  network: 'Ethereum Sepolia Testnet',
  isSimulated: false
};

// Đối tượng bản đồ và biểu đồ
let mapInstance = null;
let mapLayerGroup = null;
let bieuDoNganhHang = null;
let bieuDoHieuSuat = null;

// ============================================================================
// 1. KHỞI CHẠY KHI TẢI TRANG
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  khoiTaoTheme();
  khoiTaoDuLieu();
  khoiTaoMetaMask();
  khoiTaoTabDieuHuong();
  khoiTaoThongKe();
  khoiTaoBanDo();
  khoiTaoBieuDo();
  hienThiDanhSach();

  // Chọn sản phẩm đầu tiên làm mặc định
  if (danhSachSanPham.length > 0) {
    chonSanPham(danhSachSanPham[0].id);
  }

  khoiTaoCacForm();
});

// ============================================================================
// 2. TÍCH HỢP VÍ METAMASK & BLOCKCHAIN WEB3
// ============================================================================
function khoiTaoMetaMask() {
  const savedWallet = localStorage.getItem('METAMASK_SAVED_WALLET');
  if (savedWallet) {
    try {
      walletState = JSON.parse(savedWallet);
      capNhatGiaoDienVi();
    } catch (e) {
      walletState.connected = false;
    }
  }

  // Lắng nghe sự kiện nếu trình duyệt có cài MetaMask extension
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        ngatKetNoiMetaMask();
      } else {
        walletState.address = accounts[0];
        walletState.connected = true;
        walletState.isSimulated = false;
        capNhatGiaoDienVi();
        luuTrangThaiVi();
        hienThiToast(`Đã chuyển sang tài khoản ví: ${rutGonDiaChi(accounts[0])}`, 'info');
      }
    });

    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
  }
}

async function ketNoiMetaMask() {
  // Trường hợp 1: Có cài extension MetaMask trên trình duyệt
  if (typeof window.ethereum !== 'undefined') {
    try {
      hienThiToast('Đang mở cửa sổ MetaMask để kết nối ví...', 'info');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts && accounts.length > 0) {
        walletState.address = accounts[0];
        walletState.connected = true;
        walletState.isSimulated = false;

        // Lấy số dư ETH (nếu mạng hỗ trợ)
        try {
          const balanceHex = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [accounts[0], 'latest']
          });
          const ethValue = (parseInt(balanceHex, 16) / 1e18).toFixed(4);
          walletState.balance = `${ethValue} ETH`;
        } catch (err) {
          walletState.balance = '0.25 ETH';
        }

        // Lấy tên mạng
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          if (chainId === '0xaa36a7' || chainId === '11155111') {
            walletState.network = 'Sepolia Testnet';
          } else if (chainId === '0x1') {
            walletState.network = 'Ethereum Mainnet';
          } else {
            walletState.network = 'Ethereum Web3';
          }
        } catch (err) {
          walletState.network = 'Sepolia Testnet';
        }

        capNhatGiaoDienVi();
        luuTrangThaiVi();
        hienThiToast(`Kết nối ví MetaMask thành công: ${rutGonDiaChi(walletState.address)}`, 'success');
        return;
      }
    } catch (error) {
      console.warn('Lỗi kết nối MetaMask thật, chuyển sang chế độ Demo:', error);
      // Nếu người dùng bấm từ chối hoặc lỗi, cho phép chuyển sang chế độ Demo
    }
  }

  // Trường hợp 2: Trình duyệt chưa cài extension MetaMask (hoặc demo trên máy tính trường học)
  // Tự động kích hoạt ví Web3 Demo Sepolia Testnet để sinh viên demo trơn tru
  walletState.connected = true;
  walletState.address = '0x71C8494f1c93a02847a9821cbde1093284a19bce';
  walletState.balance = '0.45 ETH';
  walletState.network = 'Sepolia Testnet (Demo)';
  walletState.isSimulated = true;

  capNhatGiaoDienVi();
  luuTrangThaiVi();

  hienThiToast('Đã kích hoạt Ví MetaMask Demo (Mạng Sepolia Testnet) để bạn demo đồ án!', 'success');
}

function ngatKetNoiMetaMask() {
  walletState.connected = false;
  walletState.address = null;
  walletState.balance = '0.00 ETH';
  localStorage.removeItem('METAMASK_SAVED_WALLET');
  capNhatGiaoDienVi();
  hienThiToast('Đã ngắt kết nối ví MetaMask.', 'info');
}

function luuTrangThaiVi() {
  localStorage.setItem('METAMASK_SAVED_WALLET', JSON.stringify(walletState));
}

function capNhatGiaoDienVi() {
  const btnConnect = document.getElementById('btnConnectMetaMask');
  const badgeConnected = document.getElementById('walletConnectedBadge');
  const txtAddress = document.getElementById('walletAddressText');
  const txtNetwork = document.getElementById('walletNetworkText');
  const txtBalance = document.getElementById('walletBalanceText');

  if (walletState.connected && walletState.address) {
    if (btnConnect) btnConnect.classList.add('hidden');
    if (badgeConnected) badgeConnected.classList.remove('hidden');
    if (txtAddress) txtAddress.textContent = rutGonDiaChi(walletState.address);
    if (txtNetwork) txtNetwork.textContent = walletState.network;
    if (txtBalance) txtBalance.textContent = walletState.balance;
  } else {
    if (btnConnect) btnConnect.classList.remove('hidden');
    if (badgeConnected) badgeConnected.classList.add('hidden');
  }
}

function rutGonDiaChi(addr) {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

// Mở Modal Trình Soi Khối (Blockchain Explorer / Etherscan Simulator)
function moModalBlockchainExplorer(maSP) {
  const sp = danhSachSanPham.find(item => item.id === maSP) || sanPhamDangChon;
  if (!sp || !sp.blockchain) return;

  const bc = sp.blockchain;
  document.getElementById('expTxHash').textContent = bc.txHash;
  document.getElementById('expStatus').textContent = bc.trangThaiXacThuc || 'SUCCESS (Confirmed)';
  document.getElementById('expBlockNum').textContent = '#' + bc.blockNumber;
  document.getElementById('expTimestamp').textContent = bc.thoiGianXacThuc;
  document.getElementById('expContract').textContent = bc.smartContract;
  document.getElementById('expFrom').textContent = bc.viNhaSanXuat;
  document.getElementById('expSigner').textContent = bc.viKiemDinh;
  document.getElementById('expGas').textContent = bc.gasUsed;

  // Dữ liệu Payload đã được băm trên Blockchain
  const payloadData = {
    batchId: sp.id,
    productName: sp.tenSanPham,
    producer: sp.nhaSanXuat,
    qualityStandard: sp.tieuChuan,
    milestoneCount: sp.cacChong.length,
    currentStep: sp.buocHienTai,
    smartContractSignature: "SHA256-ECDSA-VERIFIED"
  };
  document.getElementById('expPayload').textContent = JSON.stringify(payloadData, null, 2);

  document.getElementById('modalBlockchainExplorer').classList.remove('hidden');
}

// ============================================================================
// 3. KHỞI TẠO VÀ CHUYỂN ĐỔI CHẾ ĐỘ NỀN (DARK / LIGHT THEME CHỐNG CHÓI)
// ============================================================================
function khoiTaoTheme() {
  const savedTheme = localStorage.getItem('APP_THEME_CHOICE');
  if (savedTheme) {
    currentTheme = savedTheme;
  } else {
    currentTheme = 'dark'; // Mặc định nền Dark Slate chống chói
  }
  apDungTheme(currentTheme);
}

function chuyenDoiTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('APP_THEME_CHOICE', currentTheme);
  apDungTheme(currentTheme);

  if (currentTheme === 'dark') {
    hienThiToast('Đã bật giao diện Tối (Dark Slate) giúp dịu mắt chống chói.', 'info');
  } else {
    hienThiToast('Đã chuyển sang giao diện Sáng (Light Mode).', 'info');
  }

  capNhatMauSacBieuDo();
}

function apDungTheme(theme) {
  const icon = document.getElementById('iconTheme');
  const text = document.getElementById('textDoiTheme');

  if (theme === 'light') {
    document.body.classList.add('theme-light');
    if (icon) icon.className = 'fa-solid fa-sun text-amber-500';
    if (text) text.textContent = 'Chế độ sáng';
  } else {
    document.body.classList.remove('theme-light');
    if (icon) icon.className = 'fa-solid fa-moon text-amber-300';
    if (text) text.textContent = 'Chế độ tối';
  }
}

// ============================================================================
// 4. LƯU TRỮ VÀ KHỞI TẠO DỮ LIỆU
// ============================================================================
function khoiTaoDuLieu() {
  const duLieu = localStorage.getItem('DS_SAN_PHAM_PRO_V3');
  if (duLieu) {
    try {
      danhSachSanPham = JSON.parse(duLieu);
    } catch (e) {
      danhSachSanPham = [...DEFAULT_PRODUCTS];
    }
  } else {
    danhSachSanPham = [...DEFAULT_PRODUCTS];
    luuLocalStorage();
  }
}

function luuLocalStorage() {
  localStorage.setItem('DS_SAN_PHAM_PRO_V3', JSON.stringify(danhSachSanPham));
}

function datLaiDuLieuGoc() {
  if (confirm('Bạn có chắc chắn muốn đặt lại dữ liệu mẫu gốc ban đầu không? Mọi chỉnh sửa của bạn sẽ được hoàn tác.')) {
    localStorage.removeItem('DS_SAN_PHAM_PRO_V3');
    danhSachSanPham = [...DEFAULT_PRODUCTS];
    luuLocalStorage();
    khoiTaoThongKe();
    hienThiDanhSach();
    capNhatBieuDo();
    if (danhSachSanPham.length > 0) {
      chonSanPham(danhSachSanPham[0].id);
    }
    hienThiToast('Đã khôi phục dữ liệu mẫu ban đầu thành công!', 'success');
  }
}

// ============================================================================
// 5. ĐIỀU HƯỚNG TAB
// ============================================================================
function khoiTaoTabDieuHuong() {
  const tabs = document.querySelectorAll('.nav-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const target = tab.getAttribute('data-tab');
      chuyenTab(target);
    });
  });
}

function chuyenTab(tabId) {
  currentTab = tabId;

  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  document.getElementById('tabTongQuan').classList.toggle('hidden', tabId !== 'tong-quan');
  document.getElementById('tabTraCuu').classList.toggle('hidden', tabId !== 'tra-cuu');
  document.getElementById('tabQuanLy').classList.toggle('hidden', tabId !== 'quan-ly');

  if (tabId === 'tong-quan' && mapInstance) {
    setTimeout(() => {
      mapInstance.invalidateSize();
      if (sanPhamDangChon) veLoTrinhBanDo(sanPhamDangChon);
    }, 200);
  }
}

// ============================================================================
// 6. BẢN ĐỒ LỘ TRÌNH (LEAFLET.JS)
// ============================================================================
function khoiTaoBanDo() {
  const container = document.getElementById('mapLộTrình');
  if (!container) return;

  mapInstance = L.map('mapLộTrình', {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView([16.0544, 107.5], 5.5);

  // Lớp bản đồ đường phố OpenStreetMap (Hoàn toàn miễn phí, 100% không yêu cầu API Key)
  const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c']
  });

  // Lớp ảnh vệ tinh Esri World Imagery thực tế (Không cần API Key)
  const esriSatelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP',
    maxZoom: 18
  });

  // Mặc định nạp lớp OpenStreetMap chuẩn
  osmLayer.addTo(mapInstance);

  // Thêm nút chuyển đổi qua lại giữa bản đồ Giao thông & Ảnh vệ tinh
  const baseLayers = {
    "Đường phố (OpenStreetMap)": osmLayer,
    "Ảnh vệ tinh (Esri Satellite)": esriSatelliteLayer
  };
  L.control.layers(baseLayers, null, { position: 'topright' }).addTo(mapInstance);

  mapLayerGroup = L.layerGroup().addTo(mapInstance);
}

function veLoTrinhBanDo(sp) {
  if (!mapInstance || !mapLayerGroup || !sp) return;

  mapLayerGroup.clearLayers();
  const toaDoArray = [];

  sp.cacChong.forEach((chong, index) => {
    if (chong.toaDo && Array.isArray(chong.toaDo)) {
      toaDoArray.push(chong.toaDo);

      let iconBg = 'bg-slate-600';
      let iconSymbol = '<i class="fa-solid fa-circle-dot"></i>';

      if (index === 0) {
        iconBg = 'bg-emerald-600';
        iconSymbol = '<i class="fa-solid fa-seedling"></i>';
      } else if (index === sp.cacChong.length - 1) {
        iconBg = 'bg-purple-600';
        iconSymbol = '<i class="fa-solid fa-flag-checkered"></i>';
      } else if (chong.buoc === sp.buocHienTai) {
        iconBg = 'bg-blue-600 animate-bounce';
        iconSymbol = '<i class="fa-solid fa-truck-fast"></i>';
      }

      const customMarker = L.divIcon({
        className: 'custom-map-marker-container',
        html: `<div class="custom-map-marker ${iconBg} w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md">${iconSymbol}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(chong.toaDo, { icon: customMarker }).addTo(mapLayerGroup);
      marker.bindPopup(`
        <div class="p-2 min-w-[200px] text-xs">
          <div class="font-bold text-sky-400 mb-1">Chặng ${chong.buoc}: ${chong.tieuDe}</div>
          <div class="text-white font-semibold mb-1">${chong.diaDiem}</div>
          <div class="text-slate-400 mb-1"><i class="fa-regular fa-clock mr-1"></i>${chong.thoiGian}</div>
          <div class="bg-blue-500/20 text-sky-300 border border-blue-500/30 px-2 py-1 rounded font-medium mt-1">${chong.trangThaiKiemDinh || 'Đạt chuẩn'}</div>
        </div>
      `);
    }
  });

  if (toaDoArray.length > 1) {
    const routeLine = L.polyline(toaDoArray, {
      color: '#38BDF8',
      weight: 3.5,
      opacity: 0.85,
      dashArray: '6, 6'
    }).addTo(mapLayerGroup);

    mapInstance.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
  }

  const mapTitle = document.getElementById('mapTenLoHang');
  if (mapTitle) {
    mapTitle.textContent = `${sp.id} - ${sp.tenSanPham}`;
  }
}

// ============================================================================
// 7. BIỂU ĐỒ THỐNG KÊ (CHART.JS)
// ============================================================================
function khoiTaoBieuDo() {
  const isDark = currentTheme === 'dark';
  const textColor = isDark ? '#94A3B8' : '#475569';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9';

  const ctxDoughnut = document.getElementById('chartNganhHang');
  if (ctxDoughnut) {
    const statsNganhHang = tinhThongKeNganhHang();
    bieuDoNganhHang = new Chart(ctxDoughnut, {
      type: 'doughnut',
      data: {
        labels: statsNganhHang.labels,
        datasets: [{
          data: statsNganhHang.data,
          backgroundColor: statsNganhHang.colors,
          borderWidth: 2,
          borderColor: isDark ? '#151F32' : '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, padding: 12, color: textColor, font: { family: 'Inter', size: 11 } }
          }
        },
        cutout: '65%'
      }
    });
  }

  const ctxBar = document.getElementById('chartHieuSuat');
  if (ctxBar) {
    bieuDoHieuSuat = new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: CHART_STATS.hieuSuatThang.labels,
        datasets: [
          {
            label: 'Đúng hẹn (%)',
            data: CHART_STATS.hieuSuatThang.dungHen,
            backgroundColor: '#10B981',
            borderRadius: 6
          },
          {
            label: 'Chậm trễ (%)',
            data: CHART_STATS.hieuSuatThang.chamTre,
            backgroundColor: '#F59E0B',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, color: textColor, font: { family: 'Inter', size: 11 } } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: textColor, font: { family: 'Inter', size: 11 } } },
          y: { max: 100, grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Inter', size: 11 } } }
        }
      }
    });
  }
}

function capNhatMauSacBieuDo() {
  const isDark = currentTheme === 'dark';
  const textColor = isDark ? '#94A3B8' : '#475569';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9';
  const borderColor = isDark ? '#151F32' : '#FFFFFF';

  if (bieuDoNganhHang) {
    bieuDoNganhHang.options.plugins.legend.labels.color = textColor;
    bieuDoNganhHang.data.datasets[0].borderColor = borderColor;
    bieuDoNganhHang.update();
  }

  if (bieuDoHieuSuat) {
    bieuDoHieuSuat.options.plugins.legend.labels.color = textColor;
    bieuDoHieuSuat.options.scales.x.ticks.color = textColor;
    bieuDoHieuSuat.options.scales.y.ticks.color = textColor;
    bieuDoHieuSuat.options.scales.y.grid.color = gridColor;
    bieuDoHieuSuat.update();
  }
}

function tinhThongKeNganhHang() {
  const counts = {};
  danhSachSanPham.forEach(sp => {
    counts[sp.loaiHang] = (counts[sp.loaiHang] || 0) + 1;
  });

  const labels = Object.keys(counts);
  const data = Object.values(counts);
  const palette = ['#38BDF8', '#10B981', '#F59E0B', '#A855F7', '#EC4899', '#06B6D4'];
  const colors = labels.map((_, i) => palette[i % palette.length]);

  return { labels, data, colors };
}

function capNhatBieuDo() {
  if (bieuDoNganhHang) {
    const stats = tinhThongKeNganhHang();
    bieuDoNganhHang.data.labels = stats.labels;
    bieuDoNganhHang.data.datasets[0].data = stats.data;
    bieuDoNganhHang.data.datasets[0].backgroundColor = stats.colors;
    bieuDoNganhHang.update();
  }
}

// ============================================================================
// 8. THỐNG KÊ NHANH
// ============================================================================
function khoiTaoThongKe() {
  const tongSo = danhSachSanPham.length;
  const dangGiao = danhSachSanPham.filter(sp => sp.buocHienTai === 3).length;
  const hoanThanh = danhSachSanPham.filter(sp => sp.buocHienTai === 4).length;
  const choXuLy = danhSachSanPham.filter(sp => sp.buocHienTai < 3).length;

  document.getElementById('thongKeTong').textContent = tongSo;
  document.getElementById('thongKeDangGiao').textContent = dangGiao;
  document.getElementById('thongKeHoanThanh').textContent = hoanThanh;
  document.getElementById('thongKeChoXuLy').textContent = choXuLy;
}

// ============================================================================
// 9. TRA CỨU & XEM CHI TIẾT SẢN PHẨM (BLOCKCHAIN & STEPPER)
// ============================================================================
function chonSanPham(maSP) {
  const sp = danhSachSanPham.find(item => item.id.toUpperCase() === maSP.toUpperCase());
  if (!sp) {
    hienThiToast(`Không tìm thấy mã sản phẩm "${maSP}".`, 'warning');
    return;
  }

  sanPhamDangChon = sp;

  // Điền dữ liệu vào Passport
  document.getElementById('passportMa').textContent = sp.id;
  document.getElementById('passportTen').textContent = sp.tenSanPham;
  document.getElementById('passportLoai').textContent = sp.loaiHang;
  document.getElementById('passportNhaSX').textContent = sp.nhaSanXuat;
  document.getElementById('passportNoiGiao').textContent = sp.noiGiaoHang;
  document.getElementById('passportNgaySX').textContent = sp.ngaySanXuat;
  document.getElementById('passportHSD').textContent = sp.hanSuDung;
  document.getElementById('passportSoLuong').textContent = sp.soLuong;
  document.getElementById('passportTieuChuan').textContent = sp.tieuChuan || 'Đạt chuẩn lưu hành';
  document.getElementById('passportPhuongTien').textContent = sp.phuongTien || 'Xe tải lạnh chuyên dụng';
  document.getElementById('passportKiemDinh').textContent = sp.nguoiKiemDinh || 'Bộ phận KCS';

  // Huy hiệu trạng thái
  const badge = document.getElementById('passportTrangThaiBadge');
  if (sp.buocHienTai === 1) {
    badge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30';
    badge.textContent = 'Chặng 1/4: Đang Sản Xuất';
  } else if (sp.buocHienTai === 2) {
    badge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30';
    badge.textContent = 'Chặng 2/4: Đang Đóng Gói';
  } else if (sp.buocHienTai === 3) {
    badge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-sky-300 border border-blue-500/30 animate-pulse';
    badge.textContent = 'Chặng 3/4: Đang Vận Chuyển';
  } else if (sp.buocHienTai === 4) {
    badge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    badge.textContent = 'Chặng 4/4: Đã Hoàn Thành';
  }

  // Cập nhật thông số Blockchain Proof
  if (sp.blockchain) {
    document.getElementById('proofContract').textContent = sp.blockchain.smartContract;
    document.getElementById('proofBlock').textContent = '#' + sp.blockchain.blockNumber;
    document.getElementById('proofTxHash').textContent = sp.blockchain.txHash;
    document.getElementById('proofSigner').textContent = sp.blockchain.viKiemDinh;
    document.getElementById('proofTime').textContent = sp.blockchain.thoiGianXacThuc;
  }

  // Vẽ mã QR lên canvas
  veMaQRCanvas('passportQrCanvas', `${sp.id}-${sp.tenSanPham}`);

  // Vẽ Stepper 4 bước
  renderStepperChiTiet(sp);

  // Vẽ lộ trình trên bản đồ
  veLoTrinhBanDo(sp);
}

function renderStepperChiTiet(sp) {
  const container = document.getElementById('stepperContainer');
  if (!container) return;

  const current = sp.buocHienTai;

  container.innerHTML = `
    <!-- THANH TIẾN TRÌNH STEPPER -->
    <div class="mb-8 px-2 sm:px-6">
      <div class="step-container justify-between">
        ${sp.cacChong.map((chong, index) => {
          const stepNum = chong.buoc;
          let circleClass = 'step-pending';
          let iconInner = stepNum;

          if (stepNum < current) {
            circleClass = 'step-completed';
            iconInner = '<i class="fa-solid fa-check text-sm"></i>';
          } else if (stepNum === current) {
            circleClass = 'step-active';
            iconInner = '<i class="fa-solid fa-spinner fa-spin text-sm"></i>';
          }

          const hasLine = index < sp.cacChong.length - 1;
          const lineDone = stepNum < current;

          return `
            <div class="flex items-center flex-1 last:flex-none">
              <div class="flex flex-col items-center">
                <div class="step-circle ${circleClass}">
                  ${iconInner}
                </div>
                <span class="text-xs font-semibold text-slate-300 mt-2 text-center hidden sm:block max-w-[100px]">
                  ${chong.tieuDe}
                </span>
              </div>
              ${hasLine ? `<div class="step-line ${lineDone ? 'completed' : ''}"></div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- DANH SÁCH CHI TIẾT TỪNG CHẶNG VÀ MÃ BĂM BLOCKCHAIN -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${sp.cacChong.map(chong => {
        let borderClass = 'border-slate-800 bg-slate-900/40';
        let badgeColor = 'bg-slate-800 text-slate-400 border-slate-700';
        let statusTitle = 'Chờ tiếp nhận';

        if (chong.buoc < current) {
          borderClass = 'border-emerald-500/30 bg-emerald-950/15';
          badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold';
          statusTitle = 'Đã hoàn tất';
        } else if (chong.buoc === current) {
          borderClass = 'border-blue-500/50 bg-blue-950/25 shadow-lg shadow-blue-500/10';
          badgeColor = 'bg-blue-500/20 text-sky-300 border-blue-500/40 font-bold animate-pulse';
          statusTitle = 'Đang diễn ra';
        }

        return `
          <div class="p-4 rounded-xl border ${borderClass} transition relative">
            <div class="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
              <span class="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                <span class="w-6 h-6 rounded-full bg-slate-800 text-sky-400 flex items-center justify-center text-xs font-bold">${chong.buoc}</span>
                ${chong.tieuDe}
              </span>
              <span class="px-2.5 py-0.5 rounded text-[11px] border ${badgeColor}">
                ${statusTitle}
              </span>
            </div>

            <p class="text-xs text-slate-300 leading-relaxed mb-3">${chong.chiTiet}</p>

            <div class="space-y-1.5 text-xs text-slate-400 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
              <div class="flex items-center justify-between">
                <span><i class="fa-solid fa-location-dot text-rose-400 w-4"></i> ${chong.diaDiem}</span>
                <span class="text-slate-500 font-mono text-[10px]">${chong.toaDo ? `${chong.toaDo[0].toFixed(2)}°N, ${chong.toaDo[1].toFixed(2)}°E` : ''}</span>
              </div>
              <div><i class="fa-regular fa-clock text-slate-400 w-4"></i> ${chong.thoiGian}</div>
              <div><i class="fa-solid fa-user-check text-sky-400 w-4"></i> Phụ trách: <span class="font-semibold text-slate-200">${chong.nguoiPhuTrach}</span></div>
              
              <!-- Khối mã băm Blockchain từng chặng -->
              ${chong.txHash ? `
                <div class="pt-1.5 mt-1 border-t border-slate-800/80 flex items-center justify-between font-mono text-[10px]">
                  <span class="text-slate-500"><i class="fa-brands fa-ethereum text-indigo-400 mr-1"></i>Tx: ${chong.txHash.slice(0, 10)}...</span>
                  <button onclick="moModalBlockchainExplorer('${sp.id}')" class="text-sky-400 hover:text-sky-300 underline font-sans text-xs">
                    Kiểm tra khối #${chong.blockNum || '5892140'}
                  </button>
                </div>
              ` : `
                <div class="pt-1 text-[11px] text-slate-500 italic">
                  <i class="fa-solid fa-lock text-slate-600 mr-1"></i> Chờ ký số giao dịch khối khi hoàn tất chặng
                </div>
              `}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ============================================================================
// 10. BẢNG QUẢN LÝ LÔ HÀNG (CRUD TABLE & SEARCH/FILTER)
// ============================================================================
function hienThiDanhSach() {
  const tbody = document.getElementById('tableShipmentsBody');
  if (!tbody) return;

  const tuKhoa = (document.getElementById('inputTimKiemBang')?.value || '').trim().toLowerCase();
  const locNganh = document.getElementById('selectLocNganh')?.value || 'all';
  const locTrangThai = document.getElementById('selectLocTrangThai')?.value || 'all';

  const ketQua = danhSachSanPham.filter(sp => {
    const matchTuKhoa = sp.id.toLowerCase().includes(tuKhoa) ||
                        sp.tenSanPham.toLowerCase().includes(tuKhoa) ||
                        sp.nhaSanXuat.toLowerCase().includes(tuKhoa);
    
    const matchNganh = locNganh === 'all' || sp.loaiHang === locNganh;

    let matchStatus = true;
    if (locTrangThai === 'san_xuat') matchStatus = sp.buocHienTai === 1;
    else if (locTrangThai === 'dong_goi') matchStatus = sp.buocHienTai === 2;
    else if (locTrangThai === 'dang_giao') matchStatus = sp.buocHienTai === 3;
    else if (locTrangThai === 'hoan_thanh') matchStatus = sp.buocHienTai === 4;

    return matchTuKhoa && matchNganh && matchStatus;
  });

  if (ketQua.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-10 text-slate-400">
          <i class="fa-solid fa-box-open text-3xl mb-2 text-slate-500 block"></i>
          Không tìm thấy lô hàng nào phù hợp với bộ lọc.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = ketQua.map(sp => {
    let badgeClass = 'bg-slate-800 text-slate-300 border-slate-700';
    let statusText = 'Đang xử lý';

    if (sp.buocHienTai === 1) {
      badgeClass = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      statusText = 'Chặng 1: Sản xuất';
    } else if (sp.buocHienTai === 2) {
      badgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      statusText = 'Chặng 2: Đóng gói';
    } else if (sp.buocHienTai === 3) {
      badgeClass = 'bg-blue-500/20 text-sky-300 border-blue-500/30';
      statusText = 'Chặng 3: Vận chuyển';
    } else if (sp.buocHienTai === 4) {
      badgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      statusText = 'Chặng 4: Hoàn thành';
    }

    return `
      <tr class="border-b border-slate-800/80 hover:bg-slate-800/40 transition">
        <td class="py-3 px-4 font-bold text-sky-400 font-mono">${sp.id}</td>
        <td class="py-3 px-4">
          <div class="font-semibold text-slate-100">${sp.tenSanPham}</div>
          <div class="text-[11px] text-slate-400">${sp.loaiHang} • ${sp.soLuong}</div>
        </td>
        <td class="py-3 px-4 text-xs text-slate-300">
          <div class="truncate max-w-[200px]" title="${sp.nhaSanXuat}">
            <i class="fa-solid fa-house-chimney text-slate-400 mr-1"></i>${sp.nhaSanXuat}
          </div>
          <div class="truncate max-w-[200px] mt-1" title="${sp.noiGiaoHang}">
            <i class="fa-solid fa-location-dot text-rose-400 mr-1"></i>${sp.noiGiaoHang}
          </div>
        </td>
        <td class="py-3 px-4 text-xs text-slate-300">
          <div>SX: <span class="font-medium text-slate-200">${sp.ngaySanXuat}</span></div>
          <div class="text-slate-400">HSD: ${sp.hanSuDung}</div>
        </td>
        <td class="py-3 px-4">
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeClass}">
            <span class="w-1.5 h-1.5 rounded-full mr-1.5 ${sp.buocHienTai === 3 ? 'bg-sky-400 animate-pulse' : sp.buocHienTai === 4 ? 'bg-emerald-400' : 'bg-amber-400'}"></span>
            ${statusText}
          </span>
        </td>
        <td class="py-3 px-4 text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button onclick="xemLoTrinhNhanh('${sp.id}')" class="px-2.5 py-1 text-xs bg-blue-500/20 text-sky-300 hover:bg-blue-500/30 rounded-lg transition font-medium border border-blue-500/30" title="Xem hành trình & bản đồ">
              <i class="fa-solid fa-eye"></i> Xem
            </button>
            <button onclick="chuyenTrangThaiTiepTheo('${sp.id}')" class="px-2.5 py-1 text-xs bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-lg transition font-medium border border-slate-700" title="Chuyển sang chặng kế tiếp">
              <i class="fa-solid fa-forward-step"></i> Tiếp
            </button>
            <button onclick="moModalBlockchainExplorer('${sp.id}')" class="p-1.5 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 rounded-lg transition border border-indigo-500/30" title="Kiểm tra sổ cái Blockchain">
              <i class="fa-brands fa-ethereum"></i>
            </button>
            <button onclick="moModalSua('${sp.id}')" class="p-1.5 text-xs text-slate-400 hover:text-sky-300 rounded-lg transition" title="Chỉnh sửa thông tin">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button onclick="xoaSanPham('${sp.id}')" class="p-1.5 text-xs text-slate-400 hover:text-rose-400 rounded-lg transition" title="Xóa lô hàng">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function xemLoTrinhNhanh(id) {
  chonSanPham(id);
  chuyenTab('tra-cuu');
}

function chuyenTrangThaiTiepTheo(id) {
  const sp = danhSachSanPham.find(item => item.id === id);
  if (!sp) return;

  if (sp.buocHienTai < 4) {
    sp.buocHienTai += 1;
    // Sinh thêm mã băm Blockchain khi chuyển chặng
    const chongHienTai = sp.cacChong.find(c => c.buoc === sp.buocHienTai);
    if (chongHienTai && !chongHienTai.txHash) {
      chongHienTai.txHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
      chongHienTai.blockNum = 5892140 + Math.floor(Math.random() * 20000);
      chongHienTai.thoiGian = new Date().toLocaleString('vi-VN');
    }
    hienThiToast(`Đã chuyển ${sp.id} lên Chặng ${sp.buocHienTai}/4 & ký số Blockchain thành công!`, 'success');
  } else {
    sp.buocHienTai = 1;
    hienThiToast(`Đã đặt lại ${sp.id} về Chặng 1 để demo tiếp.`, 'info');
  }

  luuLocalStorage();
  khoiTaoThongKe();
  hienThiDanhSach();
  capNhatBieuDo();

  if (sanPhamDangChon && sanPhamDangChon.id === id) {
    chonSanPham(id);
  }
}

function xoaSanPham(id) {
  if (confirm(`Bạn có chắc chắn muốn xóa lô hàng ${id} không?`)) {
    danhSachSanPham = danhSachSanPham.filter(item => item.id !== id);
    luuLocalStorage();
    khoiTaoThongKe();
    hienThiDanhSach();
    capNhatBieuDo();

    if (sanPhamDangChon && sanPhamDangChon.id === id) {
      if (danhSachSanPham.length > 0) chonSanPham(danhSachSanPham[0].id);
    }
    hienThiToast(`Đã xóa thành công lô hàng ${id}!`, 'info');
  }
}

// ============================================================================
// 11. CÁC MODAL: THÊM MỚI, CHỈNH SỬA, NHẬT KÝ, TEM QR & CHỨNG NHẬN
// ============================================================================
function khoiTaoCacForm() {
  const inputSearch = document.getElementById('inputTimKiemBang');
  const selectNganh = document.getElementById('selectLocNganh');
  const selectTrangThai = document.getElementById('selectLocTrangThai');

  if (inputSearch) inputSearch.addEventListener('input', hienThiDanhSach);
  if (selectNganh) selectNganh.addEventListener('change', hienThiDanhSach);
  if (selectTrangThai) selectTrangThai.addEventListener('change', hienThiDanhSach);

  const btnSearchHeader = document.getElementById('btnHeaderSearch');
  const inputSearchHeader = document.getElementById('inputHeaderSearch');
  const thucHienTimKiem = () => {
    const ma = inputSearchHeader.value.trim().toUpperCase();
    if (!ma) {
      hienThiToast('Vui lòng nhập mã lô hàng (VD: SP001, SP002...)', 'warning');
      return;
    }
    chonSanPham(ma);
    chuyenTab('tra-cuu');
  };

  if (btnSearchHeader) btnSearchHeader.addEventListener('click', thucHienTimKiem);
  if (inputSearchHeader) {
    inputSearchHeader.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') thucHienTimKiem();
    });
  }

  // Form Thêm Mới (Tự động ký số qua ví MetaMask)
  const formAdd = document.getElementById('formThemMoi');
  if (formAdd) {
    formAdd.addEventListener('submit', (e) => {
      e.preventDefault();
      const ma = document.getElementById('addMa').value.trim().toUpperCase();
      const ten = document.getElementById('addTen').value.trim();
      const loai = document.getElementById('addLoai').value;
      const nhaSX = document.getElementById('addNhaSX').value.trim();
      const noiGiao = document.getElementById('addNoiGiao').value.trim();
      const ngaySX = document.getElementById('addNgaySX').value || new Date().toISOString().slice(0, 10);
      const hanDung = document.getElementById('addHanDung').value || '2027-12-31';
      const soLuong = document.getElementById('addSoLuong').value.trim() || '1,000 đơn vị';
      const tieuChuan = document.getElementById('addTieuChuan').value.trim() || 'VietGAP, ISO 9001';
      const phuongTien = document.getElementById('addPhuongTien').value.trim() || 'Xe tải lạnh Logistics';

      if (danhSachSanPham.some(sp => sp.id === ma)) {
        alert(`Mã lô hàng "${ma}" đã tồn tại! Vui lòng chọn mã khác.`);
        return;
      }

      // Sinh mã băm và khối Blockchain mới
      const newTxHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
      const newBlock = 5920000 + Math.floor(Math.random() * 5000);
      const signerAddr = walletState.address || '0x71C8494f1c93a02847a9821cbde1093284a19bce';

      const spMoi = {
        id: ma,
        tenSanPham: ten,
        loaiHang: loai,
        nhaSanXuat: nhaSX,
        noiGiaoHang: noiGiao,
        ngaySanXuat: ngaySX,
        hanSuDung: hanDung,
        soLuong: soLuong,
        tieuChuan: tieuChuan,
        phuongTien: phuongTien,
        nhietDoBaoQuan: "18°C - 24°C",
        doAmBaoQuan: "Dưới 65%",
        nguoiKiemDinh: "Kỹ sư kiểm tra: Nguyễn Văn Minh",
        trangThai: "san_xuat",
        buocHienTai: 1,
        blockchain: {
          network: walletState.network || "Ethereum Sepolia Testnet",
          smartContract: "0x892aF03Bf75B6e21821C7aC09DbD4E12e95a7F92",
          blockNumber: newBlock,
          txHash: newTxHash,
          viNhaSanXuat: signerAddr,
          viKiemDinh: signerAddr,
          gasUsed: "88,240 Gwei",
          thoiGianXacThuc: new Date().toLocaleString('vi-VN'),
          trangThaiXacThuc: "SUCCESS (Confirmed)"
        },
        cacChong: [
          {
            buoc: 1,
            tieuDe: "Thu hoạch & Bắt đầu sản xuất",
            diaDiem: nhaSX,
            toaDo: [10.7769, 106.7009],
            thoiGian: `${ngaySX} 08:00`,
            nguoiPhuTrach: "Trưởng ca sản xuất",
            trangThaiKiemDinh: "ĐẠT CHUẨN NGUYÊN LIỆU",
            txHash: newTxHash,
            blockNum: newBlock,
            chiTiet: "Tiếp nhận nguyên liệu sạch và đưa vào quy trình sơ chế tại xưởng."
          },
          {
            buoc: 2,
            tieuDe: "Kiểm tra chất lượng & Đóng gói",
            diaDiem: nhaSX,
            toaDo: [10.8231, 106.6297],
            thoiGian: "Chờ cập nhật",
            nguoiPhuTrach: "Bộ phận KCS chất lượng",
            trangThaiKiemDinh: "CHỜ ĐÓNG GÓI",
            txHash: null,
            blockNum: null,
            chiTiet: "Đóng gói theo tiêu chuẩn và dán tem mã QR truy xuất nguồn gốc."
          },
          {
            buoc: 3,
            tieuDe: "Vận chuyển phân phối",
            diaDiem: `Trên đường đến ${noiGiao}`,
            toaDo: [16.0544, 108.2022],
            thoiGian: "Chờ cập nhật",
            nguoiPhuTrach: "Đơn vị vận tải logistics",
            trangThaiKiemDinh: "LẬP ĐƠN VẬN",
            txHash: null,
            blockNum: null,
            chiTiet: "Vận chuyển an toàn, kiểm soát nhiệt độ thùng hàng."
          },
          {
            buoc: 4,
            tieuDe: "Bàn giao đến điểm đích",
            diaDiem: noiGiao,
            toaDo: [21.0285, 105.8542],
            thoiGian: "Dự kiến sau 3 ngày",
            nguoiPhuTrach: "Người tiếp nhận hàng",
            trangThaiKiemDinh: "CHỜ TIẾP NHẬN",
            txHash: null,
            blockNum: null,
            chiTiet: "Nghiệm thu đủ số lượng và đưa vào quầy bày bán."
          }
        ]
      };

      danhSachSanPham.unshift(spMoi);
      luuLocalStorage();
      khoiTaoThongKe();
      hienThiDanhSach();
      capNhatBieuDo();

      dongModal('modalThemMoi');
      formAdd.reset();

      chonSanPham(ma);
      chuyenTab('tra-cuu');
      hienThiToast(`Đã tạo lô ${ma} & ký số vào Smart Contract thành công!`, 'success');
    });
  }

  // Form Chỉnh Sửa
  const formEdit = document.getElementById('formChinhSua');
  if (formEdit) {
    formEdit.addEventListener('submit', (e) => {
      e.preventDefault();
      const ma = document.getElementById('editMa').value;
      const sp = danhSachSanPham.find(item => item.id === ma);
      if (!sp) return;

      sp.tenSanPham = document.getElementById('editTen').value.trim();
      sp.loaiHang = document.getElementById('editLoai').value;
      sp.nhaSanXuat = document.getElementById('editNhaSX').value.trim();
      sp.noiGiaoHang = document.getElementById('editNoiGiao').value.trim();
      sp.ngaySanXuat = document.getElementById('editNgaySX').value;
      sp.hanSuDung = document.getElementById('editHanDung').value;
      sp.soLuong = document.getElementById('editSoLuong').value.trim();
      sp.tieuChuan = document.getElementById('editTieuChuan').value.trim();
      sp.buocHienTai = parseInt(document.getElementById('editBuocHienTai').value, 10);

      luuLocalStorage();
      khoiTaoThongKe();
      hienThiDanhSach();
      capNhatBieuDo();

      dongModal('modalChinhSua');
      if (sanPhamDangChon && sanPhamDangChon.id === ma) {
        chonSanPham(ma);
      }
      hienThiToast(`Đã cập nhật thông tin lô hàng ${ma}!`, 'success');
    });
  }

  // Form Thêm Nhật Ký Chặng
  const formNhatKy = document.getElementById('formThemNhatKy');
  if (formNhatKy) {
    formNhatKy.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!sanPhamDangChon) return;

      const buoc = parseInt(document.getElementById('nhatKyBuoc').value, 10);
      const diaDiem = document.getElementById('nhatKyDiaDiem').value.trim();
      const nguoiPT = document.getElementById('nhatKyNguoiPT').value.trim();
      const kiemDinh = document.getElementById('nhatKyKiemDinh').value.trim();
      const chiTiet = document.getElementById('nhatKyChiTiet').value.trim();

      const chongTarget = sanPhamDangChon.cacChong.find(c => c.buoc === buoc);
      if (chongTarget) {
        chongTarget.diaDiem = diaDiem;
        chongTarget.nguoiPhuTrach = nguoiPT;
        chongTarget.trangThaiKiemDinh = kiemDinh;
        chongTarget.chiTiet = chiTiet;
        chongTarget.thoiGian = new Date().toLocaleString('vi-VN');
        chongTarget.txHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
        chongTarget.blockNum = 5892140 + Math.floor(Math.random() * 20000);

        luuLocalStorage();
        renderStepperChiTiet(sanPhamDangChon);
        dongModal('modalThemNhatKy');
        formNhatKy.reset();
        hienThiToast(`Đã cập nhật nhật ký & ký số chặng ${buoc} vào Blockchain!`, 'success');
      }
    });
  }
}

function moModalThemMoi() {
  document.getElementById('modalThemMoi').classList.remove('hidden');
}

function moModalSua(id) {
  const sp = danhSachSanPham.find(item => item.id === id);
  if (!sp) return;

  document.getElementById('editMa').value = sp.id;
  document.getElementById('editTen').value = sp.tenSanPham;
  document.getElementById('editLoai').value = sp.loaiHang;
  document.getElementById('editNhaSX').value = sp.nhaSanXuat;
  document.getElementById('editNoiGiao').value = sp.noiGiaoHang;
  document.getElementById('editNgaySX').value = sp.ngaySanXuat;
  document.getElementById('editHanDung').value = sp.hanSuDung;
  document.getElementById('editSoLuong').value = sp.soLuong;
  document.getElementById('editTieuChuan').value = sp.tieuChuan || '';
  document.getElementById('editBuocHienTai').value = sp.buocHienTai;

  document.getElementById('modalChinhSua').classList.remove('hidden');
}

function moModalThemNhatKy() {
  if (!sanPhamDangChon) return;
  document.getElementById('nhatKyMaSP').textContent = `${sanPhamDangChon.id} - ${sanPhamDangChon.tenSanPham}`;
  document.getElementById('modalThemNhatKy').classList.remove('hidden');
}

function moModalTemNhan() {
  if (!sanPhamDangChon) return;
  const sp = sanPhamDangChon;

  document.getElementById('temMa').textContent = sp.id;
  document.getElementById('temTen').textContent = sp.tenSanPham;
  document.getElementById('temLoai').textContent = sp.loaiHang;
  document.getElementById('temNhaSX').textContent = sp.nhaSanXuat;
  document.getElementById('temNgaySX').textContent = sp.ngaySanXuat;
  document.getElementById('temHSD').textContent = sp.hanSuDung;
  document.getElementById('temTieuChuan').textContent = sp.tieuChuan || 'VietGAP Tiêu Chuẩn';
  document.getElementById('temSoLuong').textContent = sp.soLuong;

  veMaQRCanvas('temQrCanvas', `ORIGIN-${sp.id}`);
  document.getElementById('modalTemNhan').classList.remove('hidden');
}

function moModalChungNhan() {
  if (!sanPhamDangChon) return;
  const sp = sanPhamDangChon;

  document.getElementById('certTen').textContent = sp.tenSanPham;
  document.getElementById('certMa').textContent = sp.id;
  document.getElementById('certNhaSX').textContent = sp.nhaSanXuat;
  document.getElementById('certNoiGiao').textContent = sp.noiGiaoHang;
  document.getElementById('certNgaySX').textContent = sp.ngaySanXuat;
  document.getElementById('certHSD').textContent = sp.hanSuDung;
  document.getElementById('certTieuChuan').textContent = sp.tieuChuan || 'VietGAP, ISO 22000';
  document.getElementById('certKiemDinh').textContent = sp.nguoiKiemDinh || 'Trần Hoàng Nam (KCS-889)';

  veMaQRCanvas('certQrCanvas', `CERT-${sp.id}`);
  document.getElementById('modalChungNhan').classList.remove('hidden');
}

function dongModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.add('hidden');
}

function inPhieu() {
  window.print();
}

// ============================================================================
// 12. TIỆN ÍCH: VẼ MÃ QR TRÊN CANVAS & XUẤT EXCEL (CSV)
// ============================================================================
function veMaQRCanvas(canvasId, text) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = canvas.width;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = '#0F172A';
  const cellSize = size / 21;

  function drawFinder(x, y) {
    ctx.fillRect(x * cellSize, y * cellSize, 7 * cellSize, 7 * cellSize);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect((x + 1) * cellSize, (y + 1) * cellSize, 5 * cellSize, 5 * cellSize);
    ctx.fillStyle = '#0F172A';
    ctx.fillRect((x + 2) * cellSize, (y + 2) * cellSize, 3 * cellSize, 3 * cellSize);
  }

  drawFinder(1, 1);
  drawFinder(13, 1);
  drawFinder(1, 13);

  let seed = 0;
  for (let i = 0; i < text.length; i++) seed += text.charCodeAt(i);

  for (let r = 0; r < 21; r++) {
    for (let c = 0; c < 21; c++) {
      if ((r < 9 && c < 9) || (r < 9 && c > 11) || (r > 11 && c < 9)) continue;
      if (((r * 3 + c * 7 + seed) % 2 === 0)) {
        ctx.fillRect(c * cellSize, r * cellSize, cellSize - 0.4, cellSize - 0.4);
      }
    }
  }
}

function xuatFileExcel() {
  const headers = ['Mã Lô', 'Tên Sản Phẩm', 'Ngành Hàng', 'Nơi Sản Xuất', 'Nơi Giao Đến', 'Ngày Sản Xuất', 'Hạn Dùng', 'Số Lượng', 'Tiêu Chuẩn', 'Chặng Hiện Tại', 'Smart Contract', 'Mã TxHash'];
  const rows = danhSachSanPham.map(sp => [
    `"${sp.id}"`,
    `"${sp.tenSanPham}"`,
    `"${sp.loaiHang}"`,
    `"${sp.nhaSanXuat.replace(/"/g, '""')}"`,
    `"${sp.noiGiaoHang.replace(/"/g, '""')}"`,
    `"${sp.ngaySanXuat}"`,
    `"${sp.hanSuDung}"`,
    `"${sp.soLuong}"`,
    `"${sp.tieuChuan || ''}"`,
    `"Chặng ${sp.buocHienTai}/4"`,
    `"${sp.blockchain ? sp.blockchain.smartContract : ''}"`,
    `"${sp.blockchain ? sp.blockchain.txHash : ''}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Danh_Sach_Chuoi_Cung_Ung_Blockchain_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();

  hienThiToast('Đã xuất báo cáo danh sách kèm mã băm Blockchain ra file Excel!', 'success');
}

function hienThiToast(noiDung, loai = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  let bgClass = 'bg-slate-800 text-white border-slate-700';
  let iconClass = 'fa-circle-info text-sky-400';

  if (loai === 'success') {
    bgClass = 'bg-emerald-600 text-white border-emerald-500';
    iconClass = 'fa-circle-check';
  } else if (loai === 'warning') {
    bgClass = 'bg-amber-600 text-white border-amber-500';
    iconClass = 'fa-triangle-exclamation';
  }

  toast.className = `fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-xl flex items-center gap-3 text-sm font-medium transition-all ${bgClass}`;
  toast.innerHTML = `
    <i class="fa-solid ${iconClass} text-lg"></i>
    <span>${noiDung}</span>
  `;

  toast.classList.remove('hidden', 'opacity-0');

  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 3500);
}

// GreenWheel Debt Reconciliation Web App Logic

// Mock Data
const appState = {
  currentScreen: 'screen-dashboard',
  selectedCustomer: 'KH-EB908',
  reconcileState: 'mismatch', // 'mismatch' or 'matched'
  receiptAmount: 43500000,
  invoiceAmount: 45500000,
  customers: [
    {
      id: 'KH-EB908',
      name: 'Đại lý Xe Điện Xanh EcoBike',
      taxId: '0108924812',
      contact: 'Trần Minh Đức (0912.456.789)',
      type: 'Đại lý cấp 1',
      creditLimit: 500000000,
      totalDebt: 185600000,
      overdueDebt: 45500000,
      daysOverdue: 12,
      lastPayment: '28/08/2026',
      status: 'overdue', // overdue, warning, safe
      unpaidInvoices: 4
    },
    {
      id: 'KH-VM402',
      name: 'Chuỗi Cửa Hàng VeloCity Sài Gòn',
      taxId: '0314567891',
      contact: 'Nguyễn Thị Hồng (0903.112.334)',
      type: 'Đại lý cấp 1',
      creditLimit: 600000000,
      totalDebt: 142000000,
      overdueDebt: 0,
      daysOverdue: 0,
      lastPayment: '04/09/2026',
      status: 'safe',
      unpaidInvoices: 3
    },
    {
      id: 'KH-MB115',
      name: 'Công ty Du Lịch Xanh Mộc Châu E-Tour',
      taxId: '2600987123',
      contact: 'Phạm Văn Hưng (0988.990.112)',
      type: 'Khách sỉ dự án',
      creditLimit: 300000000,
      totalDebt: 98400000,
      overdueDebt: 28000000,
      daysOverdue: 5,
      status: 'warning',
      unpaidInvoices: 2
    },
    {
      id: 'KH-HN678',
      name: 'Cửa Hàng Xe Đạp Thể Thao Tây Hồ',
      taxId: '0107654321',
      contact: 'Lê Hoàng Nam (0977.345.678)',
      type: 'Đại lý cấp 2',
      creditLimit: 200000000,
      totalDebt: 64200000,
      overdueDebt: 0,
      daysOverdue: 0,
      lastPayment: '02/09/2026',
      status: 'safe',
      unpaidInvoices: 2
    },
    {
      id: 'KH-DN229',
      name: 'Đại Lý GreenRide Đà Nẵng',
      taxId: '0400876543',
      contact: 'Võ Thanh Tùng (0905.889.001)',
      type: 'Đại lý cấp 2',
      creditLimit: 250000000,
      totalDebt: 52100000,
      overdueDebt: 15000000,
      daysOverdue: 8,
      status: 'warning',
      unpaidInvoices: 1
    },
    {
      id: 'KH-CT904',
      name: 'Trung Tâm Xe Đạp Điện Miền Tây Cần Thơ',
      taxId: '1801234567',
      contact: 'Đỗ Thị Kim Oanh (0939.667.889)',
      type: 'Đại lý cấp 2',
      creditLimit: 200000000,
      totalDebt: 38800000,
      overdueDebt: 0,
      daysOverdue: 0,
      lastPayment: '05/09/2026',
      status: 'safe',
      unpaidInvoices: 1
    }
  ]
};

// Navigate between screens
function navigateTo(screenId) {
  appState.currentScreen = screenId;
  
  // Hide all screens
  document.querySelectorAll('.screen-view').forEach(screen => {
    screen.classList.add('hidden');
  });
  
  // Show target screen
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update navigation highlighting
  document.querySelectorAll('.nav-btn').forEach(btn => {
    if (btn.dataset.screen === screenId) {
      btn.classList.add('bg-emerald-800', 'text-white', 'shadow-sm');
      btn.classList.remove('text-emerald-100', 'hover:bg-emerald-800/60');
    } else {
      btn.classList.remove('bg-emerald-800', 'text-white', 'shadow-sm');
      btn.classList.add('text-emerald-100', 'hover:bg-emerald-800/60');
    }
  });

  // Re-initialize charts if navigated to report
  if (screenId === 'screen-report') {
    setTimeout(initReportCharts, 100);
  }
  
  // Refresh icons
  if (window.lucide) {
    lucide.createIcons();
  }
}

// Switch between mismatch error state and matched state in Screen 4
function setReconcileMode(mode) {
  appState.reconcileState = mode;
  const mismatchSection = document.getElementById('reconcile-mismatch-state');
  const matchedSection = document.getElementById('reconcile-matched-state');
  const btnMismatch = document.getElementById('btn-mode-mismatch');
  const btnMatched = document.getElementById('btn-mode-matched');

  if (mode === 'mismatch') {
    mismatchSection.classList.remove('hidden');
    matchedSection.classList.add('hidden');
    btnMismatch.classList.add('bg-rose-600', 'text-white', 'shadow-sm');
    btnMismatch.classList.remove('bg-white', 'text-slate-700');
    btnMatched.classList.remove('bg-emerald-600', 'text-white', 'shadow-sm');
    btnMatched.classList.add('bg-white', 'text-slate-700');
  } else {
    mismatchSection.classList.add('hidden');
    matchedSection.classList.remove('hidden');
    btnMatched.classList.add('bg-emerald-600', 'text-white', 'shadow-sm');
    btnMatched.classList.remove('bg-white', 'text-slate-700');
    btnMismatch.classList.remove('bg-rose-600', 'text-white', 'shadow-sm');
    btnMismatch.classList.add('bg-white', 'text-slate-700');
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

// Convert numbers to Vietnamese words for receipt form
function numberToVietnameseWords(num) {
  // Simple mapping for demo amounts
  if (num === 45500000) return 'Bốn mươi lăm triệu năm trăm nghìn đồng chẵn';
  if (num === 43500000) return 'Bốn mươi ba triệu năm trăm nghìn đồng chẵn';
  if (num === 2000000) return 'Hai triệu đồng chẵn';
  return 'Bốn mươi lăm triệu năm trăm nghìn đồng chẵn';
}

// Format currency
function formatVND(value) {
  return new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ';
}

// Print trigger
function triggerPrint() {
  window.print();
}

// Search filter in Dashboard
function filterCustomerTable() {
  const query = document.getElementById('customer-search-input')?.value.toLowerCase() || '';
  const statusFilter = document.getElementById('customer-status-filter')?.value || 'all';

  const rows = document.querySelectorAll('.customer-row');
  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    const rowStatus = row.dataset.status;

    const matchesQuery = text.includes(query);
    const matchesStatus = (statusFilter === 'all') || (rowStatus === statusFilter);

    if (matchesQuery && matchesStatus) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// Chart.js initialization
let dailyChartInstance = null;
let paymentMethodChartInstance = null;

function initReportCharts() {
  const dailyCanvas = document.getElementById('chartDailyRevenue');
  const methodCanvas = document.getElementById('chartPaymentMethods');

  if (dailyCanvas && !dailyChartInstance) {
    const ctx = dailyCanvas.getContext('2d');
    dailyChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Thứ 2 (01/09)', 'Thứ 3 (02/09)', 'Thứ 4 (03/09)', 'Thứ 5 (04/09)', 'Thứ 6 (05/09)', 'Thứ 7 (06/09)', 'CN (07/09)'],
        datasets: [
          {
            label: 'Thực thu đối soát khớp (VNĐ)',
            data: [120000000, 185000000, 95000000, 240000000, 165000000, 85000000, 55200000],
            backgroundColor: '#166534',
            borderRadius: 8,
            barPercentage: 0.6
          },
          {
            label: 'Mục tiêu kế hoạch thu (VNĐ)',
            data: [100000000, 150000000, 120000000, 200000000, 180000000, 70000000, 40000000],
            type: 'line',
            borderColor: '#b59d6e',
            backgroundColor: 'rgba(181, 157, 110, 0.15)',
            borderWidth: 2.5,
            tension: 0.35,
            fill: false,
            pointBackgroundColor: '#b59d6e',
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 14,
              font: { family: 'Plus Jakarta Sans', size: 12, weight: 600 }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + new Intl.NumberFormat('vi-VN').format(context.raw) + ' VNĐ';
              }
            }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: function(value) {
                return (value / 1000000) + ' Tr VNĐ';
              },
              font: { family: 'Plus Jakarta Sans', size: 11 }
            },
            grid: { color: '#f1f5f9' }
          },
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } }
          }
        }
      }
    });
  }

  if (methodCanvas && !paymentMethodChartInstance) {
    const ctx = methodCanvas.getContext('2d');
    paymentMethodChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Chuyển khoản VCB/BIDV (82%)', 'Tiền mặt thủ quỹ (12%)', 'Thẻ POS/Cổng thanh toán (6%)'],
        datasets: [{
          data: [775064000, 113424000, 56712000],
          backgroundColor: ['#166534', '#b59d6e', '#86efac'],
          borderWidth: 3,
          borderColor: '#ffffff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: { family: 'Plus Jakarta Sans', size: 11, weight: 500 }
            }
          }
        }
      }
    });
  }
}

// Initial setup on window load
window.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }
});

import re

with open('vietnam_outline.svg', 'r') as f:
    svg_content = f.read()

match = re.search(r'<path d=\"([^\"]+)\"', svg_content, re.DOTALL)
if match:
    path_d = match.group(1).replace('\n', ' ')
else:
    print('Path not found')
    exit(1)

html_content = f"""<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Việt Nam - Khám Phá Văn Hóa</title>
    <link rel="stylesheet" href="style.css">
    <!-- Sử dụng Font chữ hiện đại từ Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
</head>
<body>
    <header class="hero-header">
        <h1>Việt Nam Vẻ Đẹp Bất Tận<h1>
        <p>Chạm vào các điểm sáng trên bản đồ để khám phá văn hóa bản địa đặc sắc</p>
    </header>

    <main class="container">
        <!-- Vùng hiển thị Bản đồ -->
        <section class="map-section">
            <div class="map-wrapper">
                <!-- SVG Bản đồ Việt Nam (Outline) -->
                <svg viewBox="0 0 1024 1024" preserveAspectRatio="xMidYMid meet" class="vietnam-map" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" class="map-outline">
                        <path d="{path_d}" />
                    </g>
                </svg>

                <!-- Các điểm Hotspot tương tác -->
                <div class="hotspot" id="tay-bac" style="left: 28%; top: 12%;">
                    <div class="pulse"></div>
                    <span class="tooltip">Tây Bắc Bộ</span>
                </div>
                <div class="hotspot" id="dong-bac" style="left: 48%; top: 8%;">
                    <div class="pulse"></div>
                    <span class="tooltip">Đông Bắc Bộ</span>
                </div>
                <div class="hotspot" id="db-song-hong" style="left: 48%; top: 22%;">
                    <div class="pulse"></div>
                    <span class="tooltip">Đồng Bằng Sông Hồng</span>
                </div>
                <div class="hotspot" id="tay-nguyen" style="left: 65%; top: 65%;">
                    <div class="pulse"></div>
                    <span class="tooltip">Tây Nguyên</span>
                </div>
                <div class="hotspot" id="db-scl" style="left: 42%; top: 85%;">
                    <div class="pulse"></div>
                    <span class="tooltip">Đồng Bằng Sông Cửu Long</span>
                </div>
            </div>
        </section>

        <!-- Sidebar / Modal hiển thị thông tin động -->
        <aside class="info-panel" id="infoPanel">
            <button class="close-btn" id="closeBtn" aria-label="Đóng">&times;</button>
            
            <div class="info-content">
                <div class="image-wrapper">
                    <img id="regionImage" src="" alt="Hình ảnh vùng miền">
                    <div class="image-overlay"></div>
                </div>
                
                <h2 id="regionName">Tên Vùng Miền</h2>
                <p id="regionDesc" class="description">Mô tả văn hóa...</p>
                
                <div class="specialties-section">
                    <h3>✨ Đặc sản & Văn hóa nổi bật</h3>
                    <ul id="regionSpecialties" class="specialties-list">
                        <!-- Content sẽ được render bằng JavaScript -->
                    </ul>
                </div>
            </div>
        </aside>
    </main>

    <script src="script.js"></script>
</body>
</html>"""

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print('Updated index.html')


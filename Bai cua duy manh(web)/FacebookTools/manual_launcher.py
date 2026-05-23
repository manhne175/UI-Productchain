import subprocess
import time
import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

# --- CẤU HÌNH ---
PROFILE_PATH = r"C:\Users\ADMIN\AppData\Local\Google\Chrome\User Data"
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe" # Đường dẫn mặc định của Chrome

def launch_chrome_debug():
    """
    Khởi động Chrome thủ công bằng dòng lệnh với cổng Debug 9222.
    Cách này ổn định hơn việc để Selenium tự mở Chrome.
    """
    cmd = [
        CHROME_PATH,
        f"--user-data-dir={PROFILE_PATH}",
        "--remote-debugging-port=9222",
        "--no-first-run",
        "--no-default-browser-check",
        "https://www.facebook.com/me/friends" # Mở sẵn trang bạn bè
    ]
    
    print("[*] Đang khởi động Chrome thủ công...")
    try:
        subprocess.Popen(cmd)
        print("[*] Chrome đã mở. Đợi 5 giây để load...")
        time.sleep(5)
    except FileNotFoundError:
        print(f"[ERROR] Không tìm thấy file Chrome tại: {CHROME_PATH}")
        print("Hãy kiểm tra lại xem Chrome cài ở đâu.")
        return False
    return True

def connect_selenium():
    """Kết nối Selenium vào Chrome đã mở sẵn."""
    print("[*] Đang kết nối Selenium vào Chrome...")
    options = Options()
    options.add_experimental_option("debuggerAddress", "127.0.0.1:9222")
    
    try:
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
        print("[OK] Kết nối thành công!")
        return driver
    except Exception as e:
        print(f"[FAIL] Không kết nối được: {e}")
        return None

# --- Main Test ---
if __name__ == "__main__":
    # 1. Kill Chrome cũ
    print("--- BƯỚC 1: DIỆT CHROME CŨ ---")
    os.system("taskkill /F /IM chrome.exe /T >nul 2>&1")
    time.sleep(2)
    
    # 2. Mở Chrome Debug
    print("\n--- BƯỚC 2: MỞ CHROME DEBUG ---")
    if launch_chrome_debug():
        # 3. Kết nối
        print("\n--- BƯỚC 3: KẾT NỐI SELENIUM ---")
        driver = connect_selenium()
        
        if driver:
            print("\n>>> MỌI THỨ ĐÃ SẴN SÀNG! <<<")
            print("Tiêu đề trang hiện tại:", driver.title)
            print("Bạn có thể dùng cách này để sửa file auto_unfriend.py")
            
            # Giữ cửa sổ để user xem
            input("\nBấm Enter để đóng...")
            driver.quit()

import subprocess
import time
import os
import shutil
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

# --- CẤU HÌNH ---
# Thử dùng một thư mục tạm bợ để xem có phải lỗi do Profile cũ bị hỏng không
TEMP_PROFILE = r"C:\TempChromeProfile"
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def launch_chrome_debug():
    if os.path.exists(TEMP_PROFILE):
        try:
            shutil.rmtree(TEMP_PROFILE)
        except:
            pass
    os.makedirs(TEMP_PROFILE, exist_ok=True)

    cmd = [
        CHROME_PATH,
        f"--user-data-dir={TEMP_PROFILE}", # Dùng profile tạm
        "--remote-debugging-port=9222",
        "--no-first-run",
        "--no-default-browser-check",
        "https://www.google.com"
    ]
    
    print("[*] Đang khởi động Chrome Profile TẠM (Test Only)...")
    subprocess.Popen(cmd)
    time.sleep(5)
    return True

def connect_selenium():
    print("[*] Đang kết nối Selenium...")
    options = Options()
    options.add_experimental_option("debuggerAddress", "127.0.0.1:9222")
    try:
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
        print("[OK] Kết nối thành công!")
        driver.get("https://facebook.com")
        return driver
    except Exception as e:
        print(f"[FAIL] Lỗi: {e}")
        return None

if __name__ == "__main__":
    os.system("taskkill /F /IM chrome.exe /T >nul 2>&1")
    launch_chrome_debug()
    connect_selenium()
    input("Enter to exit...")

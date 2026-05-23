import subprocess
import time
import datetime
import re
import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from dateutil import parser 

# --- CẤU HÌNH (CONFIGURATION) ---
DRY_RUN = True  # True = CHẠY THỬ (An toàn), False = CHẠY THẬT (Xóa bạn)

# ĐƯỜNG DẪN TUYỆT ĐỐI ĐẾN CHROME.EXE (Quan trọng)
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
# ĐƯỜNG DẪN PROFILE (Thay bằng đường dẫn của bạn)
PROFILE_PATH = r"C:\Users\ADMIN\AppData\Local\Google\Chrome\User Data"

MAX_DAILY_LIMIT = 20
INACTIVE_MONTHS = 24  # 2 năm
SCROLL_COUNT = 5

def launch_chrome_debug():
    """Khởi động Chrome thủ công với Port Debug 9222."""
    
    # 1. Kill Chrome cũ để tránh lỗi
    os.system("taskkill /F /IM chrome.exe /T >nul 2>&1")
    time.sleep(1)

    cmd = [
        CHROME_PATH,
        f"--user-data-dir={PROFILE_PATH}",
        "--remote-debugging-port=9222",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-notifications",
        # Các cờ chống crash
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "https://www.facebook.com/me/friends"
    ]
    
    print("[*] Đang khởi động Chrome... Vui lòng đợi 5-10 giây...")
    try:
        subprocess.Popen(cmd)
        time.sleep(8) # Đợi lâu một chút cho Chrome lên hẳn
        return True
    except Exception as e:
        print(f"[LỖI] Không mở được Chrome: {e}")
        return False

def setup_driver():
    """Kết nối Selenium vào Chrome đã mở."""
    print("[*] Đang kết nối Selenium vào Chrome...")
    options = Options()
    options.add_experimental_option("debuggerAddress", "127.0.0.1:9222")
    
    try:
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
        print("[OK] Kết nối thành công!")
        return driver
    except Exception as e:
        print(f"[LỖI KẾT NỐI] {e}")
        return None

def random_sleep(min_seconds=5, max_seconds=10):
    if DRY_RUN:
        sleep_time = min_seconds / 2
    else:
        sleep_time = random.uniform(min_seconds, max_seconds)
    print(f"[*] Nghỉ {sleep_time:.1f}s...", flush=True)
    time.sleep(sleep_time)

def get_friend_list(driver):
    print("[*] Đang quét danh sách bạn bè...", flush=True)
    # Nếu chưa ở trang bạn bè thì vào lại
    if "friends" not in driver.current_url:
        driver.get("https://www.facebook.com/me/friends")
        random_sleep(3, 5)

    friend_urls = set()
    for i in range(SCROLL_COUNT):
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        print(f"    - Cuộn trang {i+1}/{SCROLL_COUNT}...", flush=True)
        random_sleep(2, 3)

    print("[*] Đang trích xuất link...", flush=True)
    elements = driver.find_elements(By.XPATH, "//div[@role='list']//a[@href and @role='link']")
    
    for elem in elements:
        href = elem.get_attribute("href")
        if href and ("facebook.com" in href) and ("profile.php" in href or "facebook.com/" in href):
            if any(x in href for x in ["friends_mutual", "about", "photos", "map", "groups"]):
                continue
            
            if "profile.php" in href:
                clean_url = href.split('&')[0]
            else:
                clean_url = href.split('?')[0]
            friend_urls.add(clean_url)

    print(f"[*] Tìm thấy {len(friend_urls)} bạn bè.", flush=True)
    return list(friend_urls)

def parse_facebook_date(date_str):
    if not date_str: return None
    now = datetime.datetime.now()
    date_str = date_str.lower()
    try:
        if any(x in date_str for x in ["just now", "vừa xong", "min", "phút", "hr", "giờ"]):
            return now
        if "yesterday" in date_str or "hôm qua" in date_str:
            return now - datetime.timedelta(days=1)
        if "day" in date_str or "ngày" in date_str or "d" in date_str:
             match = re.search(r'\d+', date_str)
             if match: return now - datetime.timedelta(days=int(match.group()))
        return parser.parse(date_str, fuzzy=True)
    except:
        return None

def is_user_inactive(driver, profile_url):
    print(f"[*] Checking: {profile_url}", flush=True)
    driver.get(profile_url)
    random_sleep(3, 5)
    driver.execute_script("window.scrollTo(0, 1000);")
    random_sleep(2, 4)

    try:
        post_links = driver.find_elements(By.XPATH, "//a[contains(@href, '/posts/') or contains(@href, '/photo')]//span")
        if not post_links:
             post_links = driver.find_elements(By.XPATH, "//a[contains(@href, '/posts/') or contains(@href, '/photo')]")

        valid_dates = []
        count = 0
        for link in post_links:
            if count >= 3: break
            text = link.text.strip()
            label = link.get_attribute("aria-label")
            date_val = parse_facebook_date(text) or parse_facebook_date(label)
            if date_val:
                valid_dates.append(date_val)
                count += 1
        
        if not valid_dates:
            print("    [?] Không thấy bài đăng. -> Bỏ qua.", flush=True)
            return False

        latest_date = max(valid_dates)
        cutoff_date = datetime.datetime.now() - datetime.timedelta(days=INACTIVE_MONTHS*30)
        
        print(f"    [i] Bài cuối: {latest_date.strftime('%d/%m/%Y')}", flush=True)
        
        if latest_date < cutoff_date:
            print(f"    [!] KHÔNG HOẠT ĐỘNG quá {INACTIVE_MONTHS} tháng.", flush=True)
            return True
        else:
            print(f"    [OK] Vẫn hoạt động.", flush=True)
            return False

    except Exception as e:
        print(f"    [ERROR] {e}", flush=True)
        return False

def highlight_element(driver, element):
    driver.execute_script("arguments[0].style.border='3px solid red'", element)

def unfriend_user(driver, profile_url):
    try:
        if driver.current_url != profile_url:
            driver.get(profile_url)
            random_sleep(2, 3)

        wait = WebDriverWait(driver, 10)

        print("    [*] Tìm nút Bạn bè...", flush=True) 
        friends_btns = driver.find_elements(By.XPATH, "//div[@role='button']//img[contains(@src, 'friend')]//ancestor::div[@role='button']")
        
        target_btn = None
        for btn in friends_btns:
            try:
                if btn.is_displayed():
                    target_btn = btn
                    break
            except: continue
        
        if not target_btn:
             try:
                 target_btn = driver.find_element(By.XPATH, "//div[@aria-label='Friends' or @aria-label='Bạn bè']")
             except:
                 print("    [-] Không tìm thấy nút Bạn bè.", flush=True)
                 return False

        if DRY_RUN:
            highlight_element(driver, target_btn)
            print("    [DRY RUN] Đã tìm thấy nút & Bôi đỏ.", flush=True)
            random_sleep(1, 2)
            return True

        target_btn.click()
        random_sleep(1, 2)

        print("    [*] Chọn Hủy kết bạn...", flush=True)
        unfriend_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//span[contains(text(), 'Unfriend') or contains(text(), 'Hủy kết bạn')]")))
        unfriend_btn.click()
        random_sleep(1, 2)

        print("    [*] Xác nhận...", flush=True)
        confirm_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//div[@aria-label='Confirm' or @aria-label='Xác nhận']")))
        confirm_btn.click()
        
        print(f"    [REAL RUN] ĐÃ HỦY KẾT BẠN THÀNH CÔNG.", flush=True)
        return True

    except Exception as e:
        print(f"    [-] Lỗi: {e}", flush=True)
        return False

def main():
    mode = "CHẠY THỬ" if DRY_RUN else "CHẠY THẬT"
    print(f"=== FACEBOOK CLEANER: {mode} ===", flush=True)
    
    # 1. Khởi động Chrome thủ công (Ổn định hơn)
    if not launch_chrome_debug():
        return

    # 2. Kết nối Selenium
    driver = setup_driver()
    if not driver:
        return
    
    count = 0
    try:
        all_friends = get_friend_list(driver)
        start_time = time.time()
        
        for friend_url in all_friends:
            if count >= MAX_DAILY_LIMIT:
                print(f"[STOP] Đạt limit {MAX_DAILY_LIMIT}.", flush=True)
                break
            
            if time.time() - start_time > 600:
                print("[WAIT] Nghỉ 5 phút...", flush=True)
                time.sleep(300)
                start_time = time.time()

            if is_user_inactive(driver, friend_url):
                if unfriend_user(driver, friend_url):
                    count += 1
                    random_sleep(20, 60) if not DRY_RUN else random_sleep(2, 4)
            else:
                random_sleep(1, 3)

    except KeyboardInterrupt:
        print("\n[STOP] Dừng script.", flush=True)
    finally:
        # Không quit driver để giữ Chrome mở cho lần sau đỡ phải load lại
        print("[DONE] Hoàn tất.", flush=True)

if __name__ == "__main__":
    main()

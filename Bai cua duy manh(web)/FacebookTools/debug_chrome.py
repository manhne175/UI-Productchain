from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

def test_launch(name, options):
    print(f"\n--- TEST: {name} ---")
    try:
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
        print("[OK] Chrome launched successfully!")
        time.sleep(2)
        driver.quit()
        print("[OK] Chrome closed.")
        return True
    except Exception as e:
        print(f"[FAIL] Error: {e}")
        return False

# 1. Test Vanilla with Fix Flags
print("=" * 50)
print("TESTING CHROME LAUNCH")
print("=" * 50)

opt1 = Options()
opt1.add_argument("--no-sandbox")
opt1.add_argument("--disable-dev-shm-usage")
opt1.add_argument("--disable-gpu")
test_launch("Vanilla + Fix Flags (No Profile)", opt1)

# 2. Test with Profile
PROFILE_PATH = r"C:\Users\ADMIN\AppData\Local\Google\Chrome\User Data" 
PROFILE_DIRECTORY = "Profile 2"  # Change as needed

opt2 = Options()
opt2.add_argument(f"user-data-dir={PROFILE_PATH}")
opt2.add_argument(f"--profile-directory={PROFILE_DIRECTORY}")
opt2.add_argument("--no-sandbox")
opt2.add_argument("--disable-dev-shm-usage")
opt2.add_argument("--disable-gpu")
opt2.add_argument("--remote-debugging-port=9222")
test_launch(f"With Profile: {PROFILE_DIRECTORY}", opt2)

input("\nPress Enter to exit...")

import tkinter as tk
from tkinter import scrolledtext
import threading
import time
import cv2
import numpy as np
import mss
import pydirectinput
import os
import sys
import random
# Điều hướng thư mục làm việc về thư mục chứa file script
base_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(base_dir)

class FCOnlineBotApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Auto Giả Lập Xếp Hạng - FC Online")
        self.root.geometry("400x500")
        self.root.resizable(False, False)
        
        # Biến trạng thái
        self.is_running = False
        self.thread = None
        
        # Thư mục chứa ảnh mẫu (người dùng tự thêm ảnh vào đây)
        self.templates_dir = os.path.join(base_dir, "templates_img")
        if not os.path.exists(self.templates_dir):
            os.makedirs(self.templates_dir)
            
        # Nạp ảnh template (Sẽ load trong lúc chạy)
        self.templates = {}
        
        self.setup_ui()
        self.log("Ứng dụng khởi động thành công.")
        self.log(f"Hãy đặt các ảnh (bat_dau.png, tiep_tuc.png...) vào: \n{self.templates_dir}")

    def setup_ui(self):
        # Tiêu đề
        lbl_title = tk.Label(self.root, text="Bot Giả Lập FC Online", font=("Helvetica", 16, "bold"), fg="blue")
        lbl_title.pack(pady=10)
        
        # Trạng thái
        self.lbl_status = tk.Label(self.root, text="Trạng thái: ĐANG DỪNG", font=("Arial", 12), fg="red")
        self.lbl_status.pack(pady=5)
        
        # Các nút điều khiển
        frame_buttons = tk.Frame(self.root)
        frame_buttons.pack(pady=10)
        
        self.btn_start = tk.Button(frame_buttons, text="Bắt Đầu (Start)", command=self.start_bot, font=("Arial", 12), bg="green", fg="white", width=12)
        self.btn_start.pack(side=tk.LEFT, padx=10)
        
        self.btn_stop = tk.Button(frame_buttons, text="Dừng (Stop)", command=self.stop_bot, font=("Arial", 12), bg="red", fg="white", width=12, state=tk.DISABLED)
        self.btn_stop.pack(side=tk.LEFT, padx=10)
        
        # Khu vực nhật ký
        lbl_log = tk.Label(self.root, text="Nhật ký hoạt động:", font=("Arial", 10))
        lbl_log.pack(anchor=tk.W, padx=20, pady=(10, 0))
        
        self.txt_log = scrolledtext.ScrolledText(self.root, width=45, height=15, font=("Consolas", 9), state='disabled')
        self.txt_log.pack(padx=20, pady=5)
        
    def log(self, message):
        """Hàm in thông báo ra màn hình nhật ký một cách an toàn"""
        def update_log():
            self.txt_log.config(state='normal')
            timestamp = time.strftime("[%H:%M:%S] ")
            self.txt_log.insert(tk.END, timestamp + message + "\n")
            self.txt_log.see(tk.END)
            self.txt_log.config(state='disabled')
        # Đẩy vào hàng đợi update UI của tkinter
        self.root.after(0, update_log)
        
    def load_templates(self):
        """Load các file ảnh mẫu vào bộ nhớ"""
        self.templates = {}
        for filename in os.listdir(self.templates_dir):
            if filename.endswith(".png"):
                filepath = os.path.join(self.templates_dir, filename)
                # Đọc ảnh xám (grayscale)
                img = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)
                if img is not None:
                    name = filename.split('.')[0]
                    self.templates[name] = img
                    self.log(f"Đã load ảnh mẫu: {filename}")
                else:
                    self.log(f"Lỗi đọc ảnh: {filename}")
                    
        if not self.templates:
            self.log("CẢNH BÁO: Không có ảnh .png nào trong thư mục templates_img. Bot sẽ không click được gì!")
            return False
        return True

    def bot_loop(self):
        """Tiến trình chính của Bot quét ảnh và click"""
        self.log("--- Bắt đầu quét màn hình ---")
        
        # Khởi tạo công cụ chụp màn hình
        with mss.mss() as sct:
            import pygetwindow as gw
            game_window = None
            max_area = 0
            
            # Quét tìm cửa sổ Game (Bỏ qua các cửa sổ của Garena Launcher bé bé)
            for w in gw.getAllWindows():
                if "fc online" in w.title.lower() or "fifa" in w.title.lower():
                    area = w.width * w.height
                    if area > max_area and w.width > 600: # Cửa sổ game thường to hơn 600px
                        max_area = area
                        game_window = w
                    
            if game_window:
                self.log(f"🎯 Đã khóa theo Cửa sổ: '{game_window.title}' ({game_window.width}x{game_window.height})")
            else:
                self.log("⚠️ Không quét thấy cửa sổ game FC Online riêng lẻ. Mặc định quét Toàn màn hình.")
                
            threshold = 0.8 # Độ chính xác khi khớp ảnh (80%)
            scan_count = 0 # Biến đếm số lần quét để hiện log cho người dùng khỏi sốt ruột
            
            while self.is_running:
                try:
                    # Liên tục mỏ rộng/thu hẹp khung quét theo cửa sổ Game khi nó di chuyển
                    if game_window and game_window.width > 0 and game_window.height > 0:
                        monitor = {
                            "left": game_window.left, 
                            "top": game_window.top, 
                            "width": game_window.width, 
                            "height": game_window.height
                        }
                    else:
                        monitor = sct.monitors[1] # Dự phòng màn hình chính
                        
                    # 1. Chụp màn hình (Chỉ khu vực Game)
                    screenshot = sct.grab(monitor)
                    scan_count += 1
                    
                    if scan_count % 15 == 0:
                        self.log("... Máy quay vẫn đang liên tục quét tìm các nút (Chưa thấy) ...")
                        
                    # Chuyển đổi sang format OpenCV (BGRA -> BGR -> Gray)
                    img_np = np.array(screenshot)
                    img_gray = cv2.cvtColor(img_np, cv2.COLOR_BGRA2GRAY)
                    
                    # Biến kiểm tra xem vòng lặp này có click trúng gì không
                    any_found = False
                    
                    # 2. Duyệt qua từng template để tìm kiếm
                    for temp_name, temp_img in self.templates.items():
                        if not self.is_running:
                            break
                            
                        res = cv2.matchTemplate(img_gray, temp_img, cv2.TM_CCOEFF_NORMED)
                        loc = np.where(res >= threshold)
                        
                        found = False
                        # Lấy tọa độ điểm đầu tiên khớp (nếu có)
                        for pt in zip(*loc[::-1]):
                            found = True
                            h, w = temp_img.shape
                            # Lấy tọa độ tuyệt đối (Absolute Desktop Coordinates) khi quét bằng mss
                            # Thêm yếu tố ngẫu nhiên (Humanizer) để click lệch tâm 1 chút
                            jitter_x = random.randint(-w//4, w//4)
                            jitter_y = random.randint(-h//4, h//4)
                            global_x = monitor["left"] + pt[0] + w // 2 + jitter_x
                            global_y = monitor["top"] + pt[1] + h // 2 + jitter_y
                            
                            self.log(f"📍 Đã phát hiện nút: {temp_name}...")
                            
                            # Xử lý các trường hợp ấn phím đặc biệt thay vì click chuột
                            if 'space' in temp_name.lower():
                                self.log("🔠 Thực hiện tự động ấn SPACE!")
                                pydirectinput.keyDown('space')
                                time.sleep(random.uniform(0.08, 0.2)) # Nhấn giữ phím Space ngẫu nhiên (80ms - 200ms)
                                pydirectinput.keyUp('space')
                            elif 'esc' in temp_name.lower():
                                self.log("🔙 Thực hiện tự động ấn nút ESC để tắt bảng/thoát!")
                                pydirectinput.keyDown('esc')
                                time.sleep(random.uniform(0.08, 0.2)) # Nhấn giữ phím ESC ngẫu nhiên
                                pydirectinput.keyUp('esc')
                            elif 'enter' in temp_name.lower():
                                self.log("✅ Thực hiện tự động ấn ENTER!")
                                pydirectinput.keyDown('enter')
                                time.sleep(random.uniform(0.08, 0.2)) 
                                pydirectinput.keyUp('enter')
                            else:
                                self.log("🖱 Đang click chuột...")
                                # Di chuyển chuột và Click
                                # Sử dụng MoveTo rõ ràng cho DirectX game
                                pydirectinput.moveTo(global_x, global_y)
                                time.sleep(random.uniform(0.05, 0.15))  # Đợi ngẫu nhiên trước khi click
                                
                                # Tách riêng MouseDown và MouseUp thay vì click tức thì
                                pydirectinput.mouseDown()
                                time.sleep(random.uniform(0.08, 0.2)) # Giữ chuột ngẫu nhiên từ 80ms - 200ms
                                pydirectinput.mouseUp()
                            
                            time.sleep(random.uniform(0.8, 1.5)) # Nghỉ 0.8 đến 1.5 giây sau khi bấm xong
                            
                            break # Chỉ click 1 lần rồi chuyển ảnh khác
                            
                        # Nếu đã click được 1 nút rồi thì thoát vòng lặp ảnh ngay, không rà soát các ảnh còn lại nữa
                        if found:
                            any_found = True
                            break
                            
                    # Tạm ngưng giữa các chu kỳ để chống lag máy (nghỉ 3 giây)
                    if self.is_running:
                        if any_found:
                            # Nếu vừa click xong, đợi game chuyển cảnh (nghỉ lâu hơn)
                            time.sleep(random.uniform(2.0, 3.5))
                        else:
                            # Nếu không thấy nút nào, quét lặp lại nhanh hơn
                            time.sleep(random.uniform(1.0, 1.5))
                        
                except Exception as e:
                    self.log(f"Lỗi: {str(e)}")
                    time.sleep(2)
                
        self.log("--- Đã dừng quét màn hình ---")

    def start_bot(self):
        """Xử lý nút Bắt đầu"""
        if self.is_running:
            return
            
        success = self.load_templates()
        if not success:
            self.log("Vui lòng thêm ảnh nút bấm và thử lại.")
            
        # Bắt đầu chạy
        self.is_running = True
        self.lbl_status.config(text="Trạng thái: ĐANG CHẠY", fg="green")
        self.btn_start.config(state=tk.DISABLED)
        self.btn_stop.config(state=tk.NORMAL)
        
        self.thread = threading.Thread(target=self.bot_loop)
        self.thread.daemon = True
        self.thread.start()
        
    def stop_bot(self):
        """Xử lý nút Dừng"""
        self.is_running = False
        self.lbl_status.config(text="Trạng thái: ĐANG DỪNG", fg="red")
        self.btn_start.config(state=tk.NORMAL)
        self.btn_stop.config(state=tk.DISABLED)

if __name__ == "__main__":
    root = tk.Tk()
    app = FCOnlineBotApp(root)
    root.mainloop()

# 🚀 Hướng dẫn cài đặt DocShare trên VPS

## Cấu trúc thư mục
```
docshare/
├── .env                    # Biến môi trường
├── package.json
├── ecosystem.config.js     # Cấu hình PM2
├── src/                    # Backend source code
│   └── server.js           # Entry point
├── public/                 # Giao diện web
└── data/                   # Thư mục lưu dữ liệu
    ├── documents.json      # Database (tự tạo khi chạy)
    └── uploads/            # Thư mục lưu file (tự tạo)
```

---

## Bước 1: Cài đặt Node.js, Redis và MongoDB

Dự án yêu cầu **Node.js**, **Redis** (cho cache, rate-limit, session) và **MongoDB** (database).

### Cách 1: Cài đặt trực tiếp trên Ubuntu/Debian (Khuyến nghị)

```bash
# 1. Cài Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Cài Redis
sudo apt-get install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

# 3. Cài MongoDB (Phiên bản 6.0)
sudo apt-get install -y gnupg curl
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl enable mongod
sudo systemctl start mongod
```

### Cách 2: Chạy Redis & MongoDB qua Docker Compose
Nếu VPS đã có sẵn Docker, bạn có thể chạy lệnh sau (sau khi upload code ở Bước 2):
```bash
docker-compose up -d mongodb redis
```

---

## Bước 2: Upload code lên VPS

```bash
# Trên máy local — dùng scp hoặc rsync
scp -r ./docshare user@YOUR_VPS_IP:/home/user/

# Hoặc dùng git nếu đã push lên GitHub
ssh user@YOUR_VPS_IP
git clone https://github.com/yourname/docshare.git
```

---

## Bước 3: Cài dependencies & Cấu hình

```bash
cd /home/user/docshare
npm install

# Tạo file cấu hình môi trường
cp .env.example .env
# (Tùy chọn) Chỉnh sửa .env nếu cần thay đổi port hoặc thư mục lưu trữ
# nano .env
```

---

## Bước 4: Chạy thử

```bash
npm run dev
# Hoặc chạy production: npm start
# Mở: http://YOUR_VPS_IP:3000
```

---

## Bước 5: Chạy nền với PM2 (khuyến nghị)

Dự án đã có sẵn cấu hình `ecosystem.config.js` với chế độ cluster mode giúp tận dụng tối đa CPU.

```bash
# Cài PM2
npm install -g pm2

# Khởi chạy dự án
pm2 start ecosystem.config.js

# Tự chạy khi reboot VPS
pm2 startup
pm2 save

# Xem logs
pm2 logs docshare-api

# Khởi động lại
pm2 restart docshare-api
```

---

## Bước 6 (Tùy chọn): Cấu hình Nginx + HTTPS

### Cài Nginx
```bash
sudo apt install nginx -y
```

### Tạo config
```bash
sudo nano /etc/nginx/sites-available/docshare
```

Dán nội dung:
```nginx
server {
    listen 80;
    server_name yourdomain.com;  # hoặc IP

    client_max_body_size 100M;   # Cho phép upload tối đa 100MB

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Kích hoạt
```bash
sudo ln -s /etc/nginx/sites-available/docshare /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Cài SSL miễn phí (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

---

## Mở port Firewall (nếu cần)

```bash
sudo ufw allow 3000   # Nếu dùng trực tiếp
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

---

## Bảo mật (Tùy chọn nâng cao)

Để thêm mật khẩu bảo vệ trang upload, thêm vào `src/app.js` (hoặc `src/server.js`):

```javascript
// Basic auth middleware
const ADMIN_PASS = 'your_password_here';
app.use('/api/upload', (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== 'Bearer ' + ADMIN_PASS) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

---

## Thay đổi port

Chỉnh sửa trong file `.env`:
```env
PORT=8080
```

Hoặc chạy với port khác qua PM2:
```bash
PORT=8080 pm2 start ecosystem.config.js
```

---

## Thêm danh mục mới

Mở `public/index.html`, tìm `<select id="categoryInput">` và thêm:
```html
<option value="Danh mục mới">Danh mục mới</option>
```

---

✅ Xong! Truy cập `http://YOUR_VPS_IP:3000` hoặc domain của bạn.

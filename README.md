# 📄 DocShare

Hệ thống chia sẻ tài liệu nội bộ — upload, xem trực tiếp và quản lý tài liệu qua giao diện web.

## ✨ Tính năng

- 📤 Upload file qua drag & drop hoặc click chọn
- 👁 Xem trực tiếp PDF, ảnh, text trong browser
- 📂 Phân loại tài liệu theo danh mục
- 🔍 Tìm kiếm theo tên và mô tả
- ⬇️ Download với tên file gốc (hỗ trợ tiếng Việt)
- 📊 Thống kê số lượng, dung lượng, lượt tải

## 🚀 Cài đặt

```bash
# Clone project
git clone <repo-url>
cd docshare

# Cài dependencies
npm install

# Tạo file .env (hoặc copy từ .env.example)
cp .env.example .env

# Chạy development
npm run dev

# Chạy production
npm start
```

Mở browser: [http://localhost:3000](http://localhost:3000)

## 📁 Cấu trúc dự án

```
docshare/
├── .env                    # Biến môi trường
├── .env.example            # Template .env
├── package.json
├── README.md
│
├── src/                    # Backend source code
│   ├── server.js           # Entry point
│   ├── app.js              # Express app setup
│   ├── config/             # Config & constants
│   ├── routes/             # API route definitions
│   ├── controllers/        # Business logic
│   ├── middleware/          # Multer, error handler
│   └── utils/              # Helpers & data access
│
├── public/                 # Frontend static files
│   ├── index.html
│   ├── css/styles.css
│   └── js/app.js
│
├── data/                   # Data (gitignored)
│   ├── documents.json
│   └── uploads/
│
└── docs/                   # Documentation
    └── deployment.md
```

## ⚙️ Cấu hình

Chỉnh sửa file `.env`:

| Biến | Mô tả | Mặc định |
|------|--------|----------|
| `PORT` | Port server | `3000` |
| `UPLOAD_DIR` | Thư mục lưu file | `./data/uploads` |
| `DATA_FILE` | File metadata | `./data/documents.json` |
| `MAX_FILE_SIZE` | Giới hạn upload (bytes) | `104857600` (100MB) |

## 📖 Hướng dẫn deploy

Xem chi tiết: [docs/deployment.md](docs/deployment.md)

## 📝 License

MIT

# HƯỚNG DẪN STAFF DASHBOARD

## 📋 Mô tả dự án
Staff Dashboard là hệ thống quản lý dành cho nhân viên (staff), cho phép xử lý đơn hàng, quản lý kho hàng, và theo dõi công việc hàng ngày.

## 🚀 Cài đặt

### 1. Cài đặt Node.js
- Tải Node.js từ: https://nodejs.org/
- Phiên bản yêu cầu: Node.js >= 16.0.0, npm >= 8.0.0

### 2. Cài đặt dependencies
```bash
cd staff
npm install
```

### 3. Chạy ứng dụng
```bash
# Chạy môi trường development (cổng 5175)
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

## 📁 Cấu trúc thư mục

```
staff/
├── public/              # Thư mục chứa các file tĩnh (static)
├── src/
│   ├── api/            # Cấu hình API
│   │   ├── axiosClient.ts    # Cấu hình Axios
│   │   └── endpoints/        # Các endpoint API
│   ├── assets/         # Hình ảnh, fonts, icons
│   ├── components/     # React components
│   │   ├── common/     # Components dùng chung
│   │   └── layout/     # Layout components (Header, Sidebar, Footer)
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Các trang chính của ứng dụng
│   ├── routes/         # Cấu hình routes
│   │   ├── auth/       # Trang đăng nhập, đăng ký
│   │   └── home/       # Trang chủ
│   ├── styles/         # CSS files
│   ├── App.tsx         # Root component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies và scripts
├── tsconfig.json       # TypeScript config
├── tsconfig.node.json  # TypeScript config cho Node
└── vite.config.ts      # Vite config
```

## 🛠️ Công nghệ sử dụng

- **React 18.3.1**: Thư viện UI
- **TypeScript 5.2.2**: Ngôn ngữ lập trình
- **Vite 7.1.9**: Build tool
- **React Router 6.30.1**: Routing
- **Axios 1.6.2**: HTTP client

## 📝 Hướng dẫn phát triển

### Thêm component mới
1. Tạo file trong `src/components/`
2. Import và sử dụng trong các pages

### Thêm route mới
1. Tạo component trong `src/routes/` hoặc `src/pages/`
2. Thêm route vào `src/App.tsx`

### Gọi API
1. Cấu hình endpoint trong `src/api/endpoints/`
2. Sử dụng `axiosClient` để gọi API

### Thêm styling
- Tạo file CSS riêng cho component
- Import CSS file vào component
- Hoặc sử dụng inline styles

## 🌐 Cấu hình
- **Port**: 5175 (development)
- **Backend API**: Cấu hình trong `src/api/axiosClient.ts`

## 📦 Scripts

```bash
# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔐 Authentication
- Đăng nhập: `/login`
- Đăng ký: `/register`
- Session quản lý bằng JWT token (localStorage)

## 📞 Liên hệ
- Team: SE347-Team9
- Repository: https://github.com/SE347-Team9/admin

# TODO App

Ứng dụng quản lý công việc (TODO App) được xây dựng với Nx monorepo, bao gồm backend API (NestJS) và frontend (React).

## 🏗️ Kiến trúc

```
TO-DO-APP/
├── apps/
│   ├── backend/          # NestJS API Server
│   ├── frontend/         # React Application
│   └── env/             # Environment configurations
└── libs/                # Shared libraries
```

## 🚀 Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: MongoDB (Mongoose)
- **Language**: TypeScript
- **Build Tool**: Webpack

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Build Tool**: Webpack

### Monorepo
- **Tool**: Nx 22.5.4

## 📋 Tính năng

### Backend Modules
- **Auth**: Xác thực và phân quyền người dùng
- **User**: Quản lý thông tin người dùng
- **Task**: Quản lý công việc (CRUD operations)
- **Database**: Kết nối MongoDB với query optimization
- **Worker**: Background job processing

### Core Features
- ✅ Tạo, sửa, xóa công việc
- ✅ Quản lý trạng thái công việc
- ✅ Xác thực người dùng
- ✅ Query optimization và monitoring
- ✅ Password validation với ký tự đặc biệt

## 🛠️ Cài đặt

### Yêu cầu
- Node.js >= 18
- npm hoặc yarn
- MongoDB

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd TO-DO-APP
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Cấu hình môi trường
Tạo file `.env` trong thư mục `apps/env/`:

```env
# Database
AUTH_DATABASE_URL=mongodb://localhost:27017/todo-app

# Server
PORT=3000

# JWT (nếu có)
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

## 🏃 Chạy ứng dụng

### Development Mode

#### Chạy Backend
```bash
npx nx serve backend
```
Backend sẽ chạy tại: `http://localhost:3000/api`

#### Chạy Frontend
```bash
npx nx serve frontend
```
Frontend sẽ chạy tại: `http://localhost:4200`

#### Chạy cả hai cùng lúc
```bash
npx nx run-many --target=serve --projects=backend,frontend
```

### Production Build

#### Build Backend
```bash
npx nx build backend --configuration=production
```

#### Build Frontend
```bash
npx nx build frontend --configuration=production
```

## 🧪 Testing

```bash
# Run tests cho tất cả projects
npx nx run-many --target=test --all

# Run tests cho backend
npx nx test backend

# Run tests cho frontend
npx nx test frontend
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất

### Tasks
- `GET /api/tasks` - Lấy danh sách công việc
- `GET /api/tasks/:id` - Lấy chi tiết công việc
- `POST /api/tasks` - Tạo công việc mới
- `PUT /api/tasks/:id` - Cập nhật công việc
- `DELETE /api/tasks/:id` - Xóa công việc

### Users
- `GET /api/users/profile` - Lấy thông tin profile
- `PUT /api/users/profile` - Cập nhật profile

## 🔒 Password Validation

Password phải đáp ứng các yêu cầu sau:
- Tối thiểu 8 ký tự
- Có ít nhất 1 chữ thường (a-z)
- Có ít nhất 1 chữ hoa (A-Z)
- Có ít nhất 1 số (0-9)
- Có ít nhất 1 ký tự đặc biệt (!@#$%^&*...)

## 📦 Project Structure

### Backend
```
apps/backend/src/
├── app/              # App module chính
├── modules/          # Feature modules
│   ├── auth/        # Authentication
│   ├── user/        # User management
│   ├── task/        # Task management
│   ├── database/    # Database configuration
│   └── worker/      # Background jobs
├── common/          # Shared utilities
├── configs/         # Configuration files
├── entities/        # Database entities
├── middlewares/     # Custom middlewares
├── types/           # TypeScript types
└── utils/           # Helper functions
```

### Frontend
```
apps/frontend/src/
├── app/             # React components
├── assets/          # Static assets
└── styles.css       # Global styles
```

## 🤝 Contributing

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

[MIT License](LICENSE)

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- NestJS Documentation
- React Documentation
- Nx Documentation
# To-Do-App

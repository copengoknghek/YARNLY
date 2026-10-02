# YARNLY

Website thương mại điện tử bán len và phụ kiện đan móc.

- **Frontend:** React 19 + Vite + TypeScript, React Router, Axios
- **Backend:** Node.js + Express 5, express-validator

## Yêu cầu

- Node.js 22.12 trở lên
- npm 10 trở lên

## Cài đặt và chạy

Mở hai terminal, một cho backend và một cho frontend.

```bash
# Terminal 1 - Backend (http://localhost:5000/api)
cd backend
npm install
cp .env.example .env
npm run dev
```

```bash
# Terminal 2 - Frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```

Trong môi trường dev, Vite tự chuyển tiếp mọi request `/api` sang backend `http://localhost:5000`, nên frontend không cần file `.env`. Chỉ tạo `frontend/.env` (từ `.env.example`) khi muốn trỏ tới một API khác.

### Font NVN January

Tiêu đề dùng font `NVN January` theo Figma. Đặt file font vào `frontend/public/fonts/` với tên `NVNJanuary.woff2` (hoặc `.woff`, `.ttf`, `.otf`). Khi chưa có file, trang tự dùng font dự phòng `Paytone One` và lúc build sẽ có cảnh báo `didn't resolve at build time`, không ảnh hưởng kết quả.

### Figma MCP (tùy chọn)

Sao chép `.cursor/mcp.example.json` thành `.cursor/mcp.json` rồi điền `FIGMA_API_KEY`. File `mcp.json` đã nằm trong `.gitignore` nên key không bị commit.

## Scripts

| Thư mục    | Lệnh            | Mô tả                                  |
| ---------- | --------------- | -------------------------------------- |
| `frontend` | `npm run dev`   | Chạy dev server có hot reload          |
| `frontend` | `npm run build` | Kiểm tra type và build production      |
| `frontend` | `npm run lint`  | Kiểm tra code với oxlint               |
| `backend`  | `npm run dev`   | Chạy API với nodemon (tự restart)      |
| `backend`  | `npm start`     | Chạy API ở chế độ production           |
| `backend`  | `npm test`      | Chạy test với Node test runner         |

## Cấu trúc thư mục

```
YARNLY/
├── frontend/
│   ├── public/                  # File tĩnh, không qua build
│   │   ├── fonts/               # Font NVN January
│   │   └── images/              # Logo, ảnh sản phẩm, icon thanh toán, cờ, social
│   └── src/
│       ├── assets/              # Ảnh, font, icon import trong code
│       ├── styles/              # Toàn bộ CSS, tách riêng khỏi component
│       │   ├── global/          # reset, variables, typography
│       │   ├── components/      # CSS cho từng component
│       │   └── pages/           # CSS cho từng trang: buyer/, seller/, admin/
│       ├── components/
│       │   ├── common/          # UI dùng chung: Button, Input, Select, Icon, PageBanner...
│       │   ├── layout/          # BuyerLayout, SellerLayout, AdminLayout, Header, Footer
│       │   └── features/        # Theo tính năng: product, cart, checkout, order, auth...
│       ├── pages/
│       │   ├── buyer/           # Các trang cho người mua (theo Figma)
│       │   ├── seller/          # Trang người bán (đang để trống)
│       │   └── admin/           # Trang quản trị (đang để trống)
│       ├── context/             # State toàn cục (Auth, Cart)
│       ├── hooks/               # Custom hooks (useAuth, useCart, useFetch)
│       ├── services/            # Gọi API backend
│       ├── types/               # TypeScript interfaces
│       ├── utils/               # Hàm tiện ích
│       ├── constants/           # Hằng số (routes, categories, navigation...)
│       ├── routes/              # Cấu hình React Router, RequireRole
│       ├── App.tsx
│       └── main.tsx
│
├── backend/
│   ├── src/
│   │   ├── config/              # Biến môi trường, kết nối database
│   │   ├── routes/              # Khai báo endpoint
│   │   ├── controllers/         # Nhận request, trả response
│   │   ├── services/            # Business logic
│   │   ├── models/              # Dữ liệu (đang dùng in-memory)
│   │   ├── middleware/          # auth, validate, errorHandler
│   │   ├── validators/          # Rule kiểm tra dữ liệu đầu vào
│   │   ├── utils/               # logger, helpers
│   │   ├── app.js               # Cấu hình Express
│   │   └── server.js            # Điểm khởi chạy
│   └── tests/
│
└── docs/                        # Tài liệu dự án
```

Luồng xử lý một request ở backend: `routes` → `middleware` (validate, auth) → `controllers` → `services` → `models`.

## Quy ước

### CSS

Mọi CSS nằm trong `frontend/src/styles/`, không viết CSS trong file `.tsx`. Mỗi component hoặc trang import đúng file CSS của nó, ví dụ `ProductCard.tsx` import `@/styles/components/ProductCard.css`. Màu sắc, khoảng cách, font và bo góc lấy từ biến trong `styles/global/variables.css`. Tên class theo kiểu BEM: `block__element--modifier`.

### Đặt tên

| Loại             | Quy tắc                     | Ví dụ                  |
| ---------------- | --------------------------- | ---------------------- |
| Component folder | PascalCase                  | `ProductCard/`         |
| Component file   | PascalCase.tsx              | `ProductCard.tsx`      |
| CSS file         | PascalCase.css              | `ProductCard.css`      |
| Hook             | camelCase, tiền tố `use`    | `useCart.ts`           |
| Service          | camelCase, hậu tố `Service` | `productService.ts`    |
| Backend file     | camelCase                   | `productController.js` |
| API route        | kebab-case                  | `/api/products`        |

### Import

Frontend dùng alias `@/` trỏ tới `frontend/src/`, ví dụ `import Button from '@/components/common/Button'`.

## Vai trò người dùng

- `admin`: quản trị, vào `/admin`.
- `user` gồm hai loại `userType`: `buyer` (người mua) và `seller` (người bán, vào `/seller`).

`RequireRole` trong `src/routes/` chặn route theo vai trò: chưa đăng nhập thì chuyển tới trang đăng nhập, sai vai trò thì về trang chủ. Hiện chỉ giao diện người mua được làm theo Figma; trang seller và admin mới có khung trống.

## Trạng thái hiện tại

- Trang người mua đã chạy được: trang chủ, sản phẩm (lọc, sắp xếp, phân trang), chi tiết sản phẩm (chọn màu, size, thời gian làm), thiết kế riêng, blind box, giỏ hàng (lưu ở trình duyệt), thanh toán, đặt hàng thành công, tra cứu đơn hàng theo số điện thoại hoặc email.
- Phí vận chuyển: 12.000đ trong Đà Nẵng, 30.000đ nơi khác. Giá thiết kế riêng được backend tính lại khi đặt hàng.
- Chỉ có giao diện: đăng nhập bằng Google/Facebook, mã giảm giá, thanh toán MoMo/ZaloPay.
- Chưa triển khai (API trả về 501): đăng ký/đăng nhập, giỏ hàng phía server, hồ sơ người dùng, lịch sử đơn hàng theo tài khoản. Trang đăng nhập/đăng ký hiển thị thông báo lỗi này.
- Chưa chọn database; dữ liệu đang lưu trong bộ nhớ và mất khi restart backend.

Danh sách endpoint chi tiết xem tại [docs/api.md](docs/api.md).

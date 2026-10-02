# YARNLY API

Base URL: `http://localhost:5000/api`

Response thành công có dạng `{ "data": ... }`. Response lỗi có dạng `{ "message": "...", "errors"?: [{ "field", "message" }] }`.

Các endpoint đánh dấu "Cần đăng nhập" yêu cầu header `Authorization: Bearer <token>`.

## Health

| Method | Endpoint  | Mô tả                  |
| ------ | --------- | ---------------------- |
| GET    | `/health` | Kiểm tra API đang chạy |

## Products

| Method | Endpoint        | Mô tả                                  |
| ------ | --------------- | -------------------------------------- |
| GET    | `/products`     | Danh sách sản phẩm (có phân trang)     |
| GET    | `/products/:id` | Chi tiết sản phẩm                      |

Query của `GET /products` (đều không bắt buộc):

| Query        | Giá trị                                                   |
| ------------ | --------------------------------------------------------- |
| `category`   | `decoration`, `fashion`, `combo`, `blindbox`              |
| `search`     | Từ khóa theo tên sản phẩm                                 |
| `status`     | `in-stock`, `out-of-stock`                                |
| `sort`       | `newest`, `price-asc`, `price-desc`, `name`               |
| `bestSeller` | `true` để chỉ lấy hàng bán chạy                           |
| `page`       | Số trang, mặc định `1`                                    |
| `pageSize`   | Số sản phẩm mỗi trang (1–50), mặc định `12`               |

Response:

```json
{
  "data": {
    "items": [
      {
        "id": "p-003",
        "name": "Mũ đầu lân",
        "price": 300000,
        "category": "fashion",
        "images": ["/images/products/mu-dau-lan.jpg"],
        "stock": 8,
        "isBestSeller": true,
        "options": { "colors": ["Cam", "Đỏ"], "sizes": ["Size S"], "leadTimes": ["2 tuần"] },
        "details": { "material": "...", "care": "...", "shipping": "..." }
      }
    ],
    "total": 9,
    "page": 1,
    "pageSize": 12,
    "totalPages": 1
  }
}
```

## Custom designs (Thiết kế riêng)

| Method | Endpoint                  | Mô tả                                                  |
| ------ | ------------------------- | ------------------------------------------------------ |
| GET    | `/custom-designs/options` | Bảng giá: sản phẩm nền, kiểu dáng, phụ kiện, giá thêu chữ |

Giá của một thiết kế = giá sản phẩm nền + giá kiểu dáng + giá phụ kiện + `textPrice` (nếu có chữ). Server tự tính lại giá khi tạo đơn.

## Orders

| Method | Endpoint         | Mô tả                                       | Ghi chú                |
| ------ | ---------------- | ------------------------------------------- | ---------------------- |
| POST   | `/orders`        | Tạo đơn hàng                                |                        |
| GET    | `/orders/lookup` | Tra cứu đơn theo `?phone=` hoặc `?email=`   |                        |
| GET    | `/orders/:id`    | Chi tiết đơn hàng                           |                        |
| GET    | `/orders`        | Lịch sử đơn hàng của người dùng             | Cần đăng nhập, chưa có |

Body của `POST /orders`:

```json
{
  "items": [
    { "productId": "p-003", "quantity": 1, "selectedOptions": { "color": "Đỏ", "size": "Size M", "leadTime": "3 tuần" } },
    {
      "productId": "custom-design",
      "quantity": 1,
      "customDesign": { "baseProduct": "doll", "style": "chibi", "accessory": "bow", "mainColor": "#f48aa0", "accentColor": "#ffe373", "text": "Anh" }
    }
  ],
  "shipping": {
    "email": "minhanh@yarnly.vn",
    "fullName": "Nguyễn Minh Anh",
    "phone": "0912345678",
    "address": "45 Lê Duẩn",
    "province": "Đà Nẵng",
    "district": "Hải Châu",
    "ward": "Hải Châu 1"
  },
  "note": "Gói quà giúp mình nhé",
  "paymentMethod": "momo"
}
```

- `paymentMethod`: `momo`, `zalopay`, `cod` (hiện chỉ lưu lựa chọn, chưa tích hợp cổng thanh toán).
- Phí vận chuyển: 12.000đ trong Đà Nẵng, 30.000đ cho tỉnh thành khác.
- Trạng thái đơn: `placed` (đã đặt) → `crafting` (đan móc) → `shipping` (đang giao) → `delivered` (đã giao), hoặc `cancelled`.
- Response có thêm `code` (ví dụ `Y1`), `subtotal`, `shippingFee`, `total`, `estimatedDelivery`.

## Auth

| Method | Endpoint         | Mô tả                                        | Ghi chú |
| ------ | ---------------- | -------------------------------------------- | ------- |
| POST   | `/auth/register` | Đăng ký `{ name, phone, email, password }`   | Chưa có |
| POST   | `/auth/login`    | Đăng nhập `{ email, password }`              | Chưa có |
| POST   | `/auth/logout`   | Đăng xuất                                    |         |

Người dùng có `role`: `admin` hoặc `user`. Với `user`, trường `userType` là `buyer` (người mua, mặc định) hoặc `seller` (người bán).

## Cart (cần đăng nhập, chưa có)

| Method | Endpoint           | Mô tả                                   |
| ------ | ------------------ | --------------------------------------- |
| GET    | `/cart`            | Lấy giỏ hàng                            |
| POST   | `/cart`            | Thêm sản phẩm `{ productId, quantity }` |
| PATCH  | `/cart/:productId` | Cập nhật số lượng `{ quantity }`        |
| DELETE | `/cart/:productId` | Xóa sản phẩm khỏi giỏ                   |

## Users (cần đăng nhập, chưa có)

| Method | Endpoint    | Mô tả                     |
| ------ | ----------- | ------------------------- |
| GET    | `/users/me` | Xem hồ sơ                 |
| PATCH  | `/users/me` | Cập nhật hồ sơ `{ name }` |

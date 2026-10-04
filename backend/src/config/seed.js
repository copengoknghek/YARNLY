const User = require('../models/User');
const Order = require('../models/Order');
const { hashPasswordSync } = require('../utils/password');
const logger = require('../utils/logger');

const DEMO_STAFF_EMAIL = 'staff@yarnly.vn';
const DEMO_STAFF_PASSWORD = 'yarnly-staff';
const DEMO_SELLER_EMAIL = 'seller@yarnly.vn';
const DEMO_SELLER_PASSWORD = 'yarnly-seller';

let seeded = false;

const seedUsers = () => {
  User.seedUser({
    id: 'admin-demo',
    name: 'Nhân viên Yarnly',
    email: DEMO_STAFF_EMAIL,
    phone: '0900000001',
    passwordHash: hashPasswordSync(DEMO_STAFF_PASSWORD),
    role: 'admin',
  });

  User.seedUser({
    id: 'seller-demo',
    name: 'Người bán mẫu',
    email: DEMO_SELLER_EMAIL,
    phone: '0901234567',
    passwordHash: hashPasswordSync(DEMO_SELLER_PASSWORD),
    role: 'user',
    userType: 'seller',
  });
};

const seedOrders = () => {
  if (Order.orders.length > 0) return;

  Order.orders.push(
    {
      id: 'order-001',
      code: 'Y1001',
      status: 'placed',
      buyerId: null,
      items: [
        {
          product: {
            id: 'sp-seed-1',
            name: 'Móc khóa thỏ len',
            price: 129000,
            category: 'decoration',
            images: [],
            sellerId: 'seller-demo',
            sellerName: 'Người bán mẫu',
          },
          quantity: 2,
          unitPrice: 129000,
        },
        {
          product: {
            id: 'sp-seed-2',
            name: 'Túi len mini',
            price: 189000,
            category: 'fashion',
            images: [],
            sellerId: 'seller-demo',
            sellerName: 'Người bán mẫu',
          },
          quantity: 1,
          unitPrice: 189000,
        },
      ],
      shipping: {
        email: 'minhanh@email.com',
        fullName: 'Nguyễn Minh Anh',
        phone: '0901111222',
        address: '123 Lê Lợi',
        province: 'Đà Nẵng',
        district: 'Hải Châu',
        ward: 'Thạch Thang',
      },
      note: '',
      paymentMethod: 'cod',
      subtotal: 447000,
      shippingFee: 12000,
      total: 459000,
      estimatedDelivery: '2026-10-10T00:00:00.000Z',
      trackingCode: null,
      createdAt: '2026-09-28T08:30:00.000Z',
    },
    {
      id: 'order-002',
      code: 'Y1002',
      status: 'crafting',
      buyerId: null,
      items: [
        {
          product: {
            id: 'sp-seed-3',
            name: 'Mũ len gấu',
            price: 320000,
            category: 'fashion',
            images: [],
            sellerId: 'seller-demo',
            sellerName: 'Người bán mẫu',
          },
          quantity: 1,
          unitPrice: 320000,
        },
      ],
      shipping: {
        email: 'baongoc@email.com',
        fullName: 'Trần Bảo Ngọc',
        phone: '0912333444',
        address: '45 Nguyễn Văn Linh',
        province: 'Đà Nẵng',
        district: 'Ngũ Hành Sơn',
        ward: 'Mỹ An',
      },
      note: '',
      paymentMethod: 'momo',
      subtotal: 320000,
      shippingFee: 12000,
      total: 332000,
      estimatedDelivery: '2026-10-12T00:00:00.000Z',
      trackingCode: null,
      createdAt: '2026-09-29T10:15:00.000Z',
    },
    {
      id: 'order-003',
      code: 'Y1003',
      status: 'shipping',
      buyerId: null,
      items: [
        {
          product: {
            id: 'sp-seed-4',
            name: 'Giỏ hoa len',
            price: 149000,
            category: 'decoration',
            images: [],
            sellerId: 'seller-2',
            sellerName: 'Len Handmade HCM',
          },
          quantity: 1,
          unitPrice: 149000,
        },
      ],
      shipping: {
        email: 'hoangnam@email.com',
        fullName: 'Lê Hoàng Nam',
        phone: '0988777666',
        address: '88 Pasteur',
        province: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Bến Nghé',
      },
      note: '',
      paymentMethod: 'zalopay',
      subtotal: 149000,
      shippingFee: 30000,
      total: 179000,
      estimatedDelivery: '2026-10-08T00:00:00.000Z',
      trackingCode: 'VN123456',
      createdAt: '2026-09-30T14:00:00.000Z',
    },
    {
      id: 'order-004',
      code: 'Y1004',
      status: 'delivered',
      buyerId: null,
      items: [
        {
          product: {
            id: 'sp-seed-5',
            name: 'Bó hoa tulip len',
            price: 275000,
            category: 'decoration',
            images: [],
            sellerId: 'seller-2',
            sellerName: 'Len Handmade HCM',
          },
          quantity: 1,
          unitPrice: 275000,
        },
      ],
      shipping: {
        email: 'thuha@email.com',
        fullName: 'Phạm Thu Hà',
        phone: '0933555777',
        address: '12 Trần Phú',
        province: 'Đà Nẵng',
        district: 'Hải Châu',
        ward: 'Hải Châu I',
      },
      note: '',
      paymentMethod: 'cod',
      subtotal: 275000,
      shippingFee: 12000,
      total: 287000,
      estimatedDelivery: '2026-10-05T00:00:00.000Z',
      trackingCode: 'VN789012',
      createdAt: '2026-10-01T09:45:00.000Z',
    },
  );
};

const seed = () => {
  if (seeded) return;
  seedUsers();
  seedOrders();
  seeded = true;
  logger.info('Seed data ready');
};

module.exports = seed;

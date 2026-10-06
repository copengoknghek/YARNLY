const Carrier = require('../models/Carrier');
const Product = require('../models/Product');
const User = require('../models/User');
const { hashPasswordSync } = require('../utils/password');
const logger = require('../utils/logger');

const DEMO_STAFF_EMAIL = 'staff@yarnly.vn';
const DEMO_STAFF_PASSWORD = 'yarnly-staff';
const DEMO_SELLER_PASSWORD = 'yarnly-seller';

const SELLERS = [
  { id: 'seller-demo', name: 'Xưởng len Đà Nẵng', email: 'seller@yarnly.vn', phone: '0901234567' },
  { id: 'seller-hoi-an', name: 'Hoa len Hội An', email: 'hoa.len@yarnly.vn', phone: '0902345678' },
  { id: 'seller-sg', name: 'Thú len Sài Gòn', email: 'thu.len@yarnly.vn', phone: '0903456789' },
];

const CARRIERS = [
  {
    id: 'carrier-yarnly-express',
    name: 'Yarnly Express',
    description: 'Giao nhanh nội thành Đà Nẵng và khu vực lân cận',
    etaMinDays: 2,
    etaMaxDays: 4,
    sortOrder: 1,
    rates: [
      { zone: 'local', fee: 12000 },
      { zone: 'nearby', fee: 22000 },
      { zone: 'national', fee: 35000 },
    ],
  },
  {
    id: 'carrier-ghn',
    name: 'GHN',
    description: 'Giao hàng nhanh toàn quốc',
    etaMinDays: 2,
    etaMaxDays: 5,
    sortOrder: 2,
    rates: [
      { zone: 'local', fee: 15000 },
      { zone: 'nearby', fee: 25000 },
      { zone: 'national', fee: 32000 },
    ],
  },
  {
    id: 'carrier-viettel',
    name: 'Viettel Post',
    description: 'Bưu chính Viettel Post uy tín',
    etaMinDays: 3,
    etaMaxDays: 6,
    sortOrder: 3,
    rates: [
      { zone: 'local', fee: 18000 },
      { zone: 'nearby', fee: 20000 },
      { zone: 'national', fee: 28000 },
    ],
  },
];

const DEFAULT_DETAILS = Product.DEFAULT_DETAILS;

const CATALOG = [
  {
    id: 'p-001',
    sellerId: 'seller-demo',
    name: 'Móc khóa hươu cao cổ',
    description:
      'Móc khóa hươu cao cổ được móc thủ công từ sợi cotton mềm, nhỏ gọn để treo balo, chìa khóa hoặc làm quà tặng.',
    price: 149000,
    category: 'decoration',
    images: ['/images/products/moc-khoa-huou-cao-co.jpg'],
    stock: 25,
    isBestSeller: false,
    createdAt: '2026-06-01T00:00:00.000Z',
    details: { material: 'Sợi Milk Cotton, bông gòn kháng khuẩn, khoen móc kim loại.', ...DEFAULT_DETAILS },
  },
  {
    id: 'p-002',
    sellerId: 'seller-demo',
    name: 'Set quà ngày của Mẹ',
    description:
      'Set quà gồm bó hoa len, thiệp viết tay và phụ kiện trang trí, gói sẵn trong hộp quà xinh xắn dành tặng mẹ.',
    price: 250000,
    category: 'combo',
    images: ['/images/products/set-qua-ngay-cua-me.jpg'],
    stock: 12,
    isBestSeller: false,
    createdAt: '2026-06-05T00:00:00.000Z',
    details: { material: 'Sợi Milk Cotton, giấy kraft, hộp carton cứng.', ...DEFAULT_DETAILS },
  },
  {
    id: 'p-003',
    sellerId: 'seller-demo',
    name: 'Mũ đầu lân',
    description:
      'Mũ len hình đầu lân rực rỡ, ấm áp cho bé dịp Tết và Trung thu. Có thể chọn màu sắc, kích cỡ và thời gian làm.',
    price: 300000,
    category: 'fashion',
    images: [
      '/images/products/mu-dau-lan.jpg',
      '/images/products/mu-dau-lan-2.jpg',
      '/images/products/mu-dau-lan-3.jpg',
      '/images/products/mu-dau-lan-4.jpg',
      '/images/products/mu-dau-lan-5.jpg',
    ],
    stock: 8,
    isBestSeller: true,
    createdAt: '2026-06-10T00:00:00.000Z',
    options: {
      colors: ['Cam', 'Đỏ', 'Xanh', 'Hồng'],
      sizes: ['Size S', 'Size M', 'Size L', 'Size XL'],
      leadTimes: ['2 tuần', '3 tuần', '4 tuần', '5 tuần'],
    },
    details: { material: 'Sợi Milk Cotton', ...DEFAULT_DETAILS },
  },
  {
    id: 'p-004',
    sellerId: 'seller-hoi-an',
    name: 'Hộp quà bí ẩn',
    description: 'Một bé thú len ngẫu nhiên được gói trong hộp quà bí ẩn, mở ra là bất ngờ.',
    price: 179000,
    category: 'blindbox',
    images: ['/images/products/hop-qua-bi-an.jpg'],
    stock: 30,
    isBestSeller: false,
    createdAt: '2026-06-12T00:00:00.000Z',
    details: { material: 'Sợi Milk Cotton, bông gòn, hộp giấy in họa tiết.', ...DEFAULT_DETAILS },
  },
  {
    id: 'p-005',
    sellerId: 'seller-hoi-an',
    name: 'Giỏ hoa tặng bạn thân',
    description: 'Giỏ hoa len nhiều màu với hướng dương, tulip và lá xanh, giữ mãi không tàn.',
    price: 149000,
    category: 'decoration',
    images: ['/images/products/gio-hoa-ban-than.png'],
    stock: 15,
    isBestSeller: true,
    createdAt: '2026-06-15T00:00:00.000Z',
    details: { material: 'Sợi Milk Cotton, khung thép bọc len, giỏ mây.', ...DEFAULT_DETAILS },
  },
  {
    id: 'p-006',
    sellerId: 'seller-hoi-an',
    name: 'Bó hoa tặng bạn thân',
    description: 'Bó hoa len pastel gói giấy xinh, món quà nhỏ cho những người bạn thân thương.',
    price: 99000,
    category: 'decoration',
    images: ['/images/products/bo-hoa-ban-than.png'],
    stock: 0,
    isBestSeller: true,
    createdAt: '2026-06-18T00:00:00.000Z',
    details: { material: 'Sợi Milk Cotton, khung thép bọc len, giấy gói hoa.', ...DEFAULT_DETAILS },
  },
  {
    id: 'bb-basic',
    sellerId: 'seller-sg',
    name: 'Blind Box Cơ bản',
    description: 'Một bé thú len mini ngẫu nhiên trong bộ sưu tập hiện tại.',
    price: 179000,
    category: 'blindbox',
    images: ['/images/products/hop-qua-bi-an.jpg'],
    stock: 50,
    isBestSeller: false,
    createdAt: '2026-06-20T00:00:00.000Z',
    details: { material: 'Sợi Milk Cotton, bông gòn, hộp giấy in họa tiết.', ...DEFAULT_DETAILS },
  },
  {
    id: 'bb-couple',
    sellerId: 'seller-sg',
    name: 'Blind Box Cặp đôi',
    description: 'Hai nhân vật bí mật đồng điệu dành cho cặp bạn thân hoặc các cặp đôi.',
    price: 329000,
    category: 'blindbox',
    images: ['/images/products/hop-qua-bi-an.jpg'],
    stock: 40,
    isBestSeller: false,
    createdAt: '2026-06-20T00:00:00.000Z',
    details: { material: 'Sợi Milk Cotton, bông gòn, hộp giấy in họa tiết.', ...DEFAULT_DETAILS },
  },
  {
    id: 'bb-rare',
    sellerId: 'seller-sg',
    name: 'Blind box bộ sưu tập hiếm',
    description: 'Hộp quà theo mùa cao cấp với tỉ lệ xuất hiện vật phẩm hiếm cao hơn.',
    price: 499000,
    category: 'blindbox',
    images: ['/images/products/hop-qua-bi-an.jpg'],
    stock: 20,
    isBestSeller: false,
    createdAt: '2026-06-20T00:00:00.000Z',
    details: {
      material: 'Sợi Milk Cotton cao cấp, bông gòn, hộp quà cứng có nam châm.',
      ...DEFAULT_DETAILS,
    },
  },
];

const seedUsers = async () => {
  await User.seedUser({
    id: 'admin-demo',
    name: 'Nhân viên Yarnly',
    email: DEMO_STAFF_EMAIL,
    phone: '0900000001',
    passwordHash: hashPasswordSync(DEMO_STAFF_PASSWORD),
    role: 'admin',
  });

  for (const seller of SELLERS) {
    await User.seedUser({
      id: seller.id,
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      passwordHash: hashPasswordSync(DEMO_SELLER_PASSWORD),
      role: 'user',
      userType: 'seller',
    });
  }
};

const seedCarriers = async () => {
  for (const carrier of CARRIERS) {
    const { rates, ...data } = carrier;
    await Carrier.seedCarrier(data, rates);
  }
};

const seedProducts = async () => {
  for (const product of CATALOG) {
    await Product.seedProduct({ ...product, approvalStatus: 'approved' });
  }
};

const seed = async ({ force = false } = {}) => {
  const admin = await User.findByEmail(DEMO_STAFF_EMAIL);
  if (admin && !force) {
    logger.info('Seed skipped (database already initialized)');
    return;
  }

  if (force) {
    const { getPool } = require('./db');
    await getPool().query(
      'TRUNCATE order_items, orders, products, shipping_rates, carriers, users RESTART IDENTITY CASCADE',
    );
    await getPool().query("SELECT setval('order_code_seq', 1001, false)");
  }

  await seedUsers();
  await seedCarriers();
  await seedProducts();
  await syncOrderCodeSequence();
  logger.info('Seed data ready');
};

const syncOrderCodeSequence = async () => {
  const { getPool } = require('./db');
  await getPool().query(`
    SELECT setval(
      'order_code_seq',
      GREATEST(
        COALESCE((SELECT MAX(CAST(SUBSTRING(code FROM 2) AS INTEGER)) FROM orders), 1000),
        COALESCE((SELECT last_value FROM order_code_seq), 1000)
      ),
      TRUE
    )
  `);
};

module.exports = seed;

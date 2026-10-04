/**
 * Product: { id, name, description, price, category, images[], stock, isBestSeller, createdAt,
 *            options?, details,
 *            sellerId?, sellerName?, approvalStatus: 'pending'|'approved'|'rejected', rejectionNote? }
 */
const CATEGORIES = ['decoration', 'fashion', 'combo', 'blindbox'];
const APPROVAL_STATUSES = ['pending', 'approved', 'rejected'];
const LOW_STOCK_THRESHOLD = 5;

const DEFAULT_DETAILS = {
  care: 'Giặt tay nhẹ nhàng với nước lạnh, không vắt mạnh. Phơi khô ở nơi thoáng mát, tránh ánh nắng trực tiếp.',
  shipping: 'Giao hàng toàn quốc từ 2–5 ngày sau khi hoàn thành sản phẩm. Phí vận chuyển được tính ở bước thanh toán.',
};

const products = [
  {
    id: 'p-001',
    name: 'Móc khóa hươu cao cổ',
    description:
      'Móc khóa hươu cao cổ được móc thủ công từ sợi cotton mềm, nhỏ gọn để treo balo, chìa khóa hoặc làm quà tặng.',
    price: 149000,
    category: 'decoration',
    images: ['/images/products/moc-khoa-huou-cao-co.jpg'],
    stock: 25,
    isBestSeller: false,
    createdAt: '2026-06-01T00:00:00.000Z',
    approvalStatus: 'approved',
    details: { material: 'Sợi Milk Cotton, bông gòn kháng khuẩn, khoen móc kim loại.', ...DEFAULT_DETAILS },
  },
  {
    id: 'p-002',
    name: 'Set quà ngày của Mẹ',
    description:
      'Set quà gồm bó hoa len, thiệp viết tay và phụ kiện trang trí, gói sẵn trong hộp quà xinh xắn dành tặng mẹ.',
    price: 250000,
    category: 'combo',
    images: ['/images/products/set-qua-ngay-cua-me.jpg'],
    stock: 12,
    isBestSeller: false,
    createdAt: '2026-06-05T00:00:00.000Z',
    approvalStatus: 'approved',
    details: { material: 'Sợi Milk Cotton, giấy kraft, hộp carton cứng.', ...DEFAULT_DETAILS },
  },
  {
    id: 'p-003',
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
    approvalStatus: 'approved',
    options: {
      colors: ['Cam', 'Đỏ', 'Xanh', 'Hồng'],
      sizes: ['Size S', 'Size M', 'Size L', 'Size XL'],
      leadTimes: ['2 tuần', '3 tuần', '4 tuần', '5 tuần'],
    },
    details: { material: 'Sợi Milk Cotton', ...DEFAULT_DETAILS },
  },
  {
    id: 'p-004',
    name: 'Hộp quà bí ẩn',
    description: 'Một bé thú len ngẫu nhiên được gói trong hộp quà bí ẩn, mở ra là bất ngờ.',
    price: 179000,
    category: 'blindbox',
    images: ['/images/products/hop-qua-bi-an.jpg'],
    stock: 30,
    isBestSeller: false,
    createdAt: '2026-06-12T00:00:00.000Z',
    approvalStatus: 'approved',
    details: { material: 'Sợi Milk Cotton, bông gòn, hộp giấy in họa tiết.', ...DEFAULT_DETAILS },
  },
  {
    id: 'p-005',
    name: 'Giỏ hoa tặng bạn thân',
    description: 'Giỏ hoa len nhiều màu với hướng dương, tulip và lá xanh, giữ mãi không tàn.',
    price: 149000,
    category: 'decoration',
    images: ['/images/products/gio-hoa-ban-than.png'],
    stock: 15,
    isBestSeller: true,
    createdAt: '2026-06-15T00:00:00.000Z',
    approvalStatus: 'approved',
    details: { material: 'Sợi Milk Cotton, khung thép bọc len, giỏ mây.', ...DEFAULT_DETAILS },
  },
  {
    id: 'p-006',
    name: 'Bó hoa tặng bạn thân',
    description: 'Bó hoa len pastel gói giấy xinh, món quà nhỏ cho những người bạn thân thương.',
    price: 99000,
    category: 'decoration',
    images: ['/images/products/bo-hoa-ban-than.png'],
    stock: 0,
    isBestSeller: true,
    createdAt: '2026-06-18T00:00:00.000Z',
    approvalStatus: 'approved',
    details: { material: 'Sợi Milk Cotton, khung thép bọc len, giấy gói hoa.', ...DEFAULT_DETAILS },
  },
  {
    id: 'bb-basic',
    name: 'Blind Box Cơ bản',
    description: 'Một bé thú len mini ngẫu nhiên trong bộ sưu tập hiện tại.',
    price: 179000,
    category: 'blindbox',
    images: ['/images/products/hop-qua-bi-an.jpg'],
    stock: 50,
    isBestSeller: false,
    createdAt: '2026-06-20T00:00:00.000Z',
    approvalStatus: 'approved',
    details: { material: 'Sợi Milk Cotton, bông gòn, hộp giấy in họa tiết.', ...DEFAULT_DETAILS },
  },
  {
    id: 'bb-couple',
    name: 'Blind Box Cặp đôi',
    description: 'Hai nhân vật bí mật đồng điệu dành cho cặp bạn thân hoặc các cặp đôi.',
    price: 329000,
    category: 'blindbox',
    images: ['/images/products/hop-qua-bi-an.jpg'],
    stock: 40,
    isBestSeller: false,
    createdAt: '2026-06-20T00:00:00.000Z',
    approvalStatus: 'approved',
    details: { material: 'Sợi Milk Cotton, bông gòn, hộp giấy in họa tiết.', ...DEFAULT_DETAILS },
  },
  {
    id: 'bb-rare',
    name: 'Blind box bộ sưu tập hiếm',
    description: 'Hộp quà theo mùa cao cấp với tỉ lệ xuất hiện vật phẩm hiếm cao hơn.',
    price: 499000,
    category: 'blindbox',
    images: ['/images/products/hop-qua-bi-an.jpg'],
    stock: 20,
    isBestSeller: false,
    createdAt: '2026-06-20T00:00:00.000Z',
    approvalStatus: 'approved',
    details: { material: 'Sợi Milk Cotton cao cấp, bông gòn, hộp quà cứng có nam châm.', ...DEFAULT_DETAILS },
  },
];

const SORTERS = {
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name, 'vi'),
};

const isApproved = (product) => product.approvalStatus === 'approved';

const findAll = async ({ category, search, status, bestSeller, sort, sellerId, approvalStatus } = {}) => {
  const keyword = search?.trim().toLowerCase();
  const result = products.filter(
    (product) =>
      (!category || product.category === category) &&
      (!keyword || product.name.toLowerCase().includes(keyword)) &&
      (!status || (status === 'in-stock' ? product.stock > 0 : product.stock === 0)) &&
      (!bestSeller || product.isBestSeller) &&
      (!sellerId || product.sellerId === sellerId) &&
      (!approvalStatus || product.approvalStatus === approvalStatus),
  );
  return sort && SORTERS[sort] ? [...result].sort(SORTERS[sort]) : result;
};

const findById = async (id) => products.find((product) => product.id === id) ?? null;

const create = async (data) => {
  const { generateId } = require('../utils/helpers');
  const product = {
    id: `sp-${generateId()}`,
    isBestSeller: false,
    createdAt: new Date().toISOString(),
    approvalStatus: 'pending',
    details: {
      material: 'Sợi Milk Cotton',
      ...DEFAULT_DETAILS,
    },
    ...data,
  };
  products.unshift(product);
  return product;
};

const update = async (id, sellerId, patch) => {
  const index = products.findIndex((product) => product.id === id && product.sellerId === sellerId);
  if (index < 0) return null;
  products[index] = {
    ...products[index],
    ...patch,
    approvalStatus: 'pending',
    rejectionNote: undefined,
  };
  return products[index];
};

const updateStock = async (id, sellerId, stock) => {
  const index = products.findIndex((product) => product.id === id && product.sellerId === sellerId);
  if (index < 0) return null;
  products[index] = { ...products[index], stock };
  return products[index];
};

const approve = async (id) => {
  const index = products.findIndex((product) => product.id === id);
  if (index < 0) return null;
  products[index] = {
    ...products[index],
    approvalStatus: 'approved',
    rejectionNote: undefined,
  };
  return products[index];
};

const reject = async (id, note) => {
  const index = products.findIndex((product) => product.id === id);
  if (index < 0) return null;
  products[index] = {
    ...products[index],
    approvalStatus: 'rejected',
    rejectionNote: note?.trim() || 'Sản phẩm chưa đạt yêu cầu.',
  };
  return products[index];
};

const countBySeller = async (sellerId) => {
  const sellerProducts = products.filter((product) => product.sellerId === sellerId);
  return {
    pending: sellerProducts.filter((product) => product.approvalStatus === 'pending').length,
    approved: sellerProducts.filter((product) => product.approvalStatus === 'approved').length,
    rejected: sellerProducts.filter((product) => product.approvalStatus === 'rejected').length,
    lowStock: sellerProducts.filter(
      (product) => product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD,
    ).length,
  };
};

module.exports = {
  CATEGORIES,
  APPROVAL_STATUSES,
  LOW_STOCK_THRESHOLD,
  SORT_OPTIONS: Object.keys(SORTERS),
  products,
  isApproved,
  findAll,
  findById,
  create,
  update,
  updateStock,
  approve,
  reject,
  countBySeller,
};

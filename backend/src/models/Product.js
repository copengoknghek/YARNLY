/**
 * Product: { id, name, description, price, category, images[], stock, isBestSeller, createdAt,
 *            options?: { colors[], sizes[], leadTimes[] }, details: { material, care, shipping } }
 */
const CATEGORIES = ['decoration', 'fashion', 'combo', 'blindbox'];

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
    details: { material: 'Sợi Milk Cotton cao cấp, bông gòn, hộp quà cứng có nam châm.', ...DEFAULT_DETAILS },
  },
];

const SORTERS = {
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name, 'vi'),
};

const findAll = async ({ category, search, status, bestSeller, sort } = {}) => {
  const keyword = search?.trim().toLowerCase();
  const result = products.filter(
    (product) =>
      (!category || product.category === category) &&
      (!keyword || product.name.toLowerCase().includes(keyword)) &&
      (!status || (status === 'in-stock' ? product.stock > 0 : product.stock === 0)) &&
      (!bestSeller || product.isBestSeller),
  );
  return sort && SORTERS[sort] ? [...result].sort(SORTERS[sort]) : result;
};

const findById = async (id) => products.find((product) => product.id === id) ?? null;

module.exports = { CATEGORIES, SORT_OPTIONS: Object.keys(SORTERS), findAll, findById };

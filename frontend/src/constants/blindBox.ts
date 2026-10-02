export const BLIND_BOX_STEPS = [
  { number: '01', title: 'Chọn bộ sưu tập', description: 'Chọn chủ đề và thể loại quà bạn yêu thích' },
  {
    number: '02',
    title: 'Yarnly chuẩn bị bí mật',
    description: 'Yarnly đóng gói cho bạn một món quà ngẫu nhiên theo chủ đề bạn chọn',
  },
  {
    number: '03',
    title: 'Mở hộp người bạn mới',
    description: 'Khám phá nhân vật thường, hiếm hoặc phiên bản theo mùa',
  },
] as const

export interface BlindBoxPackage {
  productId: string
  name: string
  description: string
  price: number
  features: string[]
  featured?: boolean
}

/** Product ids match the blind box products served by the backend. */
export const BLIND_BOX_PACKAGES: BlindBoxPackage[] = [
  {
    productId: 'bb-basic',
    name: 'Blind Box Cơ bản',
    description: 'Một bé thú len mini ngẫu nhiên trong bộ sưu tập hiện tại.',
    price: 179000,
    features: ['1 nhân vật ngẫu nhiên', 'Cơ hội nhận bản hiếm', 'Thẻ nhân vật sưu tầm'],
  },
  {
    productId: 'bb-couple',
    name: 'Blind Box Cặp đôi',
    description: 'Hai nhân vật bí mật đồng điệu dành cho cặp bạn thân hoặc các cặp đôi.',
    price: 329000,
    features: ['2 nhân vật theo cặp', 'Cơ hội nhận phiên bản hiếm', 'Thiệp nhắn riêng'],
    featured: true,
  },
  {
    productId: 'bb-rare',
    name: 'Blind box bộ sưu tập hiếm',
    description: 'Hộp quà theo mùa cao cấp với tỉ lệ xuất hiện vật phẩm hiếm cao hơn.',
    price: 499000,
    features: ['6 nhân vật thường và 2 nhân vật hiếm', 'Tỉ lệ bản hiếm cao', 'Phụ kiện theo mùa'],
  },
]

export const BLIND_BOX_IMAGE = '/images/products/hop-qua-bi-an.jpg'

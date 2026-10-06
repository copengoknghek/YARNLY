export type ProductCategory = 'decoration' | 'fashion' | 'combo' | 'blindbox'

export type ProductSort = 'newest' | 'price-asc' | 'price-desc' | 'name'

export type StockStatus = 'in-stock' | 'out-of-stock'

export interface ProductOptions {
  colors?: string[]
  sizes?: string[]
  leadTimes?: string[]
}

export interface ProductDetails {
  material: string
  care: string
  shipping: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: ProductCategory
  images: string[]
  stock: number
  isBestSeller: boolean
  createdAt: string
  sellerId: string
  sellerName: string
  options?: ProductOptions
  details: ProductDetails
}

export interface ProductFilters {
  category?: ProductCategory
  search?: string
  status?: StockStatus
  sort?: ProductSort
  bestSeller?: boolean
  page?: number
  pageSize?: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

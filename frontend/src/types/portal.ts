import type { OrderStatus } from './order'
import type { Product, ProductCategory, ProductDetails, ProductOptions } from './product'

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export type AuthAudience = 'buyer' | 'seller' | 'staff'

export interface SellerProduct {
  id: string
  sellerId: string
  sellerName: string
  name: string
  description: string
  price: number
  category: ProductCategory
  images: string[]
  stock: number
  isBestSeller: boolean
  createdAt: string
  approvalStatus: ApprovalStatus
  rejectionNote?: string
  details: ProductDetails
  options?: ProductOptions
}

export interface SellerProductInput {
  name: string
  description: string
  price: number
  category: ProductCategory
  stock: number
  imageUrl?: string
}

export interface StoredSellerAccount {
  id: string
  name: string
  email: string
  phone: string
  password: string
}

export interface AdminOrderItem {
  productName: string
  quantity: number
  unitPrice: number
}

export interface AdminOrder {
  id: string
  code: string
  status: OrderStatus
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  sellerId: string
  sellerName: string
  items: AdminOrderItem[]
  total: number
  createdAt: string
}

export const toCatalogProduct = (product: SellerProduct): Product => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  category: product.category,
  images: product.images.length > 0 ? product.images : ['/images/products/placeholder.jpg'],
  stock: product.stock,
  isBestSeller: product.isBestSeller,
  createdAt: product.createdAt,
  sellerId: product.sellerId,
  sellerName: product.sellerName,
  details: product.details,
  options: product.options,
})

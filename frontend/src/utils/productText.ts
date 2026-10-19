import type { Product } from '@/types/product'

const isEnglish = (lng: string) => lng.startsWith('en')

export const getProductName = (product: Pick<Product, 'name' | 'nameEn'>, lng: string) =>
  (isEnglish(lng) && product.nameEn) || product.name

export const getProductDescription = (product: Pick<Product, 'description' | 'descriptionEn'>, lng: string) =>
  (isEnglish(lng) && product.descriptionEn) || product.description

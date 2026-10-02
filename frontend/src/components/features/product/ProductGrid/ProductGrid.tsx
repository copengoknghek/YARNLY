import ProductCard from '@/components/features/product/ProductCard'
import type { Product } from '@/types/product'
import '@/styles/components/ProductGrid.css'

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="product-grid__empty">Không tìm thấy sản phẩm nào.</p>
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid

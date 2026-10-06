import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Icon from '@/components/common/Icon'
import QuantityInput from '@/components/common/QuantityInput'
import { productDetailPath } from '@/constants/routes'
import { useCart } from '@/hooks/useCart'
import type { CartItem as CartItemType } from '@/types/cart'
import { describeItemOptions } from '@/utils/cartItem'
import { formatPrice } from '@/utils/formatPrice'
import '@/styles/components/CartItem.css'

function CartItem({ item }: { item: CartItemType }) {
  const { t } = useTranslation()
  const { updateQuantity, removeItem } = useCart()
  const { product } = item
  const isCustom = product.category === 'custom'
  const optionsText = describeItemOptions(item.selectedOptions, item.customDesign)

  return (
    <li className="cart-item">
      <div className="cart-item__product">
        <img src={product.images[0]} alt="" className="cart-item__image" />
        <div>
          {isCustom ? (
            <p className="cart-item__name">{product.name}</p>
          ) : (
            <Link to={productDetailPath(product.id)} className="cart-item__name">
              {product.name}
            </Link>
          )}
          {optionsText && <p className="cart-item__options">{optionsText}</p>}
        </div>
      </div>

      <div className="cart-item__quantity">
        <QuantityInput
          value={item.quantity}
          onChange={(quantity) => updateQuantity(item.key, quantity)}
          label={t('cart.itemQuantity', { name: product.name })}
        />
        <button
          type="button"
          className="cart-item__remove"
          aria-label={t('cart.removeItem', { name: product.name })}
          onClick={() => removeItem(item.key)}
        >
          <Icon name="trash" size={18} />
        </button>
      </div>

      <span className="cart-item__price">{formatPrice(product.price)}</span>
    </li>
  )
}

export default CartItem

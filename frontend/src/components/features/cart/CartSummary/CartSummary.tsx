import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/common/Button'
import { ROUTES } from '@/constants/routes'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/utils/formatPrice'
import '@/styles/components/CartSummary.css'

function CartSummary() {
  const { t } = useTranslation()
  const { totalPrice, note, setNote } = useCart()
  const navigate = useNavigate()

  return (
    <aside className="cart-summary">
      <div className="cart-summary__row">
        <span>{t('cart.summary.subtotal')}</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>
      <div className="cart-summary__row cart-summary__row--total">
        <span>{t('cart.summary.total')}</span>
        <strong>{formatPrice(totalPrice)}</strong>
      </div>
      <p className="cart-summary__hint">{t('cart.summary.hint')}</p>

      <label htmlFor="cart-note" className="cart-summary__note-label">
        {t('cart.summary.noteLabel')}
      </label>
      <textarea
        id="cart-note"
        className="cart-summary__note"
        maxLength={500}
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />

      <Button fullWidth className="cart-summary__checkout" onClick={() => navigate(ROUTES.CHECKOUT)}>
        {t('cart.summary.checkout')}
      </Button>

      <div className="cart-summary__policies">
        <p>
          {t('cart.summary.terms')}{' '}
          <a href="#">{t('cart.summary.termsLink')}</a>, <a href="#">{t('cart.summary.returnLink')}</a>{' '}
          {t('cart.summary.and')}{' '}
          <a href="#">{t('cart.summary.privacyLink')}</a> {t('cart.summary.termsSuffix')}
        </p>
        <p>{t('cart.summary.pointsNotice')}</p>
        <p>{t('cart.summary.phoneNotice')}</p>
      </div>
    </aside>
  )
}

export default CartSummary

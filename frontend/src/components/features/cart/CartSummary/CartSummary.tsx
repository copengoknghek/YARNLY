import { useNavigate } from 'react-router-dom'
import Button from '@/components/common/Button'
import { ROUTES } from '@/constants/routes'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/utils/formatPrice'
import '@/styles/components/CartSummary.css'

function CartSummary() {
  const { totalPrice, note, setNote } = useCart()
  const navigate = useNavigate()

  return (
    <aside className="cart-summary">
      <div className="cart-summary__row">
        <span>Tạm tính</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>
      <div className="cart-summary__row cart-summary__row--total">
        <span>Tổng</span>
        <strong>{formatPrice(totalPrice)}</strong>
      </div>
      <p className="cart-summary__hint">
        Các đơn hàng quốc tế có thể phải chịu thêm thuế hải quan và các loại thuế khác không được bao gồm khi
        thanh toán.
      </p>

      <label htmlFor="cart-note" className="cart-summary__note-label">
        Ghi chú đơn hàng
      </label>
      <textarea
        id="cart-note"
        className="cart-summary__note"
        maxLength={500}
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />

      <Button fullWidth className="cart-summary__checkout" onClick={() => navigate(ROUTES.CHECKOUT)}>
        Thanh toán
      </Button>

      <div className="cart-summary__policies">
        <p>
          Bằng cách đặt hàng, bạn đồng ý với <a href="#">Điều khoản &amp; Điều kiện</a>,{' '}
          <a href="#">Chính sách Trả hàng &amp; Đổi hàng</a> và <a href="#">Chính sách Bảo mật</a> của Yarnly.
        </p>
        <p>Điểm thành viên sẽ được cộng vào tài khoản trong vòng 7 ngày làm việc sau khi thanh toán hoàn tất thành công.</p>
        <p>Để tích lũy điểm thành viên, khách hàng phải cung cấp số điện thoại khi đặt hàng.</p>
      </div>
    </aside>
  )
}

export default CartSummary

import { Link } from 'react-router-dom'
import Icon from '@/components/common/Icon'
import { ROUTES } from '@/constants/routes'
import '@/styles/components/IdeaBanner.css'

function IdeaBanner() {
  return (
    <section className="container idea-banner-wrap">
      <div className="idea-banner">
        <p className="eyebrow idea-banner__eyebrow">Ý tưởng dành riêng cho bạn</p>
        <h2 className="display-title idea-banner__title">
          Có ý tưởng? Hãy để Yarnly biến nó thành sản phẩm len.
        </h2>
        <Link to={ROUTES.CUSTOM_DESIGN} className="idea-banner__cta" aria-label="Tạo thiết kế riêng">
          <Icon name="arrow-right" size={28} strokeWidth={1.2} />
        </Link>
      </div>
    </section>
  )
}

export default IdeaBanner

import { useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '@/components/common/Breadcrumb'
import PageBanner from '@/components/common/PageBanner'
import BlindBoxCard from '@/components/features/blindbox/BlindBoxCard'
import IdeaBanner from '@/components/features/marketing/IdeaBanner'
import {
  BLIND_BOX_IMAGE,
  BLIND_BOX_PACKAGES,
  BLIND_BOX_STEPS,
  type BlindBoxPackage,
} from '@/constants/blindBox'
import { ROUTES } from '@/constants/routes'
import { useCart } from '@/hooks/useCart'
import '@/styles/pages/buyer/BlindBox.css'

function BlindBox() {
  const { addItem } = useCart()
  const [addedName, setAddedName] = useState<string | null>(null)

  const handleBuy = (pack: BlindBoxPackage) => {
    addItem({
      id: pack.productId,
      name: pack.name,
      price: pack.price,
      category: 'blindbox',
      images: [BLIND_BOX_IMAGE],
    })
    setAddedName(pack.name)
  }

  return (
    <div className="blindbox-page">
      <PageBanner title="Blind box" />

      <div className="container page">
        <Breadcrumb items={[{ label: 'Trang chủ', to: ROUTES.HOME }, { label: 'Blind box' }]} />

        <section className="blindbox-page__section">
          <div className="section-heading">
            <p className="eyebrow">Cách hoạt động</p>
            <h2 className="display-title">Mỗi chiếc hộp là một câu chuyện mới</h2>
          </div>
          <ol className="blindbox-steps">
            {BLIND_BOX_STEPS.map((step) => (
              <li key={step.number} className="blindbox-steps__item">
                <span className="blindbox-steps__number">{step.number}</span>
                <h3 className="blindbox-steps__title">{step.title}</h3>
                <p className="blindbox-steps__description">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="blindbox-page__section">
          <div className="section-heading">
            <p className="eyebrow">Chọn điều bất ngờ</p>
            <h2 className="display-title">Các gói blind box</h2>
          </div>
          <div className="blindbox-packages">
            {BLIND_BOX_PACKAGES.map((pack) => (
              <BlindBoxCard key={pack.productId} pack={pack} onBuy={handleBuy} />
            ))}
          </div>
          {addedName && (
            <p className="blindbox-page__added" role="status">
              Đã thêm “{addedName}” vào giỏ hàng. <Link to={ROUTES.CART}>Xem giỏ hàng</Link>
            </p>
          )}
        </section>
      </div>

      <IdeaBanner />
    </div>
  )
}

export default BlindBox

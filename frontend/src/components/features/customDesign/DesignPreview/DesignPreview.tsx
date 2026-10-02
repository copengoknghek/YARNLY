import Button from '@/components/common/Button'
import type { CustomDesign, CustomDesignOptions } from '@/types/customDesign'
import { findLabel } from '@/utils/customDesign'
import { formatPrice } from '@/utils/formatPrice'
import DesignIllustration from './DesignIllustration'
import '@/styles/components/DesignPreview.css'

interface DesignPreviewProps {
  design: CustomDesign
  options: CustomDesignOptions
  price: number
  onAddToCart: () => void
}

function DesignPreview({ design, options, price, onAddToCart }: DesignPreviewProps) {
  const rows = [
    { label: 'Sản phẩm', value: findLabel(options.baseProducts, design.baseProduct) },
    { label: 'Kiểu dáng', value: findLabel(options.styles, design.style) },
    { label: 'Phụ kiện', value: findLabel(options.accessories, design.accessory) },
  ]
  if (design.text?.trim()) rows.push({ label: 'Chữ thêu', value: design.text.trim() })
  if (design.referenceImageName) rows.push({ label: 'Ảnh tham khảo', value: design.referenceImageName })

  return (
    <aside className="design-preview">
      <div className="design-preview__card">
        <div className="design-preview__header">
          <h2 className="design-preview__title">Mẫu thiết kế của bạn</h2>
          <span className="design-preview__tag">Đang mô phỏng</span>
        </div>

        <div className="design-preview__canvas">
          <DesignIllustration design={design} />
        </div>

        <dl className="design-preview__rows">
          {rows.map((row) => (
            <div key={row.label} className="design-preview__row">
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="design-preview__total">
          <span>Tổng cộng</span>
          <strong>{formatPrice(price)}</strong>
        </div>

        <Button fullWidth onClick={onAddToCart}>
          Thêm thiết kế vào giỏ
        </Button>
      </div>
      <p className="design-preview__note">
        Yarnly sẽ liên hệ xác nhận chi tiết và giá cuối cùng trước khi thực hiện
      </p>
    </aside>
  )
}

export default DesignPreview

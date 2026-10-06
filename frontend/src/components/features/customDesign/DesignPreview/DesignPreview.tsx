import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

  const rows = [
    { labelKey: 'customDesign.previewProduct', value: findLabel(options.baseProducts, design.baseProduct) },
    { labelKey: 'customDesign.previewStyle', value: findLabel(options.styles, design.style) },
    { labelKey: 'customDesign.previewAccessory', value: findLabel(options.accessories, design.accessory) },
  ]
  if (design.text?.trim()) {
    rows.push({ labelKey: 'customDesign.previewText', value: design.text.trim() })
  }
  if (design.referenceImageName) {
    rows.push({ labelKey: 'customDesign.previewReference', value: design.referenceImageName })
  }

  return (
    <aside className="design-preview">
      <div className="design-preview__card">
        <div className="design-preview__header">
          <h2 className="design-preview__title">{t('customDesign.previewTitle')}</h2>
          <span className="design-preview__tag">{t('customDesign.previewTag')}</span>
        </div>

        <div className="design-preview__canvas">
          <DesignIllustration design={design} />
        </div>

        <dl className="design-preview__rows">
          {rows.map((row) => (
            <div key={row.labelKey} className="design-preview__row">
              <dt>{t(row.labelKey)}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="design-preview__total">
          <span>{t('customDesign.previewTotal')}</span>
          <strong>{formatPrice(price)}</strong>
        </div>

        <Button fullWidth onClick={onAddToCart}>
          {t('customDesign.addToCart')}
        </Button>
      </div>
      <p className="design-preview__note">{t('customDesign.previewNote')}</p>
    </aside>
  )
}

export default DesignPreview

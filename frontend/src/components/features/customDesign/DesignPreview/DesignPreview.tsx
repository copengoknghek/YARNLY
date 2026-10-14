import { lazy, Suspense, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/components/common/Button'
import DesignPreview3DErrorBoundary from '@/components/features/customDesign/DesignPreview3D/DesignPreview3DErrorBoundary'
import type { CustomDesign, CustomDesignOptions } from '@/types/customDesign'
import { findColorName, findLabel, findMaker } from '@/utils/customDesign'
import { formatPrice } from '@/utils/formatPrice'
import { supportsWebGL } from '@/utils/webgl'
import DesignIllustration from './DesignIllustration'
import '@/styles/components/DesignPreview.css'

const DesignPreview3D = lazy(() => import('@/components/features/customDesign/DesignPreview3D/DesignPreview3D'))

interface DesignPreviewProps {
  design: CustomDesign
  options: CustomDesignOptions
  price: number
  referenceImageUrl?: string
  onAddToCart: () => void
}

function DesignPreview({ design, options, price, referenceImageUrl, onAddToCart }: DesignPreviewProps) {
  const { t } = useTranslation()
  const canUseWebGL = useMemo(() => supportsWebGL(), [])

  const maker = findMaker(options, design.sellerId)
  const rows = [
    { labelKey: 'customDesign.previewMaker', value: maker ? `${maker.name} (${maker.province})` : '' },
    { labelKey: 'customDesign.previewProduct', value: findLabel(options.baseProducts, design.baseProduct) },
    { labelKey: 'customDesign.previewStyle', value: findLabel(options.styles, design.style) },
    {
      labelKey: 'customDesign.previewMainColor',
      value: design.mainColorName ?? findColorName(maker, design.mainColorId),
    },
    {
      labelKey: 'customDesign.previewAccentColor',
      value: design.accentColorName ?? findColorName(maker, design.accentColorId),
    },
    { labelKey: 'customDesign.previewAccessory', value: findLabel(options.accessories, design.accessory) },
  ]
  if (design.text?.trim()) {
    rows.push({ labelKey: 'customDesign.previewText', value: design.text.trim() })
  }
  const showReference = Boolean(referenceImageUrl || design.referenceImageName)

  return (
    <aside className="design-preview">
      <div className="design-preview__card">
        <div className="design-preview__header">
          <h2 className="design-preview__title">{t('customDesign.previewTitle')}</h2>
          <span className="design-preview__tag">{t('customDesign.previewTag')}</span>
        </div>

        <div className="design-preview__canvas">
          {canUseWebGL ? (
            <DesignPreview3DErrorBoundary design={design}>
              <Suspense fallback={<DesignIllustration design={design} />}>
                <DesignPreview3D design={design} />
              </Suspense>
            </DesignPreview3DErrorBoundary>
          ) : (
            <DesignIllustration design={design} />
          )}
        </div>
        {canUseWebGL && <p className="design-preview__rotate-hint">{t('customDesign.dragToRotate')}</p>}

        <dl className="design-preview__rows">
          {rows.map((row) => (
            <div key={row.labelKey} className="design-preview__row">
              <dt>{t(row.labelKey)}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
          {showReference && (
            <div className="design-preview__row design-preview__row--reference">
              <dt>{t('customDesign.previewReference')}</dt>
              <dd className="design-preview__reference">
                {referenceImageUrl ? (
                  <img src={referenceImageUrl} alt="" className="design-preview__reference-img" />
                ) : null}
                {design.referenceImageName && (
                  <span className="design-preview__reference-name">{design.referenceImageName}</span>
                )}
              </dd>
            </div>
          )}
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

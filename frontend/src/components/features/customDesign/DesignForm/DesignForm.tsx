import { type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { CustomDesign, CustomDesignOptions } from '@/types/customDesign'
import { applyColorSelection, findMaker, pickDefaultColors } from '@/utils/customDesign'
import ColorSwatches from './ColorSwatches'
import '@/styles/components/DesignForm.css'

interface DesignFormProps {
  design: CustomDesign
  options: CustomDesignOptions
  onChange: (patch: Partial<CustomDesign>) => void
  referenceImageUrl?: string
  referenceImageError?: string
  onReferenceImageChange: (file: File | null) => void
}

function DesignForm({
  design,
  options,
  onChange,
  referenceImageUrl,
  referenceImageError,
  onReferenceImageChange,
}: DesignFormProps) {
  const { t } = useTranslation()

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    onReferenceImageChange(file)
    if (!file) event.target.value = ''
  }

  const clearReference = () => {
    onReferenceImageChange(null)
  }

  const activeMaker = findMaker(options, design.sellerId)
  const makerColors = activeMaker?.colors ?? []

  const handleMakerChange = (sellerId: string) => {
    const maker = findMaker(options, sellerId)
    if (!maker) return
    const { main, accent } = pickDefaultColors(maker)
    if (!main || !accent) return
    onChange({
      sellerId,
      mainColorId: main.id,
      accentColorId: accent.id,
      mainColor: main.hex,
      accentColor: accent.hex,
      mainColorName: main.name,
      accentColorName: accent.name,
    })
  }

  return (
    <form className="design-form" onSubmit={(event) => event.preventDefault()}>
      <p className="design-form__heading">{t('customDesign.formHeading')}</p>

      <section className="design-form__step">
        <span className="design-form__step-number">01</span>
        <div>
          <h2 className="design-form__step-title">{t('customDesign.step1Title')}</h2>
          <p className="design-form__step-hint">{t('customDesign.step1Hint')}</p>
        </div>
      </section>
      <div className="design-form__products" role="radiogroup" aria-label={t('customDesign.baseProductsLabel')}>
        {options.baseProducts.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={design.baseProduct === option.id}
            className={`design-form__product ${design.baseProduct === option.id ? 'design-form__product--active' : ''}`}
            onClick={() => onChange({ baseProduct: option.id })}
          >
            {option.label}
          </button>
        ))}
      </div>

      <section className="design-form__step">
        <span className="design-form__step-number">02</span>
        <div>
          <h2 className="design-form__step-title">{t('customDesign.makerStepTitle')}</h2>
          <p className="design-form__step-hint">{t('customDesign.makerStepHint')}</p>
        </div>
      </section>
      <div className="design-form__makers" role="radiogroup" aria-label={t('customDesign.makerLabel')}>
        {options.makers.map((maker) => (
          <button
            key={maker.id}
            type="button"
            role="radio"
            aria-checked={design.sellerId === maker.id}
            className={`design-form__maker ${design.sellerId === maker.id ? 'design-form__maker--active' : ''}`}
            onClick={() => handleMakerChange(maker.id)}
          >
            <span className="design-form__maker-name">{maker.name}</span>
            <span className="design-form__maker-province">{maker.province}</span>
          </button>
        ))}
      </div>

      <section className="design-form__step">
        <span className="design-form__step-number">03</span>
        <div>
          <h2 className="design-form__step-title">{t('customDesign.step2Title')}</h2>
          <p className="design-form__step-hint">{t('customDesign.step2Hint')}</p>
        </div>
      </section>

      <div className="design-form__grid">
        <div className="design-form__field">
          <label htmlFor="design-style" className="design-form__label">
            {t('customDesign.styleLabel')}
          </label>
          <select
            id="design-style"
            className="design-form__control"
            value={design.style}
            onChange={(event) => onChange({ style: event.target.value })}
          >
            {options.styles.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <ColorSwatches
          label={t('customDesign.mainColorLabel')}
          colors={makerColors}
          value={design.mainColorId}
          onChange={(color) => onChange(applyColorSelection(color, 'main'))}
        />

        <ColorSwatches
          label={t('customDesign.accentColorLabel')}
          colors={makerColors}
          value={design.accentColorId}
          onChange={(color) => onChange(applyColorSelection(color, 'accent'))}
        />

        <div className="design-form__field">
          <label htmlFor="design-accessory" className="design-form__label">
            {t('customDesign.accessoryLabel')}
          </label>
          <select
            id="design-accessory"
            className="design-form__control"
            value={design.accessory}
            onChange={(event) => onChange({ accessory: event.target.value })}
          >
            {options.accessories.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="design-form__field">
          <label htmlFor="design-text" className="design-form__label">
            {t('customDesign.textLabel')}
          </label>
          <input
            id="design-text"
            className="design-form__control"
            placeholder={t('customDesign.textPlaceholder')}
            maxLength={20}
            value={design.text ?? ''}
            onChange={(event) => onChange({ text: event.target.value })}
          />
        </div>

        <div className="design-form__field">
          <label htmlFor="design-reference" className="design-form__label">
            {t('customDesign.referenceLabel')}
          </label>
          <input
            id="design-reference"
            className="design-form__control design-form__file"
            type="file"
            accept="image/*"
            onChange={handleFile}
          />
          {referenceImageError && <p className="text-error design-form__file-error">{referenceImageError}</p>}
          {referenceImageUrl && (
            <div className="design-form__reference-preview">
              <img src={referenceImageUrl} alt="" className="design-form__reference-img" />
              <div className="design-form__reference-meta">
                {design.referenceImageName && (
                  <span className="design-form__reference-name">{design.referenceImageName}</span>
                )}
                <button type="button" className="design-form__reference-remove" onClick={clearReference}>
                  {t('customDesign.referenceRemove')}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="design-form__field design-form__field--full">
          <label htmlFor="design-note" className="design-form__label">
            {t('customDesign.noteLabel')}
          </label>
          <textarea
            id="design-note"
            className="design-form__control design-form__textarea"
            placeholder={t('customDesign.notePlaceholder')}
            maxLength={500}
            value={design.note ?? ''}
            onChange={(event) => onChange({ note: event.target.value })}
          />
        </div>
      </div>
    </form>
  )
}

export default DesignForm

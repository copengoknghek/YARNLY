import { useState, type ChangeEvent } from 'react'
import type { CustomDesign, CustomDesignOptions } from '@/types/customDesign'
import '@/styles/components/DesignForm.css'

interface DesignFormProps {
  design: CustomDesign
  options: CustomDesignOptions
  onChange: (patch: Partial<CustomDesign>) => void
}

const HEX_PATTERN = /^#[0-9a-f]{6}$/i

function ColorField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  const [draft, setDraft] = useState(value)
  const [syncedValue, setSyncedValue] = useState(value)
  if (value !== syncedValue) {
    setSyncedValue(value)
    setDraft(value)
  }

  return (
    <div className="design-form__field">
      <label htmlFor={id} className="design-form__label">
        {label}
      </label>
      <div className="design-form__color">
        <input
          type="color"
          aria-label={`Chọn ${label.toLowerCase()}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <input
          id={id}
          className="design-form__color-text"
          value={draft.toUpperCase()}
          maxLength={7}
          onChange={(event) => {
            const raw = event.target.value
            const next = raw.startsWith('#') ? raw : `#${raw}`
            setDraft(next)
            if (HEX_PATTERN.test(next)) onChange(next.toLowerCase())
          }}
          onBlur={() => setDraft(value)}
        />
      </div>
    </div>
  )
}

function DesignForm({ design, options, onChange }: DesignFormProps) {
  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ referenceImageName: event.target.files?.[0]?.name })
  }

  return (
    <form className="design-form" onSubmit={(event) => event.preventDefault()}>
      <p className="design-form__heading">Tạo mẫu theo yêu cầu</p>

      <section className="design-form__step">
        <span className="design-form__step-number">01</span>
        <div>
          <h2 className="design-form__step-title">Chọn sản phẩm</h2>
          <p className="design-form__step-hint">Chọn nền tảng cho thiết kế của bạn.</p>
        </div>
      </section>
      <div className="design-form__products" role="radiogroup" aria-label="Sản phẩm nền">
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
          <h2 className="design-form__step-title">Kiểu dáng và màu sắc</h2>
          <p className="design-form__step-hint">Phối màu để xem trực tiếp trên hình mô phỏng.</p>
        </div>
      </section>

      <div className="design-form__grid">
        <div className="design-form__field">
          <label htmlFor="design-style" className="design-form__label">
            Kiểu dáng
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

        <ColorField
          id="design-main-color"
          label="Màu chính"
          value={design.mainColor}
          onChange={(mainColor) => onChange({ mainColor })}
        />

        <div className="design-form__field">
          <label htmlFor="design-accessory" className="design-form__label">
            Phụ kiện
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

        <ColorField
          id="design-accent-color"
          label="Màu phụ"
          value={design.accentColor}
          onChange={(accentColor) => onChange({ accentColor })}
        />

        <div className="design-form__field">
          <label htmlFor="design-text" className="design-form__label">
            Tên hoặc chữ muốn thêm
          </label>
          <input
            id="design-text"
            className="design-form__control"
            placeholder="Ví dụ: Anh"
            maxLength={20}
            value={design.text ?? ''}
            onChange={(event) => onChange({ text: event.target.value })}
          />
        </div>

        <div className="design-form__field">
          <label htmlFor="design-reference" className="design-form__label">
            Ảnh mẫu tham khảo
          </label>
          <input
            id="design-reference"
            className="design-form__control design-form__file"
            type="file"
            accept="image/*"
            onChange={handleFile}
          />
        </div>

        <div className="design-form__field design-form__field--full">
          <label htmlFor="design-note" className="design-form__label">
            Mô tả thêm cho Yarnly
          </label>
          <textarea
            id="design-note"
            className="design-form__control design-form__textarea"
            placeholder="Kích thước, phong cách, ..."
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

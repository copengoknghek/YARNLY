import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Icon from '@/components/common/Icon'
import { useClickOutside } from '@/hooks/useClickOutside'
import '@/styles/components/Dropdown.css'

export interface DropdownOption<T extends string> {
  value: T
  label?: string
  labelKey?: string
}

interface DropdownProps<T extends string> {
  label?: string
  labelKey?: string
  value: T
  options: DropdownOption<T>[]
  onChange: (value: T) => void
}

function resolveLabel(option: DropdownOption<string>, translate: (key: string) => string): string {
  if (option.labelKey) return translate(option.labelKey)
  return option.label ?? ''
}

/** Pill button that opens a list of options; shows `label` until a non-empty value is chosen. */
function Dropdown<T extends string>({ label, labelKey, value, options, onChange }: DropdownProps<T>) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  useClickOutside(ref, close, open)

  const displayLabel = labelKey ? t(labelKey) : (label ?? '')
  const selected = options.find((option) => option.value === value)
  const selectedLabel = selected ? resolveLabel(selected, t) : ''
  const buttonText = value && selected ? selectedLabel : displayLabel

  return (
    <div className="dropdown" ref={ref}>
      <button
        type="button"
        className={`dropdown__toggle ${value ? 'dropdown__toggle--active' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${displayLabel}: ${selectedLabel}`}
        onClick={() => setOpen((current) => !current)}
      >
        {buttonText}
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={14} />
      </button>
      {open && (
        <ul className="dropdown__menu" role="listbox" aria-label={displayLabel}>
          {options.map((option) => (
            <li key={option.value || 'all'} role="option" aria-selected={option.value === value}>
              <button
                type="button"
                className={`dropdown__option ${option.value === value ? 'dropdown__option--selected' : ''}`}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
              >
                {resolveLabel(option, t)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dropdown

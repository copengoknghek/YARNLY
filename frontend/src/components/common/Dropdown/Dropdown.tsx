import { useCallback, useRef, useState } from 'react'
import Icon from '@/components/common/Icon'
import { useClickOutside } from '@/hooks/useClickOutside'
import '@/styles/components/Dropdown.css'

export interface DropdownOption<T extends string> {
  value: T
  label: string
}

interface DropdownProps<T extends string> {
  label: string
  value: T
  options: DropdownOption<T>[]
  onChange: (value: T) => void
}

/** Pill button that opens a list of options; shows `label` until a non-empty value is chosen. */
function Dropdown<T extends string>({ label, value, options, onChange }: DropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  useClickOutside(ref, close, open)

  const selected = options.find((option) => option.value === value)
  const buttonText = value && selected ? selected.label : label

  return (
    <div className="dropdown" ref={ref}>
      <button
        type="button"
        className={`dropdown__toggle ${value ? 'dropdown__toggle--active' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${selected?.label ?? ''}`}
        onClick={() => setOpen((current) => !current)}
      >
        {buttonText}
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={14} />
      </button>
      {open && (
        <ul className="dropdown__menu" role="listbox" aria-label={label}>
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
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dropdown

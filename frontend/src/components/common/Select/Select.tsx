import { useId, type SelectHTMLAttributes } from 'react'
import '@/styles/components/Select.css'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: string[]
  placeholder?: string
  error?: string
}

function Select({ label, options, placeholder, error, id, className = '', ...rest }: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div className={`select-field ${className}`}>
      <label htmlFor={selectId} className="visually-hidden">
        {label}
      </label>
      <select
        id={selectId}
        className={`select-field__control ${error ? 'select-field__control--error' : ''}`}
        aria-invalid={Boolean(error)}
        {...rest}
      >
        <option value="">{placeholder ?? label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <span className="select-field__error">{error}</span>}
    </div>
  )
}

export default Select

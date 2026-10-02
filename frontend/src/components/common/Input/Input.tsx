import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import '@/styles/components/Input.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hideLabel?: boolean
  error?: string
  suffix?: ReactNode
}

function Input({ label, hideLabel = false, error, suffix, id, className = '', ...rest }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  return (
    <div className={`input-field ${className}`}>
      <label
        htmlFor={inputId}
        className={hideLabel ? 'visually-hidden' : 'input-field__label'}
      >
        {label}
      </label>
      <div className={`input-field__wrap ${error ? 'input-field__wrap--error' : ''}`}>
        <input
          id={inputId}
          className="input-field__control"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          placeholder={hideLabel ? label : undefined}
          {...rest}
        />
        {suffix && <span className="input-field__suffix">{suffix}</span>}
      </div>
      {error && (
        <span id={errorId} className="input-field__error">
          {error}
        </span>
      )}
    </div>
  )
}

export default Input

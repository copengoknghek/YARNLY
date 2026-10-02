import type { ButtonHTMLAttributes } from 'react'
import '@/styles/components/Button.css'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'outline-green'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  fullWidth?: boolean
}

function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = ['btn', `btn--${variant}`, fullWidth && 'btn--full', className]
    .filter(Boolean)
    .join(' ')

  return <button type={type} className={classes} {...rest} />
}

export default Button

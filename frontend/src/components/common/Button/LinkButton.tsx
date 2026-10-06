import { Link, type LinkProps } from 'react-router-dom'
import type { ButtonVariant } from './Button'
import '@/styles/components/Button.css'

interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant
  fullWidth?: boolean
}

function LinkButton({ variant = 'primary', fullWidth = false, className = '', ...rest }: LinkButtonProps) {
  const classes = ['btn', `btn--${variant}`, fullWidth && 'btn--full', className]
    .filter(Boolean)
    .join(' ')

  return <Link className={classes} {...rest} />
}

export default LinkButton

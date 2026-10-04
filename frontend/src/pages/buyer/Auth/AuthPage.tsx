import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import SocialLogin from '@/components/features/auth/SocialLogin'
import {
  DEMO_SELLER_EMAIL,
  DEMO_SELLER_PASSWORD,
  DEMO_STAFF_EMAIL,
  DEMO_STAFF_PASSWORD,
} from '@/constants/portal'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { getErrorMessage } from '@/services/api'
import type { AuthAudience } from '@/types/portal'
import { getAccessRole } from '@/utils/roles'
import { isValidEmail, isValidPassword, isValidPhone } from '@/utils/validators'
import '@/styles/pages/buyer/Auth.css'

export type AuthMode = 'login' | 'register'

interface AuthValues {
  name: string
  phone: string
  email: string
  password: string
}

type AuthErrors = Partial<Record<keyof AuthValues, string>>

const EMPTY_VALUES: AuthValues = { name: '', phone: '', email: '', password: '' }

const AUDIENCE_OPTIONS: { value: AuthAudience; label: string }[] = [
  { value: 'buyer', label: 'Người mua' },
  { value: 'seller', label: 'Người bán' },
  { value: 'staff', label: 'Nhân viên' },
]

const parseAudience = (value: string | null): AuthAudience =>
  value === 'seller' || value === 'staff' ? value : 'buyer'

const validate = (mode: AuthMode, audience: AuthAudience, values: AuthValues): AuthErrors => {
  const errors: AuthErrors = {}
  if (mode === 'register' && audience !== 'staff') {
    if (!values.name.trim()) errors.name = 'Vui lòng nhập họ tên'
    if (!isValidPhone(values.phone)) errors.phone = 'Số điện thoại không hợp lệ'
  }
  if (!isValidEmail(values.email)) errors.email = 'Email không hợp lệ'
  if (mode === 'register' && audience !== 'staff' ? !isValidPassword(values.password) : !values.password) {
    errors.password =
      mode === 'register' && audience !== 'staff' ? 'Mật khẩu tối thiểu 6 ký tự' : 'Vui lòng nhập mật khẩu'
  }
  return errors
}

const redirectForUser = (audience: AuthAudience) => {
  if (audience === 'seller') return ROUTES.SELLER
  if (audience === 'staff') return ROUTES.ADMIN
  return ROUTES.HOME
}

function AuthPage({ mode }: { mode: AuthMode }) {
  const { login, register, loginSeller, registerSeller, loginStaff, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const redirectTo = (location.state as { from?: string } | null)?.from

  const [audience, setAudience] = useState<AuthAudience>(() => parseAudience(searchParams.get('as')))
  const [values, setValues] = useState<AuthValues>(EMPTY_VALUES)
  const [errors, setErrors] = useState<AuthErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const isLogin = mode === 'login'
  const isStaff = audience === 'staff'
  const showRegisterTab = !isStaff

  useEffect(() => {
    setAudience(parseAudience(searchParams.get('as')))
  }, [searchParams])

  useEffect(() => {
    if (!user) return
    const role = getAccessRole(user)
    if (role === 'seller') navigate(ROUTES.SELLER, { replace: true })
    else if (role === 'admin') navigate(ROUTES.ADMIN, { replace: true })
  }, [user, navigate])

  const updateAudience = (nextAudience: AuthAudience) => {
    setAudience(nextAudience)
    setSubmitError('')
    setNotice('')
    const next = new URLSearchParams(searchParams)
    if (nextAudience === 'buyer') next.delete('as')
    else next.set('as', nextAudience)
    setSearchParams(next, { replace: true })
  }

  const update = (key: keyof AuthValues) => (value: string) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(mode, audience, values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    setSubmitError('')
    try {
      if (audience === 'buyer') {
        if (isLogin) {
          await login({ email: values.email, password: values.password })
        } else {
          await register({
            name: values.name.trim(),
            phone: values.phone.replace(/\s/g, ''),
            email: values.email,
            password: values.password,
          })
        }
      } else if (audience === 'seller') {
        if (isLogin) {
          await loginSeller({ email: values.email, password: values.password })
        } else {
          await registerSeller({
            name: values.name.trim(),
            phone: values.phone.replace(/\s/g, ''),
            email: values.email,
            password: values.password,
          })
        }
      } else {
        await loginStaff({ email: values.email, password: values.password })
      }
      navigate(redirectTo ?? redirectForUser(audience), { replace: true })
    } catch (error) {
      setSubmitError(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page page page--plain">
      <div className="auth-page__card">
        <div className="auth-page__audience" role="group" aria-label="Loại tài khoản">
          {AUDIENCE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`auth-page__audience-btn ${audience === option.value ? 'auth-page__audience-btn--active' : ''}`}
              onClick={() => updateAudience(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {showRegisterTab ? (
          <nav className="auth-page__tabs" aria-label="Đăng nhập hoặc đăng ký">
            <Link
              to={ROUTES.LOGIN}
              state={location.state}
              className={`auth-page__tab ${isLogin ? 'auth-page__tab--active' : ''}`}
              aria-current={isLogin ? 'page' : undefined}
            >
              Đăng nhập
            </Link>
            <Link
              to={ROUTES.REGISTER}
              state={location.state}
              className={`auth-page__tab ${!isLogin ? 'auth-page__tab--active' : ''}`}
              aria-current={!isLogin ? 'page' : undefined}
            >
              Đăng ký
            </Link>
          </nav>
        ) : (
          <h2 className="auth-page__staff-title">Đăng nhập nhân viên</h2>
        )}

        {isStaff && (
          <p className="auth-page__hint">
            Tài khoản mẫu: {DEMO_STAFF_EMAIL} / {DEMO_STAFF_PASSWORD}
          </p>
        )}
        {audience === 'seller' && isLogin && (
          <p className="auth-page__hint">
            Người bán mẫu: {DEMO_SELLER_EMAIL} / {DEMO_SELLER_PASSWORD}
          </p>
        )}

        <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
          <h1 className="visually-hidden">
            {isStaff ? 'Đăng nhập nhân viên' : isLogin ? 'Đăng nhập' : 'Đăng ký tài khoản'}
          </h1>
          {!isLogin && !isStaff && (
            <>
              <Input
                label="Họ và tên *"
                hideLabel
                autoComplete="name"
                className="auth-page__input"
                value={values.name}
                error={errors.name}
                onChange={(event) => update('name')(event.target.value)}
              />
              <Input
                label="Số điện thoại *"
                hideLabel
                type="tel"
                autoComplete="tel"
                className="auth-page__input"
                value={values.phone}
                error={errors.phone}
                onChange={(event) => update('phone')(event.target.value)}
              />
            </>
          )}
          <Input
            label="Email *"
            hideLabel
            type="email"
            autoComplete="email"
            className="auth-page__input"
            value={values.email}
            error={errors.email}
            onChange={(event) => update('email')(event.target.value)}
          />
          <Input
            label="Mật khẩu *"
            hideLabel
            type="password"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            className="auth-page__input"
            value={values.password}
            error={errors.password}
            onChange={(event) => update('password')(event.target.value)}
          />

          {isLogin && audience === 'buyer' && (
            <button
              type="button"
              className="auth-page__link auth-page__forgot"
              onClick={() =>
                setNotice('Vui lòng liên hệ hello@yarnly.vn để được hỗ trợ đặt lại mật khẩu.')
              }
            >
              Quên mật khẩu?
            </button>
          )}

          {submitError && <p className="text-error auth-page__error">{submitError}</p>}
          {notice && <p className="auth-page__notice">{notice}</p>}

          <Button type="submit" fullWidth disabled={submitting} className="auth-page__submit">
            {submitting ? 'Đang xử lý...' : isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </Button>

          <div className="auth-page__footer">
            {showRegisterTab &&
              (isLogin ? (
                <Link to={ROUTES.REGISTER} state={location.state} className="auth-page__link">
                  Tạo tài khoản
                </Link>
              ) : (
                <Link to={ROUTES.LOGIN} state={location.state} className="auth-page__link">
                  Đã có tài khoản? Đăng nhập
                </Link>
              ))}
            <Link to={ROUTES.HOME} className="auth-page__link">
              Trở về cửa hàng
            </Link>
          </div>
        </form>

        {audience === 'buyer' && <SocialLogin />}
      </div>
    </div>
  )
}

export default AuthPage

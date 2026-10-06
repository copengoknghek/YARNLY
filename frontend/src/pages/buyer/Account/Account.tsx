import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Breadcrumb from '@/components/common/Breadcrumb'
import Button from '@/components/common/Button'
import Icon from '@/components/common/Icon'
import Input from '@/components/common/Input'
import Loading from '@/components/common/Loading'
import PageBanner from '@/components/common/PageBanner'
import { ORDER_STATUS_LABEL_KEYS } from '@/constants/orderStatus'
import { ROUTES, orderSuccessPath } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { useFetch } from '@/hooks/useFetch'
import { getErrorMessage } from '@/services/api'
import { getMyOrders } from '@/services/orderService'
import type { User } from '@/types/user'
import { formatDate } from '@/utils/formatDate'
import { countItems } from '@/utils/orderLines'
import { formatPrice } from '@/utils/formatPrice'
import { isValidPhone } from '@/utils/validators'
import '@/styles/pages/buyer/Account.css'

interface ProfileErrors {
  name?: string
  phone?: string
  form?: string
}

function ProfileCard({ user }: { user: User }) {
  const { t } = useTranslation()
  const { updateProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone ?? '')
  const [errors, setErrors] = useState<ProfileErrors>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const startEditing = () => {
    setName(user.name)
    setPhone(user.phone ?? '')
    setErrors({})
    setSaved(false)
    setEditing(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: ProfileErrors = {}
    if (!name.trim()) nextErrors.name = t('common.validation.fullNameRequired')
    if (!isValidPhone(phone)) nextErrors.phone = t('common.validation.phoneInvalid')
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      await updateProfile({ name: name.trim(), phone: phone.replace(/\s/g, '') })
      setEditing(false)
      setSaved(true)
    } catch (error) {
      setErrors({ form: getErrorMessage(error) })
    } finally {
      setSaving(false)
    }
  }

  if (editing) {
    return (
      <form className="account-card" onSubmit={handleSubmit} noValidate>
        <h2 className="account-card__title">{t('account.profileEditTitle')}</h2>
        <Input label={t('common.fullName')} value={name} error={errors.name} onChange={(e) => setName(e.target.value)} />
        <Input
          label={t('common.phone')}
          type="tel"
          value={phone}
          error={errors.phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input label={t('common.email')} type="email" value={user.email} disabled />
        {errors.form && <p className="text-error">{errors.form}</p>}
        <div className="account-card__actions">
          <Button variant="outline" onClick={() => setEditing(false)} disabled={saving}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? t('common.saving') : t('common.saveChanges')}
          </Button>
        </div>
      </form>
    )
  }

  return (
    <section className="account-card">
      <div className="account-card__head">
        <span className="account-card__avatar" aria-hidden="true">
          {user.name.trim().charAt(0).toUpperCase()}
        </span>
        <div>
          <h2 className="account-card__name">{user.name}</h2>
          {user.createdAt && (
            <p className="account-card__since">{t('account.memberSince', { date: formatDate(user.createdAt) })}</p>
          )}
        </div>
      </div>

      <dl className="account-card__info">
        <div>
          <dt>{t('common.email')}</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>{t('common.phone')}</dt>
          <dd>{user.phone || t('account.phoneNotSet')}</dd>
        </div>
      </dl>

      {saved && <p className="account-card__saved">{t('account.profileSaved')}</p>}
      <Button variant="outline-green" onClick={startEditing}>
        {t('account.profileEditButton')}
      </Button>
    </section>
  )
}

function OrderHistory() {
  const { t } = useTranslation()
  const { data: orders, loading, error } = useFetch(getMyOrders)

  return (
    <section className="account-orders" aria-live="polite">
      <h2 className="account-orders__title">{t('account.ordersTitle')}</h2>
      {loading && <Loading />}
      {error && <p className="text-error">{error}</p>}
      {orders && orders.length === 0 && (
        <p className="account-orders__empty">
          {t('account.ordersEmpty')} <Link to={ROUTES.PRODUCTS}>{t('account.shopNow')}</Link>
        </p>
      )}
      {orders && orders.length > 0 && (
        <ul className="account-orders__list">
          {orders.map((order) => (
            <li key={order.id} className="account-order">
              <div className="account-order__main">
                <strong>{t('account.orderTitle', { code: order.code })}</strong>
                <span className="account-order__meta">
                  {t('account.orderMeta', { date: formatDate(order.createdAt), count: countItems(order) })}
                </span>
              </div>
              <span className="account-order__status">{t(ORDER_STATUS_LABEL_KEYS[order.status])}</span>
              <span className="account-order__total">{formatPrice(order.total)}</span>
              <Link to={orderSuccessPath(order.id)} className="account-order__link">
                {t('account.orderDetail')} <Icon name="arrow-right" size={12} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function Account() {
  const { t } = useTranslation()
  const { user } = useAuth()
  if (!user) return null

  return (
    <div className="account">
      <PageBanner title={t('account.pageTitle')} />
      <div className="container page">
        <Breadcrumb
          items={[
            { label: t('common.breadcrumb.home'), to: ROUTES.HOME },
            { label: t('account.pageTitle') },
          ]}
        />
        <div className="account__layout">
          <ProfileCard user={user} />
          <OrderHistory />
        </div>
      </div>
    </div>
  )
}

export default Account

import { useMemo, useState, type FormEvent } from 'react'
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
import { useFetch } from '@/hooks/useFetch'
import { lookupOrders } from '@/services/orderService'
import type { Order, OrderLookupQuery } from '@/types/order'
import { formatPrice } from '@/utils/formatPrice'
import { isValidEmail, isValidPhone } from '@/utils/validators'
import '@/styles/pages/buyer/OrderLookup.css'

type LookupMethod = 'phone' | 'email'

function LookupResult({ order }: { order: Order }) {
  const { t } = useTranslation()

  return (
    <article className="lookup-result">
      <header className="lookup-result__header">
        <h3>{t('orderLookup.orderTitle', { code: order.code })}</h3>
        <span className="lookup-result__status">{t(ORDER_STATUS_LABEL_KEYS[order.status])}</span>
      </header>
      <ul className="lookup-result__items">
        {order.items.map((item, index) => (
          <li key={`${item.product.id}-${index}`} className="lookup-result__item">
            <span className="lookup-result__thumb">
              <img src={item.product.images[0]} alt="" />
              <span>{item.quantity}</span>
            </span>
            <span className="lookup-result__name">{item.product.name}</span>
            <span className="lookup-result__price">{formatPrice(item.unitPrice * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="lookup-result__tracking">
        {t('orderLookup.trackingLabel')}{' '}
        <strong>{order.trackingCode ?? t('orderLookup.trackingPending')}</strong>
      </p>
      <Link to={orderSuccessPath(order.id)} className="lookup-result__link">
        {t('orderLookup.viewDetail')} <Icon name="arrow-right" size={14} />
      </Link>
    </article>
  )
}

function OrderLookup() {
  const { t } = useTranslation()
  const [method, setMethod] = useState<LookupMethod>('phone')
  const [value, setValue] = useState('')
  const [inputError, setInputError] = useState('')
  const [query, setQuery] = useState<OrderLookupQuery | null>(null)

  const fetcher = useMemo(() => (query ? () => lookupOrders(query) : null), [query])
  const { data: orders, loading, error } = useFetch(fetcher)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = value.trim()
    if (method === 'phone' && !isValidPhone(trimmed)) {
      setInputError(t('common.validation.phoneInvalid'))
      return
    }
    if (method === 'email' && !isValidEmail(trimmed)) {
      setInputError(t('common.validation.emailInvalid'))
      return
    }
    setInputError('')
    setQuery(method === 'phone' ? { phone: trimmed.replace(/\s/g, '') } : { email: trimmed })
  }

  return (
    <div className="order-lookup">
      <PageBanner title={t('orderLookup.pageTitle')} />

      <div className="container page">
        <Breadcrumb
          items={[
            { label: t('common.breadcrumb.home'), to: ROUTES.HOME },
            { label: t('orderLookup.pageTitle') },
          ]}
        />

        <div className="order-lookup__layout">
          <form className="order-lookup__form" onSubmit={handleSubmit} noValidate>
            <h2 className="order-lookup__title">
              <Icon name="search" size={14} /> {t('orderLookup.title')}
            </h2>

            <fieldset className="order-lookup__methods">
              <legend>{t('orderLookup.methodsLegend')}</legend>
              {(
                [
                  ['phone', 'orderLookup.methodPhone'],
                  ['email', 'orderLookup.methodEmail'],
                ] as const
              ).map(([key, labelKey]) => (
                <label key={key} className="order-lookup__method">
                  <input
                    type="radio"
                    name="lookup-method"
                    checked={method === key}
                    onChange={() => {
                      setMethod(key)
                      setValue('')
                      setInputError('')
                    }}
                  />
                  {t(labelKey)}
                </label>
              ))}
            </fieldset>

            <Input
              label={method === 'phone' ? t('common.phone') : t('common.email')}
              type={method === 'phone' ? 'tel' : 'email'}
              placeholder={
                method === 'phone' ? t('orderLookup.phonePlaceholder') : t('orderLookup.emailPlaceholder')
              }
              value={value}
              error={inputError}
              onChange={(event) => setValue(event.target.value)}
            />

            <p className="order-lookup__hint">{t('orderLookup.hint')}</p>
            <Button type="submit" className="order-lookup__submit">
              {t('orderLookup.submit')}
            </Button>
          </form>

          <section className="order-lookup__results" aria-live="polite">
            {!query && <p className="order-lookup__placeholder">{t('orderLookup.placeholder')}</p>}
            {loading && <Loading />}
            {error && <p className="text-error">{error}</p>}
            {orders && orders.length === 0 && (
              <p className="order-lookup__placeholder">{t('orderLookup.notFound')}</p>
            )}
            {orders?.map((order) => <LookupResult key={order.id} order={order} />)}

            <Link to={ROUTES.CART} className="order-lookup__back">
              <Icon name="chevron-left" size={12} /> {t('common.backToCart')}
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}

export default OrderLookup

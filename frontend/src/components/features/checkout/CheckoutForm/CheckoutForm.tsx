import { useTranslation } from 'react-i18next'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import { LOCATIONS, PROVINCES } from '@/constants/locations'
import type { ShippingInfo } from '@/types/order'
import '@/styles/components/CheckoutForm.css'

export type CheckoutErrors = Partial<Record<keyof ShippingInfo, string>>

interface CheckoutFormProps {
  value: ShippingInfo
  note: string
  errors: CheckoutErrors
  onChange: (patch: Partial<ShippingInfo>) => void
  onNoteChange: (note: string) => void
}

function CheckoutForm({ value, note, errors, onChange, onNoteChange }: CheckoutFormProps) {
  const { t } = useTranslation()
  const districts = value.province ? Object.keys(LOCATIONS[value.province] ?? {}) : []
  const wards = value.province && value.district ? (LOCATIONS[value.province]?.[value.district] ?? []) : []

  return (
    <fieldset className="checkout-form">
      <legend className="checkout-form__title">{t('checkout.formTitle')}</legend>

      <Input
        label={t('common.email')}
        hideLabel
        type="email"
        autoComplete="email"
        value={value.email}
        error={errors.email}
        onChange={(event) => onChange({ email: event.target.value })}
      />
      <Input
        label={t('common.fullName')}
        hideLabel
        autoComplete="name"
        value={value.fullName}
        error={errors.fullName}
        onChange={(event) => onChange({ fullName: event.target.value })}
      />
      <Input
        label={t('common.phone')}
        hideLabel
        type="tel"
        autoComplete="tel"
        value={value.phone}
        error={errors.phone}
        onChange={(event) => onChange({ phone: event.target.value })}
        suffix={<img src="/images/flags/vn.svg" alt={t('common.country')} width={16} height={11} />}
      />
      <Input
        label={t('checkout.address')}
        hideLabel
        autoComplete="street-address"
        value={value.address}
        error={errors.address}
        onChange={(event) => onChange({ address: event.target.value })}
      />
      <Select
        label={t('checkout.province')}
        options={PROVINCES}
        value={value.province}
        error={errors.province}
        onChange={(event) => onChange({ province: event.target.value, district: '', ward: '' })}
      />
      <Select
        label={t('checkout.district')}
        options={districts}
        value={value.district}
        error={errors.district}
        disabled={!value.province}
        onChange={(event) => onChange({ district: event.target.value, ward: '' })}
      />
      <Select
        label={t('checkout.ward')}
        options={wards}
        value={value.ward}
        error={errors.ward}
        disabled={!value.district}
        onChange={(event) => onChange({ ward: event.target.value })}
      />

      <label htmlFor="checkout-note" className="visually-hidden">
        {t('checkout.noteLabel')}
      </label>
      <textarea
        id="checkout-note"
        className="checkout-form__note"
        placeholder={t('checkout.notePlaceholder')}
        maxLength={500}
        value={note}
        onChange={(event) => onNoteChange(event.target.value)}
      />
    </fieldset>
  )
}

export default CheckoutForm

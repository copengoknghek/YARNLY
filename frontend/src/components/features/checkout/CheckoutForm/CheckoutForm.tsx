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
  const districts = value.province ? Object.keys(LOCATIONS[value.province] ?? {}) : []
  const wards = value.province && value.district ? (LOCATIONS[value.province]?.[value.district] ?? []) : []

  return (
    <fieldset className="checkout-form">
      <legend className="checkout-form__title">Thông tin mua hàng</legend>

      <Input
        label="Email"
        hideLabel
        type="email"
        autoComplete="email"
        value={value.email}
        error={errors.email}
        onChange={(event) => onChange({ email: event.target.value })}
      />
      <Input
        label="Họ và tên"
        hideLabel
        autoComplete="name"
        value={value.fullName}
        error={errors.fullName}
        onChange={(event) => onChange({ fullName: event.target.value })}
      />
      <Input
        label="Số điện thoại"
        hideLabel
        type="tel"
        autoComplete="tel"
        value={value.phone}
        error={errors.phone}
        onChange={(event) => onChange({ phone: event.target.value })}
        suffix={<img src="/images/flags/vn.svg" alt="Việt Nam" width={16} height={11} />}
      />
      <Input
        label="Địa chỉ chi tiết"
        hideLabel
        autoComplete="street-address"
        value={value.address}
        error={errors.address}
        onChange={(event) => onChange({ address: event.target.value })}
      />
      <Select
        label="Tỉnh thành"
        options={PROVINCES}
        value={value.province}
        error={errors.province}
        onChange={(event) => onChange({ province: event.target.value, district: '', ward: '' })}
      />
      <Select
        label="Quận huyện"
        options={districts}
        value={value.district}
        error={errors.district}
        disabled={!value.province}
        onChange={(event) => onChange({ district: event.target.value, ward: '' })}
      />
      <Select
        label="Phường xã"
        options={wards}
        value={value.ward}
        error={errors.ward}
        disabled={!value.district}
        onChange={(event) => onChange({ ward: event.target.value })}
      />

      <label htmlFor="checkout-note" className="visually-hidden">
        Ghi chú
      </label>
      <textarea
        id="checkout-note"
        className="checkout-form__note"
        placeholder="Ghi chú (không bắt buộc)"
        maxLength={500}
        value={note}
        onChange={(event) => onNoteChange(event.target.value)}
      />
    </fieldset>
  )
}

export default CheckoutForm

// Keep in sync with backend/src/services/orderService.js
const LOCAL_PROVINCE = 'Đà Nẵng'
const LOCAL_SHIPPING_FEE = 12000
const DEFAULT_SHIPPING_FEE = 30000

export const calculateShippingFee = (province: string) =>
  province === LOCAL_PROVINCE ? LOCAL_SHIPPING_FEE : DEFAULT_SHIPPING_FEE

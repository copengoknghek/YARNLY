const formatter = new Intl.NumberFormat('vi-VN')

export const formatPrice = (value: number) => `${formatter.format(value)}đ`

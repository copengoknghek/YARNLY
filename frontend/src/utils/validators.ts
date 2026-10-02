export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const isValidPhone = (value: string) => /^(0|\+84)\d{9}$/.test(value.replace(/\s/g, ''))

export const isValidPassword = (value: string) => value.length >= 6

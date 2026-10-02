export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CUSTOM_DESIGN: '/custom-design',
  BLIND_BOX: '/blind-box',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/orders/:id/success',
  ORDER_LOOKUP: '/order-lookup',
  LOGIN: '/login',
  REGISTER: '/register',
  SELLER: '/seller',
  ADMIN: '/admin',
} as const

export const productDetailPath = (id: string) => `/products/${id}`

export const orderSuccessPath = (id: string) => `/orders/${id}/success`

export const productsSearchPath = (search: string) =>
  `${ROUTES.PRODUCTS}?search=${encodeURIComponent(search)}`

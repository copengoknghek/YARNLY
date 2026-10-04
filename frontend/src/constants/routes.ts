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
  SELLER_PRODUCTS: '/seller/products',
  SELLER_NEW_PRODUCT: '/seller/products/new',
  SELLER_EDIT_PRODUCT: '/seller/products/:id/edit',
  SELLER_INVENTORY: '/seller/inventory',
  ADMIN: '/admin',
  ADMIN_APPROVALS: '/admin/approvals',
  ADMIN_ORDERS: '/admin/orders',
} as const

export const sellerEditProductPath = (id: string) => `/seller/products/${id}/edit`

export const productDetailPath = (id: string) => `/products/${id}`

export const orderSuccessPath = (id: string) => `/orders/${id}/success`

export const productsSearchPath = (search: string) =>
  `${ROUTES.PRODUCTS}?search=${encodeURIComponent(search)}`

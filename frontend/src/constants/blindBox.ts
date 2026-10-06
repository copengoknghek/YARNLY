export type BlindBoxPackageKey = 'basic' | 'couple' | 'rare'

export const BLIND_BOX_STEPS = [
  {
    number: '01',
    titleKey: 'blindBox.steps.choose.title',
    descriptionKey: 'blindBox.steps.choose.description',
  },
  {
    number: '02',
    titleKey: 'blindBox.steps.prepare.title',
    descriptionKey: 'blindBox.steps.prepare.description',
  },
  {
    number: '03',
    titleKey: 'blindBox.steps.open.title',
    descriptionKey: 'blindBox.steps.open.description',
  },
] as const

export interface BlindBoxPackage {
  productId: string
  packageKey: BlindBoxPackageKey
  price: number
  featured?: boolean
}

/** Product ids match the blind box products served by the backend. */
export const BLIND_BOX_PACKAGES: BlindBoxPackage[] = [
  {
    productId: 'bb-basic',
    packageKey: 'basic',
    price: 179000,
  },
  {
    productId: 'bb-couple',
    packageKey: 'couple',
    price: 329000,
    featured: true,
  },
  {
    productId: 'bb-rare',
    packageKey: 'rare',
    price: 499000,
  },
]

export const BLIND_BOX_IMAGE = '/images/products/hop-qua-bi-an.jpg'

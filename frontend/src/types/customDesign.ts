export interface CustomDesignOption {
  id: string
  label: string
  price: number
  image?: string
}

export interface YarnColorOption {
  id: string
  name: string
  hex: string
  inStock: boolean
}

export interface DesignMaker {
  id: string
  name: string
  province: string
  colors: YarnColorOption[]
}

export interface CustomDesignOptions {
  baseProducts: CustomDesignOption[]
  styles: CustomDesignOption[]
  accessories: CustomDesignOption[]
  textPrice: number
  makers: DesignMaker[]
}

export interface CustomDesign {
  baseProduct: string
  style: string
  accessory: string
  sellerId: string
  mainColorId: string
  accentColorId: string
  mainColor: string
  accentColor: string
  mainColorName?: string
  accentColorName?: string
  text?: string
  note?: string
  referenceImageName?: string
}

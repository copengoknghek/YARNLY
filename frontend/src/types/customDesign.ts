export interface CustomDesignOption {
  id: string
  label: string
  price: number
  image?: string
}

export interface CustomDesignOptions {
  baseProducts: CustomDesignOption[]
  styles: CustomDesignOption[]
  accessories: CustomDesignOption[]
  textPrice: number
}

export interface CustomDesign {
  baseProduct: string
  style: string
  accessory: string
  mainColor: string
  accentColor: string
  text?: string
  note?: string
  referenceImageName?: string
}

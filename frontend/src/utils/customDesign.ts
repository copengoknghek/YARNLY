import type { CustomDesign, CustomDesignOptions } from '@/types/customDesign'

/** Mirrors the server-side quote in backend/src/services/customDesignService.js. */
export const calculateDesignPrice = (design: CustomDesign, options: CustomDesignOptions) => {
  const base = options.baseProducts.find((option) => option.id === design.baseProduct)
  const style = options.styles.find((option) => option.id === design.style)
  const accessory = options.accessories.find((option) => option.id === design.accessory)
  const textPrice = design.text?.trim() ? options.textPrice : 0
  return (base?.price ?? 0) + (style?.price ?? 0) + (accessory?.price ?? 0) + textPrice
}

export const findLabel = (list: { id: string; label: string }[], id: string) =>
  list.find((option) => option.id === id)?.label ?? ''

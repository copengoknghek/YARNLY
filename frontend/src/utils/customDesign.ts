import type { CustomDesign, CustomDesignOptions, DesignMaker, YarnColorOption } from '@/types/customDesign'

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

export const findMaker = (options: CustomDesignOptions, sellerId: string) =>
  options.makers.find((maker) => maker.id === sellerId)

export const pickDefaultColors = (maker: DesignMaker) => {
  const inStock = maker.colors.filter((color) => color.inStock)
  const main = inStock[0]
  const accent = inStock[1] ?? inStock[0]
  return { main, accent }
}

export const buildInitialDesign = (options: CustomDesignOptions): CustomDesign | null => {
  const maker = options.makers[0]
  if (!maker) return null
  const { main, accent } = pickDefaultColors(maker)
  if (!main || !accent) return null
  return {
    baseProduct: options.baseProducts[0]?.id ?? 'doll',
    style: 'chibi',
    accessory: 'bow',
    sellerId: maker.id,
    mainColorId: main.id,
    accentColorId: accent.id,
    mainColor: main.hex,
    accentColor: accent.hex,
    mainColorName: main.name,
    accentColorName: accent.name,
  }
}

export const findColorName = (maker: DesignMaker | undefined, colorId: string) =>
  maker?.colors.find((color) => color.id === colorId)?.name ?? ''

export const applyColorSelection = (color: YarnColorOption, field: 'main' | 'accent'): Partial<CustomDesign> =>
  field === 'main'
    ? {
        mainColorId: color.id,
        mainColor: color.hex,
        mainColorName: color.name,
      }
    : {
        accentColorId: color.id,
        accentColor: color.hex,
        accentColorName: color.name,
      }

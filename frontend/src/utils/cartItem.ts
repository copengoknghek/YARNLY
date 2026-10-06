import i18n from '@/i18n'
import type { SelectedOptions } from '@/types/cart'
import type { CustomDesign } from '@/types/customDesign'

/** Short one-line summary of the choices attached to a cart or order line. */
export const describeItemOptions = (selectedOptions?: SelectedOptions, customDesign?: CustomDesign) => {
  if (customDesign) {
    return [
      i18n.t('categories.custom'),
      customDesign.text && `${i18n.t('customDesign.previewText')}: ${customDesign.text}`,
    ]
      .filter(Boolean)
      .join(' · ')
  }
  if (!selectedOptions) return ''
  return [selectedOptions.color, selectedOptions.size, selectedOptions.leadTime].filter(Boolean).join(' · ')
}

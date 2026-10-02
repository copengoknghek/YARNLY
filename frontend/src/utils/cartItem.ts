import type { SelectedOptions } from '@/types/cart'
import type { CustomDesign } from '@/types/customDesign'

/** Short one-line summary of the choices attached to a cart or order line. */
export const describeItemOptions = (selectedOptions?: SelectedOptions, customDesign?: CustomDesign) => {
  if (customDesign) {
    return ['Làm theo yêu cầu', customDesign.text && `Chữ: ${customDesign.text}`].filter(Boolean).join(' · ')
  }
  if (!selectedOptions) return ''
  return [selectedOptions.color, selectedOptions.size, selectedOptions.leadTime].filter(Boolean).join(' · ')
}

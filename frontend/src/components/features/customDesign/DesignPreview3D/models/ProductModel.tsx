import { ACCESSORY_ANCHORS } from '../anchors'
import Accessory from './Accessory'
import Animal from './Animal'
import Bag from './Bag'
import Bouquet from './Bouquet'
import Doll from './Doll'

interface ProductModelProps {
  baseProduct: string
  main: string
  accent: string
  accessory: string
}

function BaseProduct({ baseProduct, main, accent }: Omit<ProductModelProps, 'accessory'>) {
  switch (baseProduct) {
    case 'doll':
      return <Doll main={main} accent={accent} />
    case 'bag':
      return <Bag main={main} accent={accent} />
    case 'bouquet':
      return <Bouquet main={main} accent={accent} />
    default:
      return <Animal main={main} accent={accent} />
  }
}

function ProductModel({ baseProduct, main, accent, accessory }: ProductModelProps) {
  const anchor = accessory !== 'none' ? ACCESSORY_ANCHORS[baseProduct]?.[accessory] : undefined

  return (
    <group>
      <BaseProduct baseProduct={baseProduct} main={main} accent={accent} />
      {anchor && (
        <group
          position={anchor.position}
          rotation={anchor.rotation ?? [0, 0, 0]}
          scale={anchor.scale ?? 1}
        >
          <Accessory type={accessory} accent={accent} />
        </group>
      )}
    </group>
  )
}

export default ProductModel

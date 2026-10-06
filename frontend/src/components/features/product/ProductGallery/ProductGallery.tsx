import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import '@/styles/components/ProductGallery.css'

interface ProductGalleryProps {
  images: string[]
  name: string
}

function ProductGallery({ images, name }: ProductGalleryProps) {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const active = images[activeIndex] ?? images[0]
  const thumbnails = images.length > 1 ? images : []

  return (
    <div className="gallery">
      <div className="gallery__main">
        <img src={active} alt={name} />
      </div>
      {thumbnails.length > 0 && (
        <ul className="gallery__thumbs" aria-label={t('productDetail.galleryThumbsLabel')}>
          {thumbnails.map((image, index) => (
            <li key={image}>
              <button
                type="button"
                className={`gallery__thumb ${index === activeIndex ? 'gallery__thumb--active' : ''}`}
                aria-label={t('productDetail.galleryViewImage', { index: index + 1 })}
                aria-pressed={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              >
                <img src={image} alt="" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ProductGallery

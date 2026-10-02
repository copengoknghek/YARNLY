import { useId, useState } from 'react'
import Icon from '@/components/common/Icon'
import '@/styles/components/FaqAccordion.css'

interface FaqItem {
  question: string
  answer: string
}

function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const baseId = useId()

  return (
    <div className="faq">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        const panelId = `${baseId}-panel-${index}`
        return (
          <div key={item.question} className={`faq__item ${isOpen ? 'faq__item--open' : ''}`}>
            <button
              type="button"
              className="faq__question"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span>{item.question}</span>
              <span className="faq__icon">
                <Icon name={isOpen ? 'minus' : 'plus'} size={14} />
              </span>
            </button>
            <div id={panelId} className="faq__answer" hidden={!isOpen}>
              {item.answer}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default FaqAccordion

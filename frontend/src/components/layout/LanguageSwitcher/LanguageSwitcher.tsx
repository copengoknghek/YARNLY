import { useCallback, useRef, useState } from 'react'
import Icon from '@/components/common/Icon'
import { LANGUAGES, type LanguageCode } from '@/constants/navigation'
import { useClickOutside } from '@/hooks/useClickOutside'
import '@/styles/components/LanguageSwitcher.css'

function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<LanguageCode>('vi')
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  useClickOutside(ref, close, open)

  const active = LANGUAGES.find((lang) => lang.code === current) ?? LANGUAGES[0]

  return (
    <div className="lang-switcher" ref={ref}>
      <button
        type="button"
        className="lang-switcher__toggle"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <img src={active.flag} alt="" className="lang-switcher__flag" />
        <span>{active.short}</span>
        <Icon name="chevron-down" size={14} />
      </button>

      {open && (
        <ul className="lang-switcher__menu" role="listbox" aria-label="Ngôn ngữ">
          {LANGUAGES.filter((lang) => lang.code !== current).map((lang) => (
            <li key={lang.code} role="option" aria-selected={false}>
              <button
                type="button"
                className="lang-switcher__option"
                onClick={() => {
                  setCurrent(lang.code)
                  setOpen(false)
                }}
              >
                <img src={lang.flag} alt="" className="lang-switcher__flag" />
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LanguageSwitcher

import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Icon from '@/components/common/Icon'
import { LANGUAGES, type LanguageCode } from '@/constants/navigation'
import { useClickOutside } from '@/hooks/useClickOutside'
import '@/styles/components/LanguageSwitcher.css'

function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  useClickOutside(ref, close, open)

  const currentCode = (i18n.language.split('-')[0] as LanguageCode) || 'vi'
  const active = LANGUAGES.find((lang) => lang.code === currentCode) ?? LANGUAGES[0]

  const selectLanguage = (code: LanguageCode) => {
    void i18n.changeLanguage(code)
    setOpen(false)
  }

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
        <ul className="lang-switcher__menu" role="listbox" aria-label={t('languageSwitcher.label')}>
          {LANGUAGES.filter((lang) => lang.code !== currentCode).map((lang) => (
            <li key={lang.code} role="option" aria-selected={false}>
              <button
                type="button"
                className="lang-switcher__option"
                onClick={() => selectLanguage(lang.code)}
              >
                <img src={lang.flag} alt="" className="lang-switcher__flag" />
                {t(lang.labelKey)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LanguageSwitcher

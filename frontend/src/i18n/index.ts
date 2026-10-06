import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import vi from './locales/vi.json'
import zh from './locales/zh.json'

export const LANG_STORAGE_KEY = 'yarnly_lang'

const INTL_LOCALE_MAP = {
  vi: 'vi-VN',
  en: 'en-US',
  zh: 'zh-CN',
} as const

type SupportedLang = keyof typeof INTL_LOCALE_MAP

export function getIntlLocale(lng?: string): string {
  const code = (lng ?? i18n.language ?? 'vi').split('-')[0] as SupportedLang
  return INTL_LOCALE_MAP[code] ?? INTL_LOCALE_MAP.vi
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      vi: { translation: vi },
      en: { translation: en },
      zh: { translation: zh },
    },
    fallbackLng: 'vi',
    supportedLngs: ['vi', 'en', 'zh'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANG_STORAGE_KEY,
      caches: ['localStorage'],
    },
  })

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = getIntlLocale(lng)
})

document.documentElement.lang = getIntlLocale(i18n.language)

export default i18n

import { getIntlLocale } from '@/i18n'

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat(getIntlLocale(), {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).format(new Date(iso))

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export const weeksBetween = (fromIso: string, toIso: string) =>
  Math.max(1, Math.round((new Date(toIso).getTime() - new Date(fromIso).getTime()) / WEEK_MS))

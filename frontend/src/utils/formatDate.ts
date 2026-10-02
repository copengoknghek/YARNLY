const dateFormatter = new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'numeric', year: 'numeric' })

export const formatDate = (iso: string) => dateFormatter.format(new Date(iso))

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export const weeksBetween = (fromIso: string, toIso: string) =>
  Math.max(1, Math.round((new Date(toIso).getTime() - new Date(fromIso).getTime()) / WEEK_MS))

import { useTranslation } from 'react-i18next'
import '@/styles/components/Pagination.css'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

const MAX_VISIBLE = 5

function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const { t } = useTranslation()

  if (totalPages <= 1) return null

  const start = Math.max(1, Math.min(page - 2, totalPages - MAX_VISIBLE + 1))
  const end = Math.min(totalPages, start + MAX_VISIBLE - 1)
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <nav className="pagination" aria-label={t('common.pagination.nav')}>
      {pages.map((number) => (
        <button
          key={number}
          type="button"
          className={`pagination__item ${number === page ? 'pagination__item--active' : ''}`}
          aria-current={number === page ? 'page' : undefined}
          onClick={() => onChange(number)}
        >
          {number}
        </button>
      ))}
      {end < totalPages && (
        <button
          type="button"
          className="pagination__item"
          onClick={() => onChange(end + 1)}
          aria-label={t('common.pagination.nextPage')}
        >
          …
        </button>
      )}
    </nav>
  )
}

export default Pagination

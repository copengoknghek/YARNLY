import { useTranslation } from 'react-i18next'
import '@/styles/components/Loading.css'

function Loading({ text }: { text?: string }) {
  const { t } = useTranslation()

  return (
    <div className="loading" role="status">
      <span className="loading__spinner" />
      <span className="loading__text">{text ?? t('common.loadingEllipsis')}</span>
    </div>
  )
}

export default Loading

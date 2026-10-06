import { useTranslation } from 'react-i18next'
import { LinkButton } from '@/components/common/Button'
import { ROUTES } from '@/constants/routes'
import '@/styles/pages/buyer/NotFound.css'

function NotFound() {
  const { t } = useTranslation()

  return (
    <section className="not-found page page--plain">
      <p className="not-found__code">{t('notFound.code')}</p>
      <h1 className="display-title display-title--sm">{t('notFound.title')}</h1>
      <p className="text-muted">{t('notFound.description')}</p>
      <LinkButton to={ROUTES.HOME}>{t('notFound.backHome')}</LinkButton>
    </section>
  )
}

export default NotFound

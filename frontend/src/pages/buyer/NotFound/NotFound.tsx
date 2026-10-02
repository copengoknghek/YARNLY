import { LinkButton } from '@/components/common/Button'
import { ROUTES } from '@/constants/routes'
import '@/styles/pages/buyer/NotFound.css'

function NotFound() {
  return (
    <section className="not-found page page--plain">
      <p className="not-found__code">404</p>
      <h1 className="display-title display-title--sm">Không tìm thấy trang</h1>
      <p className="text-muted">Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
      <LinkButton to={ROUTES.HOME}>Về trang chủ</LinkButton>
    </section>
  )
}

export default NotFound

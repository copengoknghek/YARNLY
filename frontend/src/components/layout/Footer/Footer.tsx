import { Link } from 'react-router-dom'
import Newsletter from '@/components/features/marketing/Newsletter'
import { FOOTER_CONTACT, FOOTER_EXPLORE, FOOTER_SUPPORT } from '@/constants/navigation'
import { ROUTES } from '@/constants/routes'
import '@/styles/components/Footer.css'

const CURRENT_YEAR = new Date().getFullYear()

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="container">
          <Newsletter />

          <div className="footer__columns">
            <div className="footer__brand">
              <Link to={ROUTES.HOME} aria-label="Yarnly - Trang chủ">
                <img src="/images/brand/logo.png" alt="YARNLY" className="footer__logo" />
              </Link>
              <p className="footer__tagline">
                Vẻ đẹp từ đôi bàn tay, mang hơi ấm đến từng ngôi nhà.
              </p>
            </div>

            <div className="footer__column">
              <h3 className="footer__heading">Khám phá</h3>
              <ul className="footer__list">
                {FOOTER_EXPLORE.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="footer__link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__column">
              <h3 className="footer__heading">Liên hệ</h3>
              <ul className="footer__list">
                {FOOTER_CONTACT.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>

            <div className="footer__column">
              <h3 className="footer__heading">Hỗ trợ khách hàng</h3>
              <ul className="footer__list">
                {FOOTER_SUPPORT.map((label) => (
                  <li key={label}>
                    <a href="#" className="footer__link">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <p className="footer__copyright">© {CURRENT_YEAR} Yarnly Handmade with love.</p>
    </footer>
  )
}

export default Footer

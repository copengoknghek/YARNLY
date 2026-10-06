import '@/styles/components/PageBanner.css'

interface PageBannerProps {
  title: string
  subtitle?: string
}

function PageBanner({ title, subtitle }: PageBannerProps) {
  return (
    <section className="page-banner">
      <h1 className="page-banner__title">{title}</h1>
      {subtitle && <p className="page-banner__subtitle">{subtitle}</p>}
    </section>
  )
}

export default PageBanner

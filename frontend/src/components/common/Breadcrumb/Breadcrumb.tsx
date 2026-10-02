import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import '@/styles/components/Breadcrumb.css'

export interface BreadcrumbItem {
  label: string
  to?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <Fragment key={item.label}>
          {index > 0 && <span className="breadcrumb__separator">/</span>}
          {item.to ? (
            <Link to={item.to} className="breadcrumb__link">
              {item.label}
            </Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumb

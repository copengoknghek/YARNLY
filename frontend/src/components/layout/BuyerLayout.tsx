import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import TopMarquee from '@/components/layout/TopMarquee'
import '@/styles/components/BuyerLayout.css'

function BuyerLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="buyer-layout">
      <TopMarquee />
      <div className="buyer-layout__header">
        <Header />
      </div>
      <main className="buyer-layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default BuyerLayout

import { Route, Routes } from 'react-router-dom'
import AdminLayout from '@/components/layout/AdminLayout'
import BuyerLayout from '@/components/layout/BuyerLayout'
import SellerLayout from '@/components/layout/SellerLayout'
import { ROUTES } from '@/constants/routes'
import AdminDashboard from '@/pages/admin/Dashboard'
import { Login, Register } from '@/pages/buyer/Auth'
import BlindBox from '@/pages/buyer/BlindBox'
import Cart from '@/pages/buyer/Cart'
import Checkout from '@/pages/buyer/Checkout'
import CustomDesign from '@/pages/buyer/CustomDesign'
import Home from '@/pages/buyer/Home'
import NotFound from '@/pages/buyer/NotFound'
import OrderLookup from '@/pages/buyer/OrderLookup'
import OrderSuccess from '@/pages/buyer/OrderSuccess'
import ProductDetail from '@/pages/buyer/ProductDetail'
import Products from '@/pages/buyer/Products'
import SellerDashboard from '@/pages/seller/Dashboard'
import RequireRole from './RequireRole'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<BuyerLayout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.PRODUCTS} element={<Products />} />
        <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetail />} />
        <Route path={ROUTES.CUSTOM_DESIGN} element={<CustomDesign />} />
        <Route path={ROUTES.BLIND_BOX} element={<BlindBox />} />
        <Route path={ROUTES.CART} element={<Cart />} />
        <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
        <Route path={ROUTES.ORDER_SUCCESS} element={<OrderSuccess />} />
        <Route path={ROUTES.ORDER_LOOKUP} element={<OrderLookup />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<RequireRole allow={['seller']} />}>
        <Route path={ROUTES.SELLER} element={<SellerLayout />}>
          <Route index element={<SellerDashboard />} />
        </Route>
      </Route>

      <Route element={<RequireRole allow={['admin']} />}>
        <Route path={ROUTES.ADMIN} element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes

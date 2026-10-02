import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthProvider'
import { CartProvider } from '@/context/CartProvider'
import AppRoutes from '@/routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

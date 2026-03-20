import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { Layout } from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import OrderList from './pages/orders/OrderList'
import OrderDetail from './pages/orders/OrderDetail'
import ProductList from './pages/products/ProductList'
import ProductForm from './pages/products/ProductForm'
import CustomerList from './pages/customers/CustomerList'
import InventoryList from './pages/inventory/InventoryList'
import CollectionList from './pages/collections/CollectionList'
import CategoryList from './pages/categories/CategoryList'
import DiscountList from './pages/discounts/DiscountList'
import GiftCardList from './pages/giftcards/GiftCardList'
import CouponList from './pages/coupons/CouponList'
import UserList from './pages/users/UserList'
import Settings from './pages/Settings'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
})

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
          <p className="text-slate-400 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return <Layout>{children}</Layout>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/pedidos" element={<PrivateRoute><OrderList /></PrivateRoute>} />
      <Route path="/pedidos/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
      <Route path="/produtos" element={<PrivateRoute><ProductList /></PrivateRoute>} />
      <Route path="/produtos/novo" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
      <Route path="/produtos/:id" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
      <Route path="/clientes" element={<PrivateRoute><CustomerList /></PrivateRoute>} />
      <Route path="/estoque" element={<PrivateRoute><InventoryList /></PrivateRoute>} />
      <Route path="/colecoes" element={<PrivateRoute><CollectionList /></PrivateRoute>} />
      <Route path="/categorias" element={<PrivateRoute><CategoryList /></PrivateRoute>} />
      <Route path="/descontos" element={<PrivateRoute><DiscountList /></PrivateRoute>} />
      <Route path="/gift-cards" element={<PrivateRoute><GiftCardList /></PrivateRoute>} />
      <Route path="/cupons" element={<PrivateRoute><CouponList /></PrivateRoute>} />
      <Route path="/usuarios" element={<PrivateRoute><UserList /></PrivateRoute>} />
      <Route path="/configuracoes" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'dark:bg-slate-800 dark:text-white text-sm',
                duration: 3000,
              }}
            />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

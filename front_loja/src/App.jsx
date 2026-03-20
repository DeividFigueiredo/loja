import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Cart from './components/Cart.jsx'
import Home from './pages/Home.jsx'
import QuemSomos from './pages/QuemSomos.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Contato from './pages/Contato.jsx'

export default function App() {
  const location = useLocation()

  return (
    <CartProvider>
      <Navbar />
      <Cart />
      <main key={location.pathname} className="page-enter">
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/quem-somos" element={<QuemSomos />} />
          <Route path="/catalogo"   element={<Catalogo />} />
          <Route path="/contato"    element={<Contato />} />
        </Routes>
      </main>
      <Footer />
    </CartProvider>
  )
}

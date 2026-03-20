import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

const MenuIcon = () => (
  <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
    <line x1="0"  y1="1"  x2="22" y2="1"  stroke="currentColor" strokeWidth="1.5"/>
    <line x1="5"  y1="7"  x2="22" y2="7"  stroke="currentColor" strokeWidth="1.5"/>
    <line x1="10" y1="13" x2="22" y2="13" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <line x1="1" y1="1"  x2="19" y2="19" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="19" y1="1" x2="1"  y2="19" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)
const CartIcon = () => (
  <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
    <path d="M1 1h3l2.4 9.6M6 1h15l-2.4 9.6H6.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9"  cy="17" r="1.5" fill="currentColor"/>
    <circle cx="18" cy="17" r="1.5" fill="currentColor"/>
  </svg>
)

const LINKS = [
  { to: '/',           label: 'Home' },
  { to: '/quem-somos', label: 'Quem Somos' },
  { to: '/catalogo',   label: 'Catálogo' },
  { to: '/contato',    label: 'Contato' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalItems, setIsOpen } = useCart()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }, [location])

  const solid = scrolled || !isHome

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: solid ? '70px' : '90px',
        display: 'flex', alignItems: 'center',
        transition: 'all 0.38s cubic-bezier(0.4,0,0.2,1)',
        /* Fundo sólido creme claro quando scrollado ou fora da home */
        background: solid
          ? '#fdfbf4'   /* --bg-s1 */
          : 'linear-gradient(180deg, rgba(253,251,244,0.82) 0%, transparent 100%)',
        backdropFilter: solid ? 'blur(14px)' : 'none',
        /* borda inferior olive suave */
        borderBottom: solid ? '1px solid rgba(187,187,136,0.30)' : 'none',
        boxShadow: solid ? '0 2px 20px rgba(30,26,14,0.07)' : 'none',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', lineHeight: 1 }}>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: solid ? '24px' : '28px',
              fontWeight: 300,
              color: '#1e1a0e',           /* --ink sempre visível */
              letterSpacing: '0.06em',
              transition: 'font-size 0.35s ease',
            }}>Guandu</div>
            <span style={{
              display: 'block',
              fontFamily: 'var(--font-sans)',
              fontSize: '8px', fontWeight: 500,
              letterSpacing: '5px', textTransform: 'uppercase',
              color: '#787848',           /* --olive */
              marginTop: '3px',
            }}>Mármores & Granitos</span>
          </Link>

          {/* Links desktop */}
          <ul className="nav-desktop" style={{ display: 'flex', gap: '48px', listStyle: 'none', alignItems: 'center' }}>
            {LINKS.map(l => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  style={({ isActive }) => ({
                    fontFamily: 'var(--font-sans)',
                    fontSize: '11px', fontWeight: 400,
                    letterSpacing: '3px', textTransform: 'uppercase',
                    color: isActive ? '#c47040' : '#1e1a0e',   /* accent vs ink */
                    textDecoration: 'none',
                    transition: 'color 0.22s ease',
                    paddingBottom: '3px',
                    borderBottom: isActive ? '1px solid #c47040' : '1px solid transparent',
                  })}
                  onMouseEnter={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.color = '#c47040' }}
                  onMouseLeave={e => { if (!e.currentTarget.getAttribute('aria-current')) e.currentTarget.style.color = '#1e1a0e' }}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Carrinho + toggle mobile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Abrir carrinho"
              style={{ color: '#1e1a0e', position: 'relative', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 0 }}
            >
              <CartIcon />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>
            <button
              className="nav-mobile-toggle"
              onClick={() => {
                const next = !menuOpen
                setMenuOpen(next)
                document.body.style.overflow = next ? 'hidden' : ''
              }}
              style={{ color: '#1e1a0e', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 0 }}
              aria-label="Menu"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Menu mobile */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: '#fdfbf4',         /* bg-s1 sólido */
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '44px',
        }}>
          {/* Decoração suave no fundo */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `
              linear-gradient(117deg, transparent 30%, rgba(238,194,144,0.12) 30.5%, transparent 32%),
              linear-gradient(78deg,  transparent 20%, rgba(187,187,136,0.10) 20.5%, transparent 22%)
            `,
          }} />
          {LINKS.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              style={({ isActive }) => ({
                fontFamily: 'var(--font-serif)',
                fontSize: '42px', fontWeight: 300,
                color: isActive ? '#c47040' : '#1e1a0e',
                letterSpacing: '0.04em',
                position: 'relative', zIndex: 1,
              })}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 769px) { .nav-mobile-toggle { display: none !important; } }
        @media (max-width: 768px) { .nav-desktop       { display: none !important; } }
      `}</style>
    </>
  )
}

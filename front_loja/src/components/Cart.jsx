import React, { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'

const GATEWAY = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3000'

const CloseIcon = () => <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><line x1="1" y1="1" x2="19" y2="19" stroke="currentColor" strokeWidth="1.5"/><line x1="19" y1="1" x2="1" y2="19" stroke="currentColor" strokeWidth="1.5"/></svg>
const TrashIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>

const fmt = cents => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(cents/100)

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, isOpen, setIsOpen, totalItems, totalPrice } = useCart()
  const [loading, setLoading] = useState(false)
  const [email,   setEmail]   = useState('')
  const [error,   setError]   = useState('')

  async function checkout() {
    if (!email) { setError('Informe seu e-mail para continuar.'); return }
    setError(''); setLoading(true)
    try {
      const res = await fetch(`${GATEWAY}/api/checkout`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ lineItems: items.map(i=>({variantId:i.variantId,quantity:i.quantity})), email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error||'Erro ao criar pedido')
      clearCart(); setIsOpen(false); window.open(data.invoiceUrl,'_blank')
    } catch(err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={() => setIsOpen(false)} />}

      <div className={`cart-panel ${isOpen?'open':''}`}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'26px 32px', borderBottom:'1px solid rgba(187,187,136,0.25)' }}>
          <div>
            <div style={{ fontFamily:'var(--font-serif)', fontSize:'24px', fontWeight:300, color:'#1e1a0e' }}>Seu Carrinho</div>
            <div style={{ fontSize:'10px', letterSpacing:'3px', textTransform:'uppercase', color:'#787848', marginTop:'4px' }}>
              {totalItems} {totalItems===1?'item':'itens'}
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ color:'#7a6e58', background:'none', border:'none', cursor:'pointer', lineHeight:0 }}><CloseIcon /></button>
        </div>

        {/* Items */}
        <div style={{ flex:1, overflowY:'auto', padding:'24px 32px' }}>
          {items.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'200px', gap:'12px' }}>
              <div style={{ width:'44px', height:'44px', border:'1.5px solid rgba(187,187,136,0.35)', display:'flex', alignItems:'center', justifyContent:'center', color:'#a89880', fontSize:'18px' }}>◈</div>
              <p style={{ color:'#7a6e58', fontSize:'12px', letterSpacing:'3px', textTransform:'uppercase' }}>Carrinho vazio</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
              {items.map(item => {
                const variant = item.product?.variants?.find(v => v.id === item.variantId)
                const price   = variant?.prices?.[0]?.amount ?? 0
                const thumb   = item.product?.images?.[0]?.url

                return (
                  <div key={item.variantId} style={{ display:'flex', gap:'14px', paddingBottom:'24px', borderBottom:'1px solid rgba(187,187,136,0.20)' }}>
                    <div style={{ width:'68px', height:'68px', flexShrink:0, background:'#f5ece0', overflow:'hidden', border:'1px solid rgba(187,187,136,0.25)' }}>
                      {thumb
                        ? <img src={thumb} alt={item.product.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#a89880', fontSize:'18px' }}>◈</div>
                      }
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:'var(--font-serif)', fontSize:'17px', fontWeight:300, color:'#1e1a0e', marginBottom:'4px' }}>{item.product?.title}</div>
                      {variant?.title && variant.title!=='Default Variant' && (
                        <div style={{ fontSize:'10px', color:'#787848', letterSpacing:'2px', marginBottom:'10px' }}>{variant.title}</div>
                      )}
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        {/* Qty */}
                        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                          {['−','+'].map((s,idx) => (
                            <button key={s} onClick={() => updateQuantity(item.variantId, item.quantity+(idx===0?-1:1))}
                              style={{ color:'#1e1a0e', background:'none', border:'1px solid rgba(187,187,136,0.4)', width:'26px', height:'26px', cursor:'pointer', fontSize:'15px', display:'flex', alignItems:'center', justifyContent:'center', transition:'border-color 0.2s' }}
                              onMouseEnter={e => e.currentTarget.style.borderColor='#c47040'}
                              onMouseLeave={e => e.currentTarget.style.borderColor='rgba(187,187,136,0.4)'}
                            >{s}</button>
                          ))}
                          <span style={{ fontSize:'14px', color:'#1e1a0e', minWidth:'20px', textAlign:'center' }}>{item.quantity}</span>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                          <span style={{ fontFamily:'var(--font-serif)', fontSize:'18px', fontWeight:300, color:'#1e1a0e' }}>{fmt(price*item.quantity)}</span>
                          <button onClick={() => removeItem(item.variantId)} style={{ color:'#a89880', background:'none', border:'none', cursor:'pointer', lineHeight:0, transition:'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color='#c47040'}
                            onMouseLeave={e => e.currentTarget.style.color='#a89880'}
                          ><TrashIcon /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding:'24px 32px', borderTop:'1px solid rgba(187,187,136,0.25)', background:'#faf5e4' }}>
            <input type="email" placeholder="Seu e-mail para o pedido" value={email} onChange={e => setEmail(e.target.value)} className="form-input" style={{ marginBottom:'14px' }} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px', paddingBottom:'16px', borderBottom:'1px solid rgba(187,187,136,0.22)' }}>
              <span style={{ fontSize:'10px', letterSpacing:'3px', textTransform:'uppercase', color:'#787848' }}>Total</span>
              <span style={{ fontFamily:'var(--font-serif)', fontSize:'26px', fontWeight:300, color:'#1e1a0e' }}>
                {new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(totalPrice)}
              </span>
            </div>
            {error && <p style={{ fontSize:'12px', color:'#c04040', marginBottom:'12px' }}>{error}</p>}
            <button className="btn-accent" style={{ width:'100%', justifyContent:'center', opacity:loading?0.7:1 }} onClick={checkout} disabled={loading}>
              <span>{loading?'Processando...':'Finalizar Pedido'}</span>
            </button>
          </div>
        )}
      </div>
    </>
  )
}

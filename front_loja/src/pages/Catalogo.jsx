import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts.js'
import { useCart } from '../context/CartContext.jsx'

const FALLBACK = [
  { id:'f1', title:'Mármore Carrara Bianco',    description:'O clássico mármore italiano com veias cinza suaves sobre fundo branco. Ideal para bancadas e revestimentos.', images:[{url:'https://images.unsplash.com/photo-1615800001964-0f50aa6e0d12?w=600&q=80&auto=format&fit=crop'}], collection:{title:'Mármore'},    variants:[{id:'v1',title:'Padrão'}] },
  { id:'f2', title:'Granito Negro São Gabriel', description:'Granito negro absoluto de alta resistência. Perfeito para ambientes contemporâneos e projetos ousados.',            images:[{url:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop'}], collection:{title:'Granito'},    variants:[{id:'v2',title:'Padrão'}] },
  { id:'f3', title:'Quartzito Taj Mahal',        description:'Veios dourados sobre fundo creme. Uma das pedras mais cobiçadas do mercado de luxo.',                            images:[{url:'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&q=80&auto=format&fit=crop'}], collection:{title:'Quartzito'}, variants:[{id:'v3',title:'Padrão'}] },
  { id:'f4', title:'Mármore Statuario',          description:'O mais nobre dos mármores brancos. Veios marcantes criam peças únicas de apelo estético.',                       images:[{url:'https://images.unsplash.com/photo-1615800001965-b92e5bf38b67?w=600&q=80&auto=format&fit=crop'}], collection:{title:'Mármore'},    variants:[{id:'v4',title:'Padrão'}] },
  { id:'f5', title:'Granito Verde Ubatuba',      description:'Granito nacional com tonalidades verdes. Durabilidade e beleza para áreas externas e internas.',                  images:[{url:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80&auto=format&fit=crop'}], collection:{title:'Granito'},    variants:[{id:'v5',title:'Padrão'}] },
  { id:'f6', title:'Quartzito Mont Blanc',       description:'Leveza e transparência em veios suaves. Elegância para projetos minimalistas de alto padrão.',                    images:[{url:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80&auto=format&fit=crop'}], collection:{title:'Quartzito'}, variants:[{id:'v6',title:'Padrão'}] },
  { id:'f7', title:'Mármore Calacatta',          description:'Veios dourados e cinza sobre fundo branco luminoso. A escolha dos grandes arquitetos.',                           images:[{url:'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=600&q=80&auto=format&fit=crop'}], collection:{title:'Mármore'},    variants:[{id:'v7',title:'Padrão'}] },
  { id:'f8', title:'Granito Branco Siena',       description:'Granito claro e refinado para cozinhas e banheiros modernos.',                                                     images:[{url:'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600&q=80&auto=format&fit=crop'}], collection:{title:'Granito'},    variants:[{id:'v8',title:'Padrão'}] },
  { id:'f9', title:'Travertino Romano',          description:'Pedra sedimentar italiana com textura porosa única. Clássico e atemporal para fachadas e pisos.',                 images:[{url:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80&auto=format&fit=crop'}], collection:{title:'Travertino'}, variants:[{id:'v9',title:'Padrão'}] },
]

function ProductCard({ product, onAddToCart }) {
  const img     = product.images?.[0]?.url
  const variant = product.variants?.[0]
  const price   = variant?.prices?.[0]?.amount
  const cat     = product.collection?.title || product.type?.value || 'Pedra Natural'

  return (
    <div className="product-card">
      <div style={{ overflow:'hidden', position:'relative' }}>
        {img
          ? <img src={img} alt={product.title} className="product-card__image" />
          : <div style={{ width:'100%', aspectRatio:'4/3', background:'#f5ece0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'40px', color:'#bbbb88' }}>◈</div>
        }
        <div style={{
          position:'absolute', top:'14px', left:'14px',
          background:'rgba(253,251,244,0.92)', backdropFilter:'blur(6px)',
          padding:'4px 12px', fontSize:'9px', fontWeight:500,
          letterSpacing:'3px', textTransform:'uppercase', color:'#787848',
          border:'1px solid rgba(187,187,136,0.35)',
        }}>{cat}</div>
      </div>
      <div className="product-card__body">
        <div className="product-card__name">{product.title}</div>
        {product.description && <div className="product-card__desc">{product.description}</div>}
        <div className="product-card__footer">
          {price
            ? <div className="product-card__price">{new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(price/100)}</div>
            : <div style={{fontSize:'11px',letterSpacing:'3px',textTransform:'uppercase',color:'#7a6e58'}}>Sob Consulta</div>
          }
          <button className="product-card__btn" onClick={() => variant && onAddToCart(product, variant.id)}>
            <span>{price ? 'Adicionar' : 'Solicitar'}</span><span>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Catalogo() {
  const { products: api, loading } = useProducts(50)
  const { addItem } = useCart()
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [search, setSearch] = useState('')

  const products = api.length > 0 ? api : FALLBACK

  const categories = useMemo(() => {
    const s = new Set(products.map(p => p.collection?.title || p.type?.value || 'Outros'))
    return ['Todos', ...s]
  }, [products])

  const filtered = useMemo(() => products.filter(p => {
    const cat = p.collection?.title || p.type?.value || 'Outros'
    return (activeFilter === 'Todos' || cat === activeFilter)
        && (!search || p.title.toLowerCase().includes(search.toLowerCase()))
  }), [products, activeFilter, search])

  return (
    <div>

      {/* ══ HERO ══ */}
      <section style={{
        padding:'160px 0 72px',
        background:'#fdfbf4',
        borderBottom:'1px solid rgba(187,187,136,0.25)',
        position:'relative', overflow:'hidden',
      }}>
        {/* Veios suaves */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:`linear-gradient(117deg, transparent 30%, rgba(238,194,144,0.07) 30.5%, transparent 32%), linear-gradient(78deg, transparent 20%, rgba(187,187,136,0.06) 20.5%, transparent 22%)` }} />
        <div className="container" style={{ position:'relative' }}>
          <div className="section-label">Nossa Coleção</div>
          <h1 style={{ fontSize:'clamp(44px,6vw,88px)', fontWeight:300, color:'#1e1a0e', lineHeight:1.0, letterSpacing:'-0.02em', marginBottom:'18px' }}>
            Catálogo de Pedras
          </h1>
          <p style={{ fontSize:'16px', color:'#4e4432', maxWidth:'480px', lineHeight:1.85 }}>
            Explore nossa seleção de mármores, granitos e quartzitos. Cada pedra é uma obra única da natureza.
          </p>
        </div>
      </section>

      {/* ══ FILTROS sticky ══ */}
      <div style={{
        position:'sticky', top:'70px', zIndex:50,
        background:'rgba(253,251,244,0.97)', backdropFilter:'blur(16px)',
        borderBottom:'1px solid rgba(187,187,136,0.25)',
        boxShadow:'0 2px 12px rgba(30,26,14,0.06)',
      }}>
        <div className="container" style={{ padding:'14px 48px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'14px', flexWrap:'wrap' }}>
          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveFilter(cat)}
                style={{
                  padding:'7px 18px',
                  background: activeFilter === cat ? '#c47040' : 'transparent',
                  color:       activeFilter === cat ? '#fff'    : '#7a6e58',
                  border:'1.5px solid',
                  borderColor: activeFilter === cat ? '#c47040' : 'rgba(187,187,136,0.4)',
                  fontSize:'10px', fontWeight:500, letterSpacing:'2px', textTransform:'uppercase',
                  cursor:'pointer', transition:'all 0.22s ease', fontFamily:'var(--font-sans)',
                }}
                onMouseEnter={e => { if (activeFilter!==cat){ e.currentTarget.style.borderColor='#c47040'; e.currentTarget.style.color='#c47040' } }}
                onMouseLeave={e => { if (activeFilter!==cat){ e.currentTarget.style.borderColor='rgba(187,187,136,0.4)'; e.currentTarget.style.color='#7a6e58' } }}
              >{cat}</button>
            ))}
          </div>
          <input type="text" placeholder="Buscar produto..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ background:'#ffffff', border:'1.5px solid rgba(187,187,136,0.35)', color:'#1e1a0e', padding:'7px 16px', fontSize:'13px', fontFamily:'var(--font-sans)', outline:'none', width:'220px', transition:'border-color 0.22s ease' }}
            onFocus={e  => e.target.style.borderColor='#c47040'}
            onBlur={e   => e.target.style.borderColor='rgba(187,187,136,0.35)'}
          />
        </div>
      </div>

      {/* ══ GRID  fundo: #f5ece0, cards: branco ══ */}
      <section style={{ padding:'72px 0 120px', background:'#f5ece0' }}>
        <div className="container">
          {loading ? <div className="spinner" />
            : filtered.length === 0
              ? <div style={{ textAlign:'center', padding:'80px 0', color:'#7a6e58' }}>
                  <div style={{ fontSize:'40px', marginBottom:'20px', opacity:0.3 }}>◈</div>
                  <p style={{ fontSize:'16px', letterSpacing:'2px' }}>Nenhum produto encontrado</p>
                </div>
              : <>
                  <div style={{ fontSize:'11px', letterSpacing:'3px', textTransform:'uppercase', color:'#787848', marginBottom:'32px' }}>
                    {filtered.length} {filtered.length===1?'produto':'produtos'}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:'24px' }}>
                    {filtered.map(p => <ProductCard key={p.id} product={p} onAddToCart={addItem} />)}
                  </div>
                </>
          }
        </div>
      </section>

      {/* ══ CTA pedido especial ══ */}
      <section style={{ padding:'100px 0', textAlign:'center', background:'#f2e8d6', borderTop:'1px solid rgba(187,187,136,0.20)' }}>
        <div className="container">
          <div style={{ maxWidth:'540px', margin:'0 auto' }}>
            <div className="section-label" style={{ justifyContent:'center' }}>Pedido Especial</div>
            <h2 style={{ fontSize:'clamp(26px,3.5vw,44px)', fontWeight:300, color:'#1e1a0e', marginBottom:'18px' }}>
              Não encontrou o que procura?
            </h2>
            <p style={{ fontSize:'15px', color:'#4e4432', lineHeight:1.9, marginBottom:'36px' }}>
              Trabalhamos com pedidos personalizados. Nossa equipe encontrará a pedra perfeita para o seu projeto.
            </p>
            <Link to="/contato" className="btn-accent"><span>Solicitar Pedido Especial</span></Link>
          </div>
        </div>
      </section>
    </div>
  )
}

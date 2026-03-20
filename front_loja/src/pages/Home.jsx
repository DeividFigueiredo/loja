import React from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts.js'
import { useCart } from '../context/CartContext.jsx'

const HERO_IMG  = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=85&auto=format&fit=crop'
const MID_IMG   = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80&auto=format&fit=crop'

/* ── seção de fundo → fundo da seção, card sempre branco ── */
const S = {
  hero:     '#f7f2e4',   /* overlay quente — fundo amarelo-palha leve */
  pillars:  '#fdfbf4',   /* quase branco quente */
  products: '#f5ece0',   /* pêssego suave */
  split:    '#faf5e4',   /* amarelo palha claro */
  stats:    '#faf5e4',
  cta:      '#f2e8d6',   /* mais saturado, ancora o fim da página */
}

const pillars = [
  { num: '01', title: 'Qualidade Superior',  desc: 'Selecionamos as melhores pedras do Brasil e do mundo, garantindo beleza e durabilidade incomparáveis em cada projeto.' },
  { num: '02', title: 'Tradição & Expertise', desc: 'Décadas de experiência no corte, polimento e instalação de pedras naturais para ambientes verdadeiramente exigentes.' },
  { num: '03', title: 'Projetos Exclusivos',  desc: 'Cada peça é única. Trabalhamos com designers e arquitetos para criar espaços que refletem elegância e singularidade.' },
]

const stats = [
  { number: '20+',    label: 'Anos de Experiência' },
  { number: '1.200+', label: 'Projetos Realizados' },
  { number: '300+',   label: 'Tipos de Pedras' },
  { number: '100%',   label: 'Clientes Satisfeitos' },
]

const FALLBACK = [
  { id:'f1', title:'Mármore Carrara Bianco', category:'Mármore',  desc:'O clássico mármore italiano com veias cinza suaves sobre fundo branco.', img:'https://images.unsplash.com/photo-1615800001964-0f50aa6e0d12?w=600&q=80&auto=format&fit=crop' },
  { id:'f2', title:'Granito Negro São Gabriel', category:'Granito', desc:'Granito negro absoluto de alta resistência. Perfeito para ambientes contemporâneos.', img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop' },
  { id:'f3', title:'Quartzito Taj Mahal',    category:'Quartzito', desc:'Veios dourados sobre fundo creme. Uma das pedras mais cobiçadas do mercado de luxo.', img:'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&q=80&auto=format&fit=crop' },
]

function ProductCard({ product }) {
  const { addItem } = useCart()
  const img     = product.images?.[0]?.url || product.img
  const variant = product.variants?.[0]
  const price   = variant?.prices?.[0]?.amount
  const cat     = product.collection?.title || product.type?.value || product.category || 'Pedra Natural'

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
        <div className="product-card__desc">{product.description || product.desc}</div>
        <div className="product-card__footer">
          {price
            ? <div className="product-card__price">{new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(price/100)}</div>
            : <div style={{fontSize:'11px',letterSpacing:'3px',textTransform:'uppercase',color:'#7a6e58'}}>Sob Consulta</div>
          }
          <button className="product-card__btn" onClick={() => variant && addItem(product, variant.id)}>
            <span>{price ? 'Adicionar' : 'Solicitar'}</span><span>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const { products, loading } = useProducts(6)
  const list = products.length > 0 ? products : FALLBACK

  return (
    <div>

      {/* ══ HERO ══
          Fundo = imagem de mármore.
          Overlay: gradiente quente palha→pêssego (NÃO branco puro).
          Isso deixa o mármore aparecer com tonalidade quente.
      ══ */}
      <section style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', overflow:'hidden' }}>
        {/* Marble photo */}
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:`url(${HERO_IMG})`,
          backgroundSize:'cover', backgroundPosition:'center 35%',
        }} />
        {/* Overlay QUENTE — palha + pêssego, semi-transparente */}
        <div style={{
          position:'absolute', inset:0,
          background:`
            linear-gradient(130deg,
              rgba(238,221,153,0.72) 0%,
              rgba(238,194,144,0.55) 45%,
              rgba(238,170,136,0.30) 80%,
              transparent 100%
            )
          `,
        }} />
        {/* Gradiente de fade em cima para a navbar */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'200px', background:'linear-gradient(180deg, rgba(247,242,228,0.50) 0%, transparent 100%)' }} />

        <div className="container" style={{ position:'relative', zIndex:2, paddingTop:'120px', paddingBottom:'100px' }}>
          <div style={{ maxWidth:'680px' }}>
            <div className="section-label">Marmoraria de Luxo</div>
            <h1 style={{
              fontSize:'clamp(56px,8vw,108px)',
              fontWeight:300, color:'#1e1a0e',
              lineHeight:0.95, letterSpacing:'-0.02em', marginBottom:'14px',
            }}>
              Pedra que<br/>
              <em style={{ color:'#c47040', fontStyle:'italic' }}>fala</em><br/>
              por si
            </h1>
            <div style={{ width:'56px', height:'2px', background:'#c47040', margin:'32px 0', opacity:0.7 }} />
            <p style={{ fontSize:'17px', color:'#3a3420', lineHeight:1.85, marginBottom:'48px', maxWidth:'440px', fontWeight:300 }}>
              Mármores, granitos e quartzitos selecionados para transformar seus ambientes em obras de arte permanentes.
            </p>
            <div style={{ display:'flex', gap:'14px', flexWrap:'wrap' }}>
              <Link to="/catalogo" className="btn-accent"><span>Ver Catálogo</span></Link>
              <Link to="/contato"  className="btn-outline"><span>Solicitar Orçamento</span></Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position:'absolute', bottom:'36px', left:'50%',
          transform:'translateX(-50%)',
          display:'flex', flexDirection:'column', alignItems:'center', gap:'8px',
          animation:'bounce 2.5s ease-in-out infinite',
        }}>
          <div style={{ width:'1px', height:'44px', background:'linear-gradient(180deg,#c47040,transparent)' }} />
          <span style={{ fontSize:'9px', letterSpacing:'4px', textTransform:'uppercase', color:'#c47040' }}>Scroll</span>
        </div>
        <style>{`@keyframes bounce{0%,100%{opacity:.5;transform:translateX(-50%) translateY(0);}50%{opacity:1;transform:translateX(-50%) translateY(8px);}}`}</style>
      </section>

      {/* ══ TIRA DECORATIVA ══ */}
      <div style={{ height:'4px', background:`linear-gradient(90deg, #bbbb88, #eedd99, #eec290, #eeaa88, #eec290, #eedd99, #bbbb88)` }} />

      {/* ══ PILARES ══  fundo: bg-s1 (#fdfbf4), cards: branco ══ */}
      <section style={{ padding:'120px 0', background:S.pillars }}>
        <div className="container">
          <div style={{ display:'flex', gap:'64px', alignItems:'flex-start', flexWrap:'wrap', marginBottom:'72px' }}>
            <div style={{ flex:'0 0 auto' }}>
              <div className="section-label">Por que a Guandu</div>
              <h2 style={{ fontSize:'clamp(34px,4vw,54px)', fontWeight:300, maxWidth:'300px', lineHeight:1.1, color:'#1e1a0e' }}>
                Nossa<br/>Essência
              </h2>
            </div>
            <p style={{ flex:1, minWidth:'260px', fontSize:'15px', color:'#4e4432', lineHeight:1.9, paddingTop:'44px', maxWidth:'480px' }}>
              Somos movidos pela paixão pela beleza natural das pedras. Cada projeto é tratado como uma obra de arte única — do planejamento ao acabamento final.
            </p>
          </div>

          {/* Cards sobre fundo #fdfbf4 → cards brancos com sombra para destacar */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'20px' }}>
            {pillars.map((p,i) => (
              <div key={i} style={{
                background:'#ffffff',
                border:'1.5px solid rgba(187,187,136,0.28)',
                boxShadow:'0 2px 0 rgba(187,187,136,0.4), 0 8px 28px rgba(30,26,14,0.10)',
                padding:'48px 40px',
                transition:'transform 0.3s ease, box-shadow 0.3s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 2px 0 rgba(238,170,136,0.5),0 16px 40px rgba(30,26,14,0.14)' }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 0 rgba(187,187,136,0.4),0 8px 28px rgba(30,26,14,0.10)' }}
              >
                {/* topo olive */}
                <div style={{ width:'32px', height:'2px', background:'#bbbb88', marginBottom:'28px' }} />
                <div style={{ fontFamily:'var(--font-serif)', fontSize:'11px', color:'#787848', letterSpacing:'4px', marginBottom:'16px' }}>{p.num}</div>
                <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'26px', fontWeight:300, color:'#1e1a0e', marginBottom:'14px' }}>{p.title}</h3>
                <p style={{ fontSize:'14px', color:'#4e4432', lineHeight:1.85 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRODUTOS  fundo: bg-s4 (#f5ece0), cards: branco ══ */}
      <section style={{ padding:'120px 0', background:S.products }}>
        <div className="container">
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'60px', flexWrap:'wrap', gap:'24px' }}>
            <div>
              <div className="section-label">Nosso Catálogo</div>
              <h2 style={{ fontSize:'clamp(30px,4vw,52px)', fontWeight:300, color:'#1e1a0e' }}>
                Pedras em<br/>Destaque
              </h2>
            </div>
            <Link to="/catalogo" style={{
              fontFamily:'var(--font-sans)', fontSize:'11px', fontWeight:500,
              letterSpacing:'3px', textTransform:'uppercase', color:'#c47040',
              display:'flex', alignItems:'center', gap:'10px', transition:'gap 0.3s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.gap='18px'}
              onMouseLeave={e => e.currentTarget.style.gap='10px'}
            >Ver todos <span>→</span></Link>
          </div>

          {loading
            ? <div className="spinner" />
            : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:'24px' }}>
                {list.slice(0,3).map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )
          }
        </div>
      </section>

      {/* ══ SPLIT: imagem + texto ══ */}
      <section style={{ display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:'580px' }}>
        <div style={{ overflow:'hidden', minHeight:'360px' }}>
          <img src={MID_IMG} alt="Mármore" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
        </div>
        <div style={{ background:S.split, display:'flex', alignItems:'center', padding:'72px 64px' }}>
          <div>
            <div className="section-label">Nosso Processo</div>
            <h2 style={{ fontSize:'clamp(28px,3.5vw,50px)', fontWeight:300, color:'#1e1a0e', marginBottom:'24px', lineHeight:1.1 }}>
              Transformamos<br/><em style={{ color:'#c47040', fontStyle:'italic' }}>pedra em arte</em>
            </h2>
            <p style={{ fontSize:'15px', color:'#4e4432', lineHeight:1.9, marginBottom:'36px', maxWidth:'400px' }}>
              Da extração ao acabamento final, cada etapa é conduzida com rigor técnico e sensibilidade estética.
            </p>
            <Link to="/quem-somos" className="btn-outline"><span>Nossa História</span></Link>
          </div>
        </div>
      </section>

      {/* ══ STATS  fundo: bg-s2 (#faf5e4) ══ */}
      <section style={{ padding:'90px 0', background:S.stats, borderTop:'1px solid rgba(187,187,136,0.20)', borderBottom:'1px solid rgba(187,187,136,0.20)' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))' }}>
            {stats.map((s,i) => (
              <div key={i} style={{
                padding:'44px 28px', textAlign:'center',
                borderRight: i < stats.length-1 ? '1px solid rgba(187,187,136,0.25)' : 'none',
              }}>
                <div style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(48px,5vw,72px)', fontWeight:300, color:'#c47040', lineHeight:1, marginBottom:'10px' }}>{s.number}</div>
                <div style={{ fontSize:'10px', fontWeight:500, letterSpacing:'3px', textTransform:'uppercase', color:'#787848' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA  fundo: #f2e8d6 com veios ══ */}
      <section style={{
        padding:'130px 0', textAlign:'center',
        background:S.cta, position:'relative', overflow:'hidden',
      }}>
        {/* Veios CSS marble */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:`
            linear-gradient(117deg, transparent 30%, rgba(187,187,136,0.09) 30.5%, transparent 32%),
            linear-gradient(78deg,  transparent 20%, rgba(238,194,144,0.10) 20.5%, transparent 22%),
            linear-gradient(148deg, transparent 60%, rgba(187,187,136,0.06) 60.5%, transparent 62%)
          `,
        }} />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div style={{ maxWidth:'600px', margin:'0 auto' }}>
            <div className="section-label" style={{ justifyContent:'center' }}>Pronto para começar?</div>
            <h2 style={{ fontSize:'clamp(32px,4vw,58px)', fontWeight:300, color:'#1e1a0e', marginBottom:'20px', lineHeight:1.05 }}>
              Seu próximo projeto<br/>começa aqui
            </h2>
            <div style={{ width:'40px', height:'2px', background:'#c47040', margin:'0 auto 28px', opacity:0.7 }} />
            <p style={{ fontSize:'16px', color:'#4e4432', lineHeight:1.9, marginBottom:'44px', maxWidth:'480px', margin:'0 auto 44px' }}>
              Entre em contato e receba um orçamento personalizado. Nossa equipe está pronta para transformar sua visão.
            </p>
            <div style={{ display:'flex', justifyContent:'center', gap:'14px', flexWrap:'wrap' }}>
              <Link to="/contato" className="btn-accent"><span>Solicitar Orçamento</span></Link>
              <a href="https://wa.me/5521999999999" target="_blank" rel="noreferrer" className="btn-outline"><span>WhatsApp</span></a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

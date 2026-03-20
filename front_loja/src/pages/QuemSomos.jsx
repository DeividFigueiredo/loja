import React from 'react'
import { Link } from 'react-router-dom'

const IMG_A = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80&auto=format&fit=crop'
const IMG_B = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80&auto=format&fit=crop'

const values = [
  { num:'01', title:'Excelência',       desc:'Nunca abrimos mão da qualidade. Cada detalhe é verificado antes da entrega ao cliente.' },
  { num:'02', title:'Integridade',      desc:'Transparência total nos processos, prazos e valores. Confiança construída ao longo dos anos.' },
  { num:'03', title:'Inovação',         desc:'Combinamos técnicas tradicionais artesanais com equipamentos de última geração.' },
  { num:'04', title:'Sustentabilidade', desc:'Operamos com responsabilidade ambiental em cada etapa do nosso processo produtivo.' },
]

const timeline = [
  { year:'2004', title:'Fundação',   desc:'Início das atividades com foco em residências de alto padrão na região.' },
  { year:'2010', title:'Expansão',   desc:'Ampliamos a estrutura e começamos a atender grandes construtoras e incorporadoras.' },
  { year:'2016', title:'Tecnologia', desc:'Investimento em máquinas CNC para cortes precisos e personalizados.' },
  { year:'2024', title:'Digital',    desc:'Lançamento da plataforma online para atender clientes em todo o Brasil.' },
]

const BG = {
  hero:     '#f7f2e4',
  story:    '#fdfbf4',
  values:   '#f5ece0',
  timeline: '#fdfbf4',
  cta:      '#f2e8d6',
}

export default function QuemSomos() {
  return (
    <div>

      {/* ══ HERO ══ */}
      <section style={{
        position:'relative', minHeight:'60vh',
        display:'flex', alignItems:'flex-end',
        overflow:'hidden', paddingBottom:'72px',
      }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:`url(${IMG_B})`, backgroundSize:'cover', backgroundPosition:'center 40%' }} />
        <div style={{
          position:'absolute', inset:0,
          background:`linear-gradient(180deg, rgba(247,242,228,0.55) 0%, rgba(247,242,228,0.90) 75%, ${BG.story} 100%)`,
        }} />
        <div className="container" style={{ position:'relative', zIndex:2, paddingTop:'140px' }}>
          <div className="section-label">Nossa História</div>
          <h1 style={{ fontSize:'clamp(48px,7vw,96px)', fontWeight:300, color:'#1e1a0e', lineHeight:1.0, letterSpacing:'-0.02em' }}>
            Quem Somos
          </h1>
        </div>
      </section>

      {/* ══ STORY ══  fundo: bg-s1 (#fdfbf4) */}
      <section style={{ padding:'100px 0 120px', background:BG.story }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(400px,1fr))', gap:'80px', alignItems:'center' }}>

            {/* Imagem */}
            <div style={{ position:'relative' }}>
              <img src={IMG_A} alt="Marmoraria Guandu" style={{ width:'100%', aspectRatio:'3/4', objectFit:'cover', display:'block' }} />
              {/* Frame decorativo */}
              <div style={{ position:'absolute', bottom:'-20px', right:'-20px', width:'100px', height:'100px', border:'1.5px solid #ccc68d', zIndex:-1 }} />
              {/* Badge flutuante */}
              <div style={{
                position:'absolute', bottom:'32px', left:'28px',
                background:'rgba(253,251,244,0.96)', backdropFilter:'blur(12px)',
                padding:'20px 24px',
                borderLeft:'3px solid #eeaa88',
              }}>
                <div style={{ fontFamily:'var(--font-serif)', fontSize:'42px', fontWeight:300, color:'#1e1a0e', lineHeight:1 }}>20+</div>
                <div style={{ fontSize:'9px', letterSpacing:'4px', textTransform:'uppercase', color:'#787848', marginTop:'4px' }}>Anos de Expertise</div>
              </div>
            </div>

            {/* Texto */}
            <div>
              <div className="section-label">Nossa Trajetória</div>
              <h2 style={{ fontSize:'clamp(30px,3.5vw,50px)', fontWeight:300, color:'#1e1a0e', marginBottom:'8px', lineHeight:1.1 }}>
                Duas décadas<br/>lapidando
              </h2>
              <h2 style={{ fontSize:'clamp(30px,3.5vw,50px)', fontWeight:300, marginBottom:'28px', lineHeight:1.1 }}>
                <em style={{ color:'#c47040', fontStyle:'italic' }}>excelência</em>
              </h2>
              <div style={{ width:'40px', height:'2px', background:'#c47040', marginBottom:'28px', opacity:0.7 }} />
              <p style={{ fontSize:'15px', color:'#4e4432', lineHeight:1.9, marginBottom:'20px' }}>
                A Guandu Mármores nasceu da paixão de uma família pela beleza intrínseca das pedras naturais. Fundada em 2004 em Seropédica, Rio de Janeiro, começamos com um pequeno galpão e um grande sonho.
              </p>
              <p style={{ fontSize:'15px', color:'#4e4432', lineHeight:1.9, marginBottom:'36px' }}>
                Hoje somos referência no mercado fluminense, atendendo arquitetos, construtoras e clientes particulares que buscam materiais de altíssimo padrão.
              </p>
              <Link to="/contato" className="btn-outline"><span>Fale Conosco</span></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ VALORES  fundo: bg-s4 (#f5ece0), cards: branco ══ */}
      <section style={{ padding:'120px 0', background:BG.values }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'64px' }}>
            <div className="section-label" style={{ justifyContent:'center' }}>O que nos guia</div>
            <h2 style={{ fontSize:'clamp(30px,4vw,52px)', fontWeight:300, color:'#1e1a0e' }}>Nossos Valores</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'20px' }}>
            {values.map((v,i) => (
              <div key={i} style={{
                background:'#ffffff',
                border:'1.5px solid rgba(187,187,136,0.28)',
                boxShadow:'0 2px 0 rgba(187,187,136,0.4),0 8px 28px rgba(30,26,14,0.09)',
                padding:'44px 36px',
                transition:'transform 0.3s ease, box-shadow 0.3s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 2px 0 rgba(238,170,136,0.5),0 16px 40px rgba(30,26,14,0.13)' }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 0 rgba(187,187,136,0.4),0 8px 28px rgba(30,26,14,0.09)' }}
              >
                <div style={{ width:'28px', height:'2px', background:'#ccc68d', marginBottom:'24px' }} />
                <div style={{ fontFamily:'var(--font-serif)', fontSize:'11px', color:'#787848', letterSpacing:'4px', marginBottom:'14px' }}>{v.num}</div>
                <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'24px', fontWeight:300, color:'#1e1a0e', marginBottom:'12px' }}>{v.title}</h3>
                <p style={{ fontSize:'13px', color:'#4e4432', lineHeight:1.85 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TIMELINE  fundo: bg-s1 ══ */}
      <section style={{ padding:'120px 0', background:BG.timeline }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'72px' }}>
            <div className="section-label" style={{ justifyContent:'center' }}>Nossa Jornada</div>
            <h2 style={{ fontSize:'clamp(30px,4vw,52px)', fontWeight:300, color:'#1e1a0e' }}>Marcos Importantes</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', position:'relative' }}>
            <div style={{ position:'absolute', top:'8px', left:0, right:0, height:'1px', background:`linear-gradient(90deg, #bbbb88, #eec290, #bbbb88)`, opacity:0.5 }} />
            {timeline.map((t,i) => (
              <div key={i} style={{ paddingRight:'28px' }}>
                <div style={{ width:'16px', height:'16px', borderRadius:'50%', border:'2px solid #eec290', background:'#fdfbf4', marginBottom:'36px', position:'relative', zIndex:1, boxShadow:'0 0 0 4px #fdfbf4' }} />
                <div style={{ fontFamily:'var(--font-serif)', fontSize:'42px', fontWeight:300, color:'#c47040', opacity:0.55, lineHeight:1, marginBottom:'14px' }}>{t.year}</div>
                <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'22px', fontWeight:300, color:'#1e1a0e', marginBottom:'10px' }}>{t.title}</h3>
                <p style={{ fontSize:'13px', color:'#4e4432', lineHeight:1.8 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ padding:'100px 0', textAlign:'center', background:BG.cta, borderTop:'1px solid rgba(187,187,136,0.20)' }}>
        <div className="container">
          <div style={{ maxWidth:'540px', margin:'0 auto' }}>
            <h2 style={{ fontSize:'clamp(26px,3.5vw,46px)', fontWeight:300, color:'#1e1a0e', marginBottom:'18px' }}>
              Pronto para criar algo extraordinário?
            </h2>
            <p style={{ fontSize:'15px', color:'#4e4432', lineHeight:1.9, marginBottom:'40px' }}>
              Nossa equipe está disponível para apresentar as melhores opções para o seu projeto.
            </p>
            <div style={{ display:'flex', justifyContent:'center', gap:'14px', flexWrap:'wrap' }}>
              <Link to="/catalogo" className="btn-accent"><span>Ver Catálogo</span></Link>
              <Link to="/contato"  className="btn-outline"><span>Entrar em Contato</span></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

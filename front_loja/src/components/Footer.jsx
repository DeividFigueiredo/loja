import React from 'react'
import { Link } from 'react-router-dom'

const WA = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
const IG = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>

export default function Footer() {
  return (
    <footer style={{ background:'#f2e8d6', borderTop:'1px solid rgba(187,187,136,0.25)' }}>

      {/* Tira de cor */}
      <div style={{ height:'3px', background:`linear-gradient(90deg, #bbbb88, #eedd99, #eec290, #eeaa88, #eec290, #eedd99, #bbbb88)` }} />

      <div className="container" style={{ padding:'72px 48px 52px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'52px' }}>

          {/* Brand */}
          <div>
            <div style={{ fontFamily:'var(--font-serif)', fontSize:'32px', fontWeight:300, color:'#1e1a0e', lineHeight:1, marginBottom:'4px' }}>Guandu</div>
            <div style={{ fontSize:'8px', fontWeight:500, letterSpacing:'5px', textTransform:'uppercase', color:'#787848', marginBottom:'18px' }}>Mármores & Granitos</div>
            <p style={{ fontSize:'13px', color:'#4e4432', lineHeight:1.9, maxWidth:'240px' }}>
              Transformamos pedra em arte. Soluções em mármore e granito para projetos residenciais e comerciais de alto padrão.
            </p>
          </div>

          {/* Nav */}
          <div>
            <div style={{ fontSize:'9px', fontWeight:500, letterSpacing:'4px', textTransform:'uppercase', color:'#787848', marginBottom:'20px' }}>Navegação</div>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'12px' }}>
              {[['/', 'Home'],['/quem-somos','Quem Somos'],['/catalogo','Catálogo'],['/contato','Contato']].map(([to,label]) => (
                <li key={to}>
                  <Link to={to} style={{ fontSize:'13px', color:'#4e4432', display:'flex', alignItems:'center', gap:'10px', transition:'color 0.22s ease' }}
                    onMouseEnter={e => e.currentTarget.style.color='#c47040'}
                    onMouseLeave={e => e.currentTarget.style.color='#4e4432'}
                  >
                    <span style={{ width:'14px', height:'1px', background:'rgba(187,187,136,0.5)', display:'inline-block', flexShrink:0 }} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <div style={{ fontSize:'9px', fontWeight:500, letterSpacing:'4px', textTransform:'uppercase', color:'#787848', marginBottom:'20px' }}>Contato</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {[
                { href:'https://wa.me/5521999999999', icon:<WA />, text:'(21) 99999-9999' },
                { href:'https://instagram.com/guandumarmores', icon:<IG />, text:'@guandumarmores' },
              ].map((c,i) => (
                <a key={i} href={c.href} target="_blank" rel="noreferrer"
                  style={{ display:'flex', alignItems:'center', gap:'10px', fontSize:'13px', color:'#4e4432', transition:'color 0.22s ease' }}
                  onMouseEnter={e => e.currentTarget.style.color='#c47040'}
                  onMouseLeave={e => e.currentTarget.style.color='#4e4432'}
                >{c.icon}{c.text}</a>
              ))}
              <p style={{ fontSize:'13px', color:'#4e4432', lineHeight:1.8, marginTop:'4px' }}>
                Av. das Pedras, 1024<br/>Seropédica — RJ, Brasil
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ borderTop:'1px solid rgba(187,187,136,0.22)' }}>
        <div className="container" style={{ padding:'18px 48px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
          <p style={{ fontSize:'12px', color:'#7a6e58' }}>© {new Date().getFullYear()} Guandu Mármores. Todos os direitos reservados.</p>
          <p style={{ fontSize:'11px', color:'#7a6e58', letterSpacing:'1px' }}>
            Desenvolvido por <span style={{ color:'#c47040' }}>Dwalt Tech</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

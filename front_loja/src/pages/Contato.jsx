import React, { useState } from 'react'

const WhatsAppIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
const InstagramIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
const PhoneIcon    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.28-1.28a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
const MailIcon     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const LocationIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>

const contacts = [
  { icon:<PhoneIcon />,    label:'Telefone',  value:'(21) 99999-9999',                href:'tel:+5521999999999' },
  { icon:<WhatsAppIcon />, label:'WhatsApp',  value:'(21) 99999-9999',                href:'https://wa.me/5521999999999' },
  { icon:<MailIcon />,     label:'E-mail',    value:'contato@guandumarmores.com.br',  href:'mailto:contato@guandumarmores.com.br' },
  { icon:<LocationIcon />, label:'Endereço',  value:'Av. das Pedras, 1024 — Seropédica, RJ', href:null },
]

export default function Contato() {
  const [form, setForm] = useState({ nome:'', email:'', telefone:'', mensagem:'' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const submit = e => {
    e.preventDefault(); setLoading(true)
    setTimeout(() => { setSent(true); setLoading(false); setForm({ nome:'', email:'', telefone:'', mensagem:'' }) }, 1200)
  }

  return (
    <div>

      {/* ══ HERO ══ */}
      <section style={{ padding:'160px 0 72px', background:'#fdfbf4', borderBottom:'1px solid rgba(187,187,136,0.25)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:`linear-gradient(117deg, transparent 30%, rgba(238,194,144,0.07) 30.5%, transparent 32%)` }} />
        <div className="container" style={{ position:'relative' }}>
          <div className="section-label">Fale Conosco</div>
          <h1 style={{ fontSize:'clamp(44px,6vw,88px)', fontWeight:300, color:'#1e1a0e', lineHeight:1.0, letterSpacing:'-0.02em', marginBottom:'18px' }}>Contato</h1>
          <p style={{ fontSize:'16px', color:'#4e4432', maxWidth:'460px', lineHeight:1.85 }}>
            Estamos prontos para transformar seu projeto em realidade. Receba um orçamento personalizado.
          </p>
        </div>
      </section>

      {/* ══ MAIN ══ */}
      <section style={{ padding:'90px 0 120px', background:'#f5ece0' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(360px,1fr))', gap:'72px', alignItems:'start' }}>

            {/* Info */}
            <div>
              <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'36px', fontWeight:300, color:'#1e1a0e', marginBottom:'14px' }}>
                Vamos conversar
              </h2>
              <p style={{ fontSize:'14px', color:'#4e4432', lineHeight:1.9, marginBottom:'44px', maxWidth:'360px' }}>
                Nossa equipe especializada está disponível para atender suas dúvidas e elaborar uma proposta exclusiva para seu projeto.
              </p>

              <div style={{ display:'flex', flexDirection:'column', gap:'26px', marginBottom:'48px' }}>
                {contacts.map((c,i) => (
                  <div key={i} style={{ display:'flex', gap:'18px', alignItems:'flex-start' }}>
                    <div style={{
                      width:'48px', height:'48px',
                      border:'1.5px solid rgba(187,187,136,0.4)',
                      background:'#ffffff',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      color:'#c47040', flexShrink:0,
                      boxShadow:'0 2px 8px rgba(30,26,14,0.07)',
                    }}>{c.icon}</div>
                    <div>
                      <div style={{ fontSize:'9px', letterSpacing:'4px', textTransform:'uppercase', color:'#787848', marginBottom:'4px' }}>{c.label}</div>
                      {c.href
                        ? <a href={c.href} target={c.href.startsWith('http')?'_blank':undefined} rel={c.href.startsWith('http')?'noreferrer':undefined}
                            style={{ fontSize:'15px', color:'#1e1a0e', textDecoration:'none', transition:'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color='#c47040'}
                            onMouseLeave={e => e.currentTarget.style.color='#1e1a0e'}
                          >{c.value}</a>
                        : <span style={{ fontSize:'15px', color:'#1e1a0e' }}>{c.value}</span>
                      }
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div>
                <div style={{ fontSize:'9px', letterSpacing:'4px', textTransform:'uppercase', color:'#787848', marginBottom:'14px' }}>Redes Sociais</div>
                <div style={{ display:'flex', gap:'10px' }}>
                  {[
                    { href:'https://wa.me/5521999999999',       icon:<WhatsAppIcon /> },
                    { href:'https://instagram.com/guandumarmores', icon:<InstagramIcon /> },
                  ].map((s,i) => (
                    <a key={i} href={s.href} target="_blank" rel="noreferrer"
                      style={{ width:'50px', height:'50px', border:'1.5px solid rgba(187,187,136,0.4)', background:'#ffffff', display:'flex', alignItems:'center', justifyContent:'center', color:'#7a6e58', transition:'all 0.22s ease', boxShadow:'0 2px 8px rgba(30,26,14,0.07)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor='#c47040'; e.currentTarget.style.color='#c47040' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(187,187,136,0.4)'; e.currentTarget.style.color='#7a6e58' }}
                    >{s.icon}</a>
                  ))}
                </div>
              </div>
            </div>

            {/* Formulário — card branco sobre fundo #f5ece0 */}
            <div style={{
              background:'#ffffff',
              border:'1.5px solid rgba(187,187,136,0.30)',
              boxShadow:'0 2px 0 rgba(187,187,136,0.4),0 12px 40px rgba(30,26,14,0.10)',
              padding:'52px 44px',
            }}>
              {sent ? (
                <div style={{ textAlign:'center', padding:'40px 0' }}>
                  <div style={{ width:'60px', height:'60px', borderRadius:'50%', border:'2px solid #ccc68d', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 22px', color:'#c47040', fontSize:'22px' }}>✓</div>
                  <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'28px', fontWeight:300, color:'#1e1a0e', marginBottom:'12px' }}>Mensagem enviada!</h3>
                  <p style={{ fontSize:'14px', color:'#4e4432', lineHeight:1.8, marginBottom:'28px' }}>Recebemos sua mensagem e entraremos em contato em breve.</p>
                  <button className="btn-outline" onClick={() => setSent(false)}><span>Enviar outra mensagem</span></button>
                </div>
              ) : (
                <>
                  <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'26px', fontWeight:300, color:'#1e1a0e', marginBottom:'32px' }}>Solicitar Orçamento</h3>
                  <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
                      <div className="form-group">
                        <label className="form-label">Nome</label>
                        <input className="form-input" type="text" name="nome" value={form.nome} onChange={handle} placeholder="Seu nome" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Telefone</label>
                        <input className="form-input" type="tel" name="telefone" value={form.telefone} onChange={handle} placeholder="(21) 99999-9999" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">E-mail</label>
                      <input className="form-input" type="email" name="email" value={form.email} onChange={handle} placeholder="seu@email.com" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mensagem</label>
                      <textarea className="form-textarea" name="mensagem" value={form.mensagem} onChange={handle} placeholder="Descreva seu projeto..." required />
                    </div>
                    <button type="submit" className="btn-accent" style={{ justifyContent:'center', opacity:loading?0.7:1 }} disabled={loading}>
                      <span>{loading?'Enviando...':'Enviar Mensagem'}</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══ WHATSAPP ══ */}
      <section style={{ padding:'72px 0', background:'#fdfbf4', borderTop:'1px solid rgba(187,187,136,0.20)', textAlign:'center' }}>
        <div className="container">
          <p style={{ fontSize:'10px', letterSpacing:'5px', textTransform:'uppercase', color:'#787848', marginBottom:'14px' }}>Atendimento rápido</p>
          <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(24px,3vw,40px)', fontWeight:300, color:'#1e1a0e', marginBottom:'28px' }}>
            Prefere falar pelo WhatsApp?
          </h2>
          <a href="https://wa.me/5521999999999?text=Olá! Gostaria de solicitar um orçamento." target="_blank" rel="noreferrer"
            style={{ display:'inline-flex', alignItems:'center', gap:'12px', background:'#25D366', color:'#fff', padding:'16px 44px', fontFamily:'var(--font-sans)', fontSize:'11px', fontWeight:500, letterSpacing:'3px', textTransform:'uppercase', textDecoration:'none', transition:'background 0.22s ease', boxShadow:'0 4px 20px rgba(37,211,102,0.28)' }}
            onMouseEnter={e => e.currentTarget.style.background='#1fba5a'}
            onMouseLeave={e => e.currentTarget.style.background='#25D366'}
          >
            <WhatsAppIcon /> Conversar no WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}

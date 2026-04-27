import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts.js'
import { useCart } from '../context/CartContext.jsx'

function formatPrice(cents) {
  const value = Number(cents)
  if (!Number.isFinite(value)) return null
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value / 100)
}

export default function ProdutoDetalhe() {
  const { productId } = useParams()
  const { state } = useLocation()
  const { products, loading } = useProducts(80)
  const { addItem } = useCart()

  const decodedId = decodeURIComponent(productId || '')

  const product = useMemo(() => {
    const fromState = state?.product
    const fromApi = (products || []).find((p) => p.id === decodedId)
    if (fromApi) return fromApi
    if (fromState?.id === decodedId) return fromState
    return null
  }, [state, products, decodedId])

  const [selectedVariantId, setSelectedVariantId] = useState('')
  const [activeImage, setActiveImage] = useState(null)
  const [incomingImage, setIncomingImage] = useState(null)
  const [incomingVisible, setIncomingVisible] = useState(false)

  useEffect(() => {
    if (!product?.variants?.length) {
      setSelectedVariantId('')
      return
    }
    setSelectedVariantId(product.variants[0].id)
  }, [product])

  const selectedVariant = useMemo(
    () => (product?.variants || []).find(v => v.id === selectedVariantId) || product?.variants?.[0] || null,
    [product, selectedVariantId]
  )

  const selectedVariantIndex = useMemo(() => {
    const byRank = Number(selectedVariant?.variantRank)
    if (Number.isInteger(byRank) && byRank >= 0) return byRank

    const byId = (product?.variants || []).findIndex((v) => v.id === selectedVariantId)
    if (byId >= 0) return byId

    return 0
  }, [product, selectedVariant, selectedVariantId])

  const image =
    selectedVariant?.image?.url ||
    selectedVariant?.images?.[selectedVariantIndex]?.url ||
    selectedVariant?.images?.[0]?.url ||
    product?.images?.[selectedVariantIndex]?.url ||
    product?.images?.[0]?.url ||
    product?.featuredImage?.url ||
    null
  const price = selectedVariant?.prices?.[0]?.amount || null
  const category = product?.collection?.title || product?.type?.value || 'Pedra Natural'

  useEffect(() => {
    if (!image) {
      setActiveImage(null)
      setIncomingImage(null)
      setIncomingVisible(false)
      return
    }

    if (!activeImage) {
      setActiveImage(image)
      return
    }

    if (image === activeImage) return

    let cancelled = false
    const preloader = new Image()
    preloader.onload = async () => {
      if (cancelled) return
      if (typeof preloader.decode === 'function') {
        try {
          await preloader.decode()
        } catch (_) {
          // Se o decode falhar, seguimos com o onload já concluído.
        }
      }
      if (cancelled) return
      setIncomingImage(image)
      setIncomingVisible(false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) setIncomingVisible(true)
        })
      })
    }
    preloader.onerror = () => {
      if (cancelled) return
      setActiveImage(image)
      setIncomingImage(null)
      setIncomingVisible(false)
    }
    preloader.src = image

    return () => {
      cancelled = true
    }
  }, [image, activeImage])

  if (loading && !product) {
    return (
      <section style={{ padding: '120px 0', background: '#f5ece0' }}>
        <div className="container"><div className="spinner" /></div>
      </section>
    )
  }

  if (!product) {
    return (
      <section style={{ padding: '120px 0', background: '#f5ece0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(34px,5vw,62px)', marginBottom: '14px' }}>Produto não encontrado</h1>
          <p style={{ color: '#6f634e', marginBottom: '28px' }}>Este item não foi localizado no catálogo atual.</p>
          <Link to="/catalogo" className="btn-accent"><span>Voltar ao Catálogo</span></Link>
        </div>
      </section>
    )
  }

  return (
    <div>
      <section style={{ padding: '130px 0 36px', background: '#fdfbf4', borderBottom: '1px solid rgba(187,187,136,0.25)' }}>
        <div className="container">
          <Link to="/catalogo" style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#7a6e58' }}>
            ← Voltar ao Catálogo
          </Link>
        </div>
      </section>

      <section style={{ padding: '36px 0 100px', background: '#f5ece0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.1fr) minmax(320px, 1fr)', gap: '32px' }}>
          <div className="product-card" style={{ overflow: 'hidden' }}>
            {activeImage
              ? (
                <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3' }}>
                  <img
                    src={activeImage}
                    alt={product.title}
                    className="product-card__image"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 1 }}
                  />
                  {incomingImage && (
                    <img
                      src={incomingImage}
                      alt={product.title}
                      className="product-card__image"
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: incomingVisible ? 1 : 0, transition: 'opacity 220ms ease' }}
                      onTransitionEnd={() => {
                        if (!incomingVisible) return
                        setActiveImage(incomingImage)
                        setIncomingImage(null)
                        setIncomingVisible(false)
                      }}
                    />
                  )}
                </div>
              )
              : <div style={{ width: '100%', aspectRatio: '4/3', display: 'grid', placeItems: 'center', background: '#f7eee1', color: '#b9a98f', fontSize: '44px' }}>◈</div>
            }
          </div>

          <div className="product-card" style={{ padding: '32px' }}>
            <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '3px', textTransform: 'uppercase', color: '#787848', marginBottom: '10px' }}>{category}</div>
            <h1 style={{ fontSize: 'clamp(34px,4.5vw,58px)', lineHeight: 1.02, marginBottom: '14px' }}>{product.title}</h1>
            {product.description && <p style={{ color: '#5b4f39', lineHeight: 1.9, marginBottom: '22px' }}>{product.description}</p>}

            {!!product.variants?.length && (
              <div style={{ marginBottom: '22px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#7a6e58', marginBottom: '10px' }}>Variações</div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {product.variants.map(v => {
                    const vPrice = v?.prices?.[0]?.amount || null
                    const isActive = v.id === selectedVariant?.id
                    const optionLabel = (v.selectedOptions || []).map(o => `${o.name}: ${o.value}`).join(' · ')

                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        style={{
                          border: `1.5px solid ${isActive ? '#c47040' : 'rgba(187,187,136,0.4)'}`,
                          background: isActive ? '#fff5ea' : '#fff',
                          color: '#3f3423',
                          textAlign: 'left',
                          padding: '10px 12px',
                        }}
                      >
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>{v.title || 'Variação'}</div>
                        {optionLabel && <div style={{ fontSize: '12px', color: '#7a6e58', marginTop: '2px' }}>{optionLabel}</div>}
                        {vPrice && <div style={{ fontSize: '13px', color: '#1e1a0e', marginTop: '6px' }}>{formatPrice(vPrice)}</div>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(187,187,136,0.25)', paddingTop: '18px', gap: '12px', flexWrap: 'wrap' }}>
              {price
                ? <div style={{ fontFamily: 'var(--font-serif)', fontSize: '34px', color: '#1e1a0e' }}>{formatPrice(price)}</div>
                : <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#7a6e58' }}>Sob Consulta</div>
              }

              <button
                className="btn-accent"
                onClick={() => {
                  if (selectedVariant) addItem(product, selectedVariant.id)
                }}
              >
                <span>Adicionar ao Carrinho</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

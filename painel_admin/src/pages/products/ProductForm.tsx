import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Plus, Trash2, Upload, X, Image } from 'lucide-react'
import { api } from '../../lib/api'
import { Button } from '../../components/ui/Button'
import { Input, Textarea, Select } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import toast from 'react-hot-toast'

interface Variant {
  id?: string
  title: string
  sku: string
  price: number
  inventory_quantity: number
  options: Record<string, string>
}

interface ProductFormData {
  title: string
  subtitle: string
  handle: string
  description: string
  status: string
  type_id: string
  collection_id: string
  tags: string
  weight: string
  material: string
  origin_country: string
  variants: Variant[]
  images: string[]
}

const defaultVariant: Variant = { title: 'Padrão', sku: '', price: 0, inventory_quantity: 0, options: {} }

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEdit = id && id !== 'novo'

  const [form, setForm] = useState<ProductFormData>({
    title: '', subtitle: '', handle: '', description: '',
    status: 'draft', type_id: '', collection_id: '', tags: '',
    weight: '', material: '', origin_country: '',
    variants: [{ ...defaultVariant }],
    images: [],
  })
  const [imageUrl, setImageUrl] = useState('')

  const { data: product } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get(`/admin/products/${id}`).then((r) => r.data.product),
    enabled: !!isEdit,
  })

  const { data: collectionsData } = useQuery({
    queryKey: ['collections-select'],
    queryFn: () => api.get('/admin/collections?limit=100').then((r) => r.data),
  })

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || '',
        subtitle: product.subtitle || '',
        handle: product.handle || '',
        description: product.description || '',
        status: product.status || 'draft',
        type_id: product.type_id || '',
        collection_id: product.collection_id || '',
        tags: product.tags?.map((t: any) => t.value).join(', ') || '',
        weight: String(product.weight || ''),
        material: product.material || '',
        origin_country: product.origin_country || '',
        variants: product.variants?.map((v: any) => ({
          id: v.id,
          title: v.title || 'Padrão',
          sku: v.sku || '',
          price: v.prices?.[0]?.amount || 0,
          inventory_quantity: v.inventory_quantity || 0,
          options: {},
        })) || [{ ...defaultVariant }],
        images: product.images?.map((i: any) => i.url) || [],
      })
    }
  }, [product])

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        subtitle: form.subtitle || undefined,
        handle: form.handle || undefined,
        description: form.description || undefined,
        status: form.status,
        collection_id: form.collection_id || undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        material: form.material || undefined,
        origin_country: form.origin_country || undefined,
        tags: form.tags ? form.tags.split(',').map((t) => ({ value: t.trim() })) : undefined,
        images: form.images.length ? form.images.map((url) => ({ url })) : undefined,
        variants: form.variants.map((v) => ({
          ...(v.id ? { id: v.id } : {}),
          title: v.title,
          sku: v.sku || undefined,
          inventory_quantity: Number(v.inventory_quantity) || 0,
          prices: [{ amount: Math.round(Number(v.price) * 100), currency_code: 'brl' }],
        })),
      }

      if (isEdit) {
        await api.post(`/admin/products/${id}`, payload)
      } else {
        await api.post('/admin/products', payload)
      }
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Produto atualizado!' : 'Produto criado!')
      queryClient.invalidateQueries({ queryKey: ['products'] })
      navigate('/produtos')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Erro ao salvar produto')
    },
  })

  const addVariant = () => setForm((f) => ({ ...f, variants: [...f.variants, { ...defaultVariant, title: `Variante ${f.variants.length + 1}` }] }))
  const removeVariant = (i: number) => setForm((f) => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }))
  const updateVariant = (i: number, key: keyof Variant, value: any) =>
    setForm((f) => ({ ...f, variants: f.variants.map((v, idx) => idx === i ? { ...v, [key]: value } : v) }))

  const addImage = () => {
    if (!imageUrl.trim()) return
    setForm((f) => ({ ...f, images: [...f.images, imageUrl.trim()] }))
    setImageUrl('')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" icon={<ArrowLeft size={16} />} onClick={() => navigate('/produtos')}>Voltar</Button>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {isEdit ? 'Editar Produto' : 'Novo Produto'}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card title="Informações Gerais">
            <div className="space-y-4">
              <Input label="Título *" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Nome do produto" required />
              <Input label="Subtítulo" value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} placeholder="Subtítulo opcional" />
              <Input label="Handle (URL)" value={form.handle} onChange={(e) => setForm((f) => ({ ...f, handle: e.target.value }))} placeholder="meu-produto" hint="Gerado automaticamente se vazio" />
              <Textarea label="Descrição" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Descrição detalhada do produto..." />
            </div>
          </Card>

          <Card title="Variantes & Preços" action={
            <Button size="sm" icon={<Plus size={12} />} onClick={addVariant}>Adicionar</Button>
          }>
            <div className="space-y-4">
              {form.variants.map((variant, i) => (
                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Variante {i + 1}
                    </span>
                    {form.variants.length > 1 && (
                      <button onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Nome"
                      value={variant.title}
                      onChange={(e) => updateVariant(i, 'title', e.target.value)}
                      placeholder="Ex: Azul P"
                    />
                    <Input
                      label="SKU"
                      value={variant.sku}
                      onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                      placeholder="ABC-001"
                    />
                    <Input
                      label="Preço (R$)"
                      type="number"
                      step="0.01"
                      value={variant.price === 0 ? '' : variant.price}
                      onChange={(e) => updateVariant(i, 'price', e.target.value)}
                      placeholder="99.90"
                    />
                    <Input
                      label="Estoque"
                      type="number"
                      value={variant.inventory_quantity}
                      onChange={(e) => updateVariant(i, 'inventory_quantity', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Imagens" action={<Image size={16} className="text-slate-400" />}>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && addImage()}
                />
                <Button icon={<Plus size={14} />} onClick={addImage}>Adicionar</Button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {form.images.map((url, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 aspect-square">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {form.images.length === 0 && (
                  <div className="col-span-3 py-8 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl">
                    <Upload size={24} className="mx-auto mb-2 text-slate-300" />
                    Adicione URLs de imagens
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Status & Organização">
            <div className="space-y-4">
              <Select
                label="Status"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                options={[
                  { value: 'draft', label: 'Rascunho' },
                  { value: 'published', label: 'Publicado' },
                  { value: 'rejected', label: 'Rejeitado' },
                  { value: 'proposed', label: 'Proposto' },
                ]}
              />
              <Select
                label="Coleção"
                value={form.collection_id}
                onChange={(e) => setForm((f) => ({ ...f, collection_id: e.target.value }))}
                options={[
                  { value: '', label: 'Sem coleção' },
                  ...(collectionsData?.collections?.map((c: any) => ({ value: c.id, label: c.title })) || []),
                ]}
              />
              <Input
                label="Tags (separadas por vírgula)"
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                placeholder="camiseta, verão, promoção"
              />
            </div>
          </Card>

          <Card title="Atributos Físicos">
            <div className="space-y-4">
              <Input label="Peso (gramas)" type="number" value={form.weight} onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))} placeholder="500" />
              <Input label="Material" value={form.material} onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))} placeholder="Algodão 100%" />
              <Input label="País de origem" value={form.origin_country} onChange={(e) => setForm((f) => ({ ...f, origin_country: e.target.value }))} placeholder="BR" />
            </div>
          </Card>

          <div className="flex flex-col gap-2">
            <Button loading={save.isPending} onClick={() => save.mutate()} className="w-full" size="lg">
              {isEdit ? 'Salvar alterações' : 'Criar produto'}
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => navigate('/produtos')}>
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

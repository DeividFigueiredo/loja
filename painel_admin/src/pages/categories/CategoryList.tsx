import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react'
import { api } from '../../lib/api'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input, Textarea, Select } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import toast from 'react-hot-toast'

export default function CategoryList() {
  const [modal, setModal] = useState<any>(null)
  const [form, setForm] = useState({ name: '', handle: '', description: '', parent_category_id: '', is_active: 'true', is_internal: 'false' })
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/admin/product-categories?limit=100&include_descendants_tree=true').then((r) => r.data),
  })

  const save = useMutation({
    mutationFn: () => {
      const payload = {
        name: form.name,
        handle: form.handle || undefined,
        description: form.description || undefined,
        parent_category_id: form.parent_category_id || null,
        is_active: form.is_active === 'true',
        is_internal: form.is_internal === 'true',
      }
      return modal?.id
        ? api.post(`/admin/product-categories/${modal.id}`, payload)
        : api.post('/admin/product-categories', payload)
    },
    onSuccess: () => {
      toast.success(modal?.id ? 'Categoria atualizada!' : 'Categoria criada!')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setModal(null)
    },
    onError: () => toast.error('Erro ao salvar categoria'),
  })

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/product-categories/${id}`),
    onSuccess: () => {
      toast.success('Categoria excluída!')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: () => toast.error('Erro ao excluir categoria'),
  })

  const openNew = () => {
    setForm({ name: '', handle: '', description: '', parent_category_id: '', is_active: 'true', is_internal: 'false' })
    setModal({})
  }
  const openEdit = (cat: any) => {
    setForm({ name: cat.name, handle: cat.handle, description: cat.description || '', parent_category_id: cat.parent_category_id || '', is_active: String(cat.is_active), is_internal: String(cat.is_internal) })
    setModal(cat)
  }

  const categories = data?.product_categories || []
  const parentOptions = [
    { value: '', label: 'Sem categoria pai' },
    ...categories.filter((c: any) => !modal?.id || c.id !== modal?.id).map((c: any) => ({ value: c.id, label: c.name })),
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button icon={<Plus size={14} />} onClick={openNew}>Nova Categoria</Button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
              {['Nome', 'Handle', 'Categoria Pai', 'Status', 'Ações'].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide px-4 py-3 first:pl-6 last:pr-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {isLoading && <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">Carregando...</td></tr>}
            {!isLoading && categories.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                <FolderTree size={32} className="mx-auto mb-2 text-slate-300" />
                Nenhuma categoria ainda
              </td></tr>
            )}
            {categories.map((cat: any) => (
              <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                <td className="px-4 pl-6 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">{cat.name}</td>
                <td className="px-4 py-3 text-sm font-mono text-slate-500">{cat.handle}</td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{cat.parent_category?.name || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Badge color={cat.is_active ? 'green' : 'gray'}>{cat.is_active ? 'Ativa' : 'Inativa'}</Badge>
                    {cat.is_internal && <Badge color="orange">Interna</Badge>}
                  </div>
                </td>
                <td className="px-4 pr-6 py-3">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" icon={<Edit size={14} />} onClick={() => openEdit(cat)}>Editar</Button>
                    <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-red-500 hover:text-red-700"
                      onClick={() => confirm(`Excluir "${cat.name}"?`) && remove.mutate(cat.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.id ? 'Editar Categoria' : 'Nova Categoria'}>
        <div className="space-y-4">
          <Input label="Nome *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Nome da categoria" required autoFocus />
          <Input label="Handle" value={form.handle} onChange={(e) => setForm((f) => ({ ...f, handle: e.target.value }))} placeholder="minha-categoria" />
          <Textarea label="Descrição" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Descrição opcional..." />
          <Select label="Categoria pai" value={form.parent_category_id} onChange={(e) => setForm((f) => ({ ...f, parent_category_id: e.target.value }))} options={parentOptions} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Status" value={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.value }))} options={[{ value: 'true', label: 'Ativa' }, { value: 'false', label: 'Inativa' }]} />
            <Select label="Visibilidade" value={form.is_internal} onChange={(e) => setForm((f) => ({ ...f, is_internal: e.target.value }))} options={[{ value: 'false', label: 'Pública' }, { value: 'true', label: 'Interna' }]} />
          </div>
          <div className="flex gap-2">
            <Button loading={save.isPending} onClick={() => save.mutate()} className="flex-1">Salvar</Button>
            <Button variant="secondary" onClick={() => setModal(null)} className="flex-1">Cancelar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Layers } from 'lucide-react'
import { api, formatDate } from '../../lib/api'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import toast from 'react-hot-toast'

export default function CollectionList() {
  const [modal, setModal] = useState<any>(null)
  const [form, setForm] = useState({ title: '', handle: '', metadata: '' })
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: () => api.get('/admin/collections?limit=100').then((r) => r.data),
  })

  const save = useMutation({
    mutationFn: () => {
      const payload = { title: form.title, handle: form.handle || undefined }
      return modal?.id
        ? api.post(`/admin/collections/${modal.id}`, payload)
        : api.post('/admin/collections', payload)
    },
    onSuccess: () => {
      toast.success(modal?.id ? 'Coleção atualizada!' : 'Coleção criada!')
      queryClient.invalidateQueries({ queryKey: ['collections'] })
      setModal(null)
    },
    onError: () => toast.error('Erro ao salvar coleção'),
  })

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/collections/${id}`),
    onSuccess: () => {
      toast.success('Coleção excluída!')
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
    onError: () => toast.error('Erro ao excluir coleção'),
  })

  const openNew = () => { setForm({ title: '', handle: '', metadata: '' }); setModal({}) }
  const openEdit = (col: any) => { setForm({ title: col.title, handle: col.handle, metadata: '' }); setModal(col) }

  const collections = data?.collections || []

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button icon={<Plus size={14} />} onClick={openNew}>Nova Coleção</Button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
              {['Título', 'Handle', 'Produtos', 'Criado em', 'Ações'].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide px-4 py-3 first:pl-6 last:pr-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {isLoading && <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">Carregando...</td></tr>}
            {!isLoading && collections.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                <Layers size={32} className="mx-auto mb-2 text-slate-300" />
                Nenhuma coleção ainda
              </td></tr>
            )}
            {collections.map((col: any) => (
              <tr key={col.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                <td className="px-4 pl-6 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">{col.title}</td>
                <td className="px-4 py-3 text-sm font-mono text-slate-500">{col.handle}</td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{col.products?.length || 0}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{formatDate(col.created_at)}</td>
                <td className="px-4 pr-6 py-3">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" icon={<Edit size={14} />} onClick={() => openEdit(col)}>Editar</Button>
                    <Button
                      variant="ghost" size="sm" icon={<Trash2 size={14} />}
                      className="text-red-500 hover:text-red-700"
                      onClick={() => confirm(`Excluir "${col.title}"?`) && remove.mutate(col.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.id ? 'Editar Coleção' : 'Nova Coleção'}>
        <div className="space-y-4">
          <Input label="Título *" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Nome da coleção" required autoFocus />
          <Input label="Handle (URL)" value={form.handle} onChange={(e) => setForm((f) => ({ ...f, handle: e.target.value }))} placeholder="minha-colecao" hint="Gerado automaticamente se vazio" />
          <div className="flex gap-2">
            <Button loading={save.isPending} onClick={() => save.mutate()} className="flex-1">Salvar</Button>
            <Button variant="secondary" onClick={() => setModal(null)} className="flex-1">Cancelar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Tag } from 'lucide-react'
import { api, formatCurrency, formatDate } from '../../lib/api'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input, Select } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import toast from 'react-hot-toast'

export default function DiscountList() {
  const [modal, setModal] = useState<any>(null)
  const [form, setForm] = useState({
    code: '', type: 'percentage', value: '', description: '',
    starts_at: '', ends_at: '', usage_limit: '',
  })
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['discounts'],
    queryFn: () => api.get('/admin/discounts?limit=50').then((r) => r.data),
  })

  const save = useMutation({
    mutationFn: () => {
      const payload = {
        code: form.code,
        rule: {
          type: form.type,
          value: Number(form.value),
          description: form.description || form.code,
          allocation: 'total',
        },
        starts_at: form.starts_at || undefined,
        ends_at: form.ends_at || undefined,
        usage_limit: form.usage_limit ? Number(form.usage_limit) : undefined,
        is_dynamic: false,
        is_disabled: false,
      }
      return modal?.id
        ? api.post(`/admin/discounts/${modal.id}`, payload)
        : api.post('/admin/discounts', payload)
    },
    onSuccess: () => {
      toast.success(modal?.id ? 'Desconto atualizado!' : 'Desconto criado!')
      queryClient.invalidateQueries({ queryKey: ['discounts'] })
      setModal(null)
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Erro ao salvar desconto'),
  })

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/discounts/${id}`),
    onSuccess: () => {
      toast.success('Desconto excluído!')
      queryClient.invalidateQueries({ queryKey: ['discounts'] })
    },
    onError: () => toast.error('Erro ao excluir desconto'),
  })

  const openNew = () => {
    setForm({ code: '', type: 'percentage', value: '', description: '', starts_at: '', ends_at: '', usage_limit: '' })
    setModal({})
  }

  const discounts = data?.discounts || []

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button icon={<Plus size={14} />} onClick={openNew}>Novo Desconto</Button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
              {['Código', 'Tipo', 'Valor', 'Usos', 'Limite', 'Válido até', 'Status', 'Ações'].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide px-4 py-3 first:pl-6 last:pr-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {isLoading && <tr><td colSpan={8} className="px-6 py-10 text-center text-slate-500">Carregando...</td></tr>}
            {!isLoading && discounts.length === 0 && (
              <tr><td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                <Tag size={32} className="mx-auto mb-2 text-slate-300" />
                Nenhum desconto ainda
              </td></tr>
            )}
            {discounts.map((d: any) => {
              const isExpired = d.ends_at && new Date(d.ends_at) < new Date()
              const typeLabel = d.rule?.type === 'percentage' ? `${d.rule.value}%` : formatCurrency(d.rule?.value || 0)
              return (
                <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                  <td className="px-4 pl-6 py-3 text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">{d.code}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                    {d.rule?.type === 'percentage' ? 'Porcentagem' : d.rule?.type === 'fixed' ? 'Valor fixo' : 'Frete grátis'}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{typeLabel}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{d.usage_count || 0}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{d.usage_limit || '∞'}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{d.ends_at ? formatDate(d.ends_at) : '—'}</td>
                  <td className="px-4 py-3">
                    <Badge color={d.is_disabled ? 'gray' : isExpired ? 'red' : 'green'}>
                      {d.is_disabled ? 'Desativado' : isExpired ? 'Expirado' : 'Ativo'}
                    </Badge>
                  </td>
                  <td className="px-4 pr-6 py-3">
                    <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} className="text-red-500 hover:text-red-700"
                      onClick={() => confirm(`Excluir "${d.code}"?`) && remove.mutate(d.id)} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title="Novo Desconto">
        <div className="space-y-4">
          <Input label="Código do cupom *" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="PROMO20" required autoFocus />
          <Input label="Descrição" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Descrição interna" />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Tipo" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              options={[{ value: 'percentage', label: 'Porcentagem (%)' }, { value: 'fixed', label: 'Valor fixo (R$)' }, { value: 'free_shipping', label: 'Frete grátis' }]} />
            <Input label={form.type === 'percentage' ? 'Valor (%)' : 'Valor (R$)'} type="number" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} placeholder="20" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Válido de" type="datetime-local" value={form.starts_at} onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))} />
            <Input label="Válido até" type="datetime-local" value={form.ends_at} onChange={(e) => setForm((f) => ({ ...f, ends_at: e.target.value }))} />
          </div>
          <Input label="Limite de uso" type="number" value={form.usage_limit} onChange={(e) => setForm((f) => ({ ...f, usage_limit: e.target.value }))} placeholder="Ilimitado se vazio" />
          <div className="flex gap-2">
            <Button loading={save.isPending} onClick={() => save.mutate()} className="flex-1">Criar Desconto</Button>
            <Button variant="secondary" onClick={() => setModal(null)} className="flex-1">Cancelar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

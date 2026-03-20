import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Gift } from 'lucide-react'
import { api, formatCurrency, formatDate } from '../../lib/api'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input, Select } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import toast from 'react-hot-toast'

export default function GiftCardList() {
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ value: '', currency_code: 'brl', ends_at: '' })
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['gift-cards'],
    queryFn: () => api.get('/admin/gift-cards?limit=50').then((r) => r.data),
  })

  const create = useMutation({
    mutationFn: () =>
      api.post('/admin/gift-cards', {
        value: Math.round(Number(form.value) * 100),
        currency_code: form.currency_code,
        ends_at: form.ends_at || undefined,
      }),
    onSuccess: () => {
      toast.success('Gift card criado!')
      queryClient.invalidateQueries({ queryKey: ['gift-cards'] })
      setModal(false)
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Erro ao criar gift card'),
  })

  const deactivate = useMutation({
    mutationFn: (id: string) => api.post(`/admin/gift-cards/${id}`, { is_disabled: true }),
    onSuccess: () => {
      toast.success('Gift card desativado!')
      queryClient.invalidateQueries({ queryKey: ['gift-cards'] })
    },
    onError: () => toast.error('Erro ao desativar'),
  })

  const giftCards = data?.gift_cards || []

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button icon={<Plus size={14} />} onClick={() => { setForm({ value: '', currency_code: 'brl', ends_at: '' }); setModal(true) }}>
          Criar Gift Card
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
              {['Código', 'Valor', 'Saldo', 'Moeda', 'Expira em', 'Status', 'Ações'].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide px-4 py-3 first:pl-6 last:pr-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {isLoading && <tr><td colSpan={7} className="px-6 py-10 text-center text-slate-500">Carregando...</td></tr>}
            {!isLoading && giftCards.length === 0 && (
              <tr><td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                <Gift size={32} className="mx-auto mb-2 text-slate-300" />
                Nenhum gift card ainda
              </td></tr>
            )}
            {giftCards.map((gc: any) => (
              <tr key={gc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                <td className="px-4 pl-6 py-3 text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">{gc.code}</td>
                <td className="px-4 py-3 text-sm font-medium">{formatCurrency(gc.value, gc.currency_code?.toUpperCase())}</td>
                <td className="px-4 py-3 text-sm">{formatCurrency(gc.balance, gc.currency_code?.toUpperCase())}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{gc.currency_code?.toUpperCase()}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{gc.ends_at ? formatDate(gc.ends_at) : 'Sem expiração'}</td>
                <td className="px-4 py-3">
                  <Badge color={gc.is_disabled ? 'red' : 'green'}>{gc.is_disabled ? 'Desativado' : 'Ativo'}</Badge>
                </td>
                <td className="px-4 pr-6 py-3">
                  {!gc.is_disabled && (
                    <Button variant="secondary" size="sm" onClick={() => confirm('Desativar este gift card?') && deactivate.mutate(gc.id)}>
                      Desativar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Criar Gift Card">
        <div className="space-y-4">
          <Input label="Valor (R$) *" type="number" step="0.01" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} placeholder="100.00" autoFocus />
          <Select label="Moeda" value={form.currency_code} onChange={(e) => setForm((f) => ({ ...f, currency_code: e.target.value }))}
            options={[{ value: 'brl', label: 'BRL — Real Brasileiro' }, { value: 'usd', label: 'USD — Dólar' }, { value: 'eur', label: 'EUR — Euro' }]} />
          <Input label="Data de expiração" type="datetime-local" value={form.ends_at} onChange={(e) => setForm((f) => ({ ...f, ends_at: e.target.value }))} hint="Deixe vazio para sem expiração" />
          <div className="flex gap-2">
            <Button loading={create.isPending} onClick={() => create.mutate()} className="flex-1">Criar</Button>
            <Button variant="secondary" onClick={() => setModal(false)} className="flex-1">Cancelar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

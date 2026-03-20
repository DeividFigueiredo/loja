import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Package, AlertTriangle } from 'lucide-react'
import { api } from '../../lib/api'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import toast from 'react-hot-toast'

export default function InventoryList() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [editModal, setEditModal] = useState<any>(null)
  const [newQty, setNewQty] = useState('')
  const limit = 20
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['products-inventory', page],
    queryFn: () =>
      api.get(`/admin/products?limit=${limit}&offset=${page * limit}&order=-created_at`).then((r) => r.data),
  })

  const updateStock = useMutation({
    mutationFn: ({ variantId, qty }: { variantId: string; qty: number }) =>
      api.post(`/admin/variants/${variantId}`, { inventory_quantity: qty }),
    onSuccess: () => {
      toast.success('Estoque atualizado!')
      queryClient.invalidateQueries({ queryKey: ['products-inventory'] })
      setEditModal(null)
    },
    onError: () => toast.error('Erro ao atualizar estoque'),
  })

  const products = data?.products || []
  const total = data?.count || 0

  const allVariants = products.flatMap((p: any) =>
    (p.variants || []).map((v: any) => ({ ...v, productTitle: p.title, productThumb: p.thumbnail }))
  )

  const filtered = search
    ? allVariants.filter((v: any) =>
        v.productTitle?.toLowerCase().includes(search.toLowerCase()) ||
        v.title?.toLowerCase().includes(search.toLowerCase()) ||
        v.sku?.toLowerCase().includes(search.toLowerCase())
      )
    : allVariants

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por produto, variante ou SKU..."
          className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                {['Produto', 'Variante', 'SKU', 'Estoque', 'Status', 'Ações'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide px-4 py-3 first:pl-6 last:pr-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {isLoading && <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-500">Carregando...</td></tr>}
              {!isLoading && filtered.length === 0 && <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-500">Nenhuma variante encontrada</td></tr>}
              {filtered.map((variant: any) => {
                const qty = variant.inventory_quantity || 0
                const stockStatus = qty === 0 ? { label: 'Sem estoque', color: 'red' } :
                  qty < 5 ? { label: 'Estoque baixo', color: 'orange' } :
                  { label: 'Em estoque', color: 'green' }
                return (
                  <tr key={variant.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                    <td className="px-4 pl-6 py-3">
                      <div className="flex items-center gap-3">
                        {variant.productThumb ? (
                          <img src={variant.productThumb} alt="" className="w-9 h-9 rounded-lg object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                            <Package size={14} className="text-slate-400" />
                          </div>
                        )}
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{variant.productTitle}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{variant.title}</td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-500">{variant.sku || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {qty < 5 && qty > 0 && <AlertTriangle size={14} className="text-orange-500" />}
                        <span className={`text-sm font-bold ${qty === 0 ? 'text-red-600' : qty < 5 ? 'text-orange-600' : 'text-slate-900 dark:text-slate-100'}`}>
                          {qty}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={stockStatus.color as any}>{stockStatus.label}</Badge>
                    </td>
                    <td className="px-4 pr-6 py-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => { setEditModal(variant); setNewQty(String(qty)) }}
                      >
                        Ajustar
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 dark:border-slate-700">
          <span className="text-sm text-slate-500">{total} produtos</span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
            <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center px-2">
              Pág. {page + 1} / {Math.max(1, Math.ceil(total / limit))}
            </span>
            <Button variant="secondary" size="sm" disabled={(page + 1) * limit >= total} onClick={() => setPage((p) => p + 1)}>Próxima</Button>
          </div>
        </div>
      </div>

      <Modal open={!!editModal} onClose={() => setEditModal(null)} title="Ajustar Estoque">
        {editModal && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>{editModal.productTitle}</strong> — {editModal.title}
            </p>
            <Input
              label="Nova quantidade"
              type="number"
              value={newQty}
              onChange={(e) => setNewQty(e.target.value)}
              min="0"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                loading={updateStock.isPending}
                onClick={() => updateStock.mutate({ variantId: editModal.id, qty: Number(newQty) })}
                className="flex-1"
              >
                Salvar
              </Button>
              <Button variant="secondary" onClick={() => setEditModal(null)} className="flex-1">Cancelar</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

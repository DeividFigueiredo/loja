import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Search, Eye, RefreshCw } from 'lucide-react'
import { api, formatCurrency, formatDate, ORDER_STATUS_MAP, PAYMENT_STATUS_MAP, FULFILLMENT_STATUS_MAP } from '../../lib/api'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Input'

export default function OrderList() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(0)
  const limit = 20
  const navigate = useNavigate()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['orders', page, statusFilter],
    queryFn: () => {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(page * limit),
        order: '-created_at',
      })
      if (statusFilter) params.set('status[]', statusFilter)
      return api.get(`/admin/orders?${params}`).then((r) => r.data)
    },
  })

  const orders = data?.orders || []
  const total = data?.count || 0

  const filtered = search
    ? orders.filter((o: any) =>
        String(o.display_id).includes(search) ||
        o.email?.toLowerCase().includes(search.toLowerCase()) ||
        o.customer?.first_name?.toLowerCase().includes(search.toLowerCase())
      )
    : orders

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por ID, email ou cliente..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0) }}
          options={[
            { value: '', label: 'Todos os status' },
            { value: 'pending', label: 'Pendente' },
            { value: 'processing', label: 'Processando' },
            { value: 'completed', label: 'Concluído' },
            { value: 'canceled', label: 'Cancelado' },
          ]}
          className="w-48"
        />
        <Button variant="secondary" icon={<RefreshCw size={14} />} onClick={() => refetch()}>
          Atualizar
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                {['Pedido', 'Data', 'Cliente', 'Status', 'Pagamento', 'Envio', 'Total', 'Ações'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide px-4 py-3 first:pl-6 last:pr-6">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {isLoading && (
                <tr><td colSpan={8} className="px-6 py-10 text-center text-slate-500">Carregando...</td></tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-10 text-center text-slate-500">Nenhum pedido encontrado</td></tr>
              )}
              {filtered.map((order: any) => {
                const status = ORDER_STATUS_MAP[order.status] || { label: order.status, color: 'gray' }
                const payment = PAYMENT_STATUS_MAP[order.payment_status] || { label: order.payment_status, color: 'gray' }
                const fulfillment = FULFILLMENT_STATUS_MAP[order.fulfillment_status] || { label: order.fulfillment_status, color: 'gray' }
                return (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                    <td className="px-4 pl-6 py-3 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      #{order.display_id}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                      <div>{order.customer?.first_name || '—'} {order.customer?.last_name || ''}</div>
                      <div className="text-xs text-slate-400">{order.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={status.color as any}>{status.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={payment.color as any}>{payment.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={fulfillment.color as any}>{fulfillment.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {formatCurrency(order.total || 0, order.currency_code?.toUpperCase())}
                    </td>
                    <td className="px-4 pr-6 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Eye size={14} />}
                        onClick={() => navigate(`/pedidos/${order.id}`)}
                      >
                        Ver
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 dark:border-slate-700">
          <span className="text-sm text-slate-500">
            {total} pedidos no total
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              Anterior
            </Button>
            <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center px-2">
              Pág. {page + 1} / {Math.max(1, Math.ceil(total / limit))}
            </span>
            <Button variant="secondary" size="sm" disabled={(page + 1) * limit >= total} onClick={() => setPage((p) => p + 1)}>
              Próxima
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

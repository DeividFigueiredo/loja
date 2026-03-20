import { useQuery } from '@tanstack/react-query'
import { ShoppingCart, Package, Users, DollarSign, TrendingUp, Clock } from 'lucide-react'
import { api, formatCurrency, ORDER_STATUS_MAP } from '../lib/api'
import { StatCard } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

export default function Dashboard() {
  const { data: ordersData } = useQuery({
    queryKey: ['orders-recent'],
    queryFn: () => api.get('/admin/orders?limit=5&order=-created_at').then((r) => r.data),
    refetchInterval: 30000,
  })

  const { data: productsData } = useQuery({
    queryKey: ['products-count'],
    queryFn: () => api.get('/admin/products?limit=1').then((r) => r.data),
  })

  const { data: customersData } = useQuery({
    queryKey: ['customers-count'],
    queryFn: () => api.get('/admin/customers?limit=1').then((r) => r.data),
  })

  const { data: analyticsData } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => api.get('/admin/orders?limit=100').then((r) => r.data),
  })

  const totalRevenue = analyticsData?.orders?.reduce((sum: number, o: any) => {
    if (o.payment_status === 'captured') return sum + (o.total || 0)
    return sum
  }, 0) || 0

  const pendingOrders = analyticsData?.orders?.filter((o: any) => o.status === 'pending').length || 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Receita Total"
          value={formatCurrency(totalRevenue)}
          icon={<DollarSign size={22} />}
          color="green"
          change="últimos 100 pedidos"
        />
        <StatCard
          title="Total de Pedidos"
          value={analyticsData?.count || 0}
          icon={<ShoppingCart size={22} />}
          color="blue"
          change={`${pendingOrders} pendentes`}
          changeType={pendingOrders > 0 ? 'down' : 'neutral'}
        />
        <StatCard
          title="Produtos"
          value={productsData?.count || 0}
          icon={<Package size={22} />}
          color="indigo"
        />
        <StatCard
          title="Clientes"
          value={customersData?.count || 0}
          icon={<Users size={22} />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock size={16} className="text-indigo-500" />
              Pedidos Recentes
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide px-6 py-3">Pedido</th>
                  <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide px-6 py-3">Cliente</th>
                  <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide px-6 py-3">Status</th>
                  <th className="text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide px-6 py-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {ordersData?.orders?.slice(0, 5).map((order: any) => {
                  const status = ORDER_STATUS_MAP[order.status] || { label: order.status, color: 'gray' }
                  return (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-3 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        #{order.display_id}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-700 dark:text-slate-300">
                        {order.customer?.first_name || order.email?.split('@')[0] || '—'}
                      </td>
                      <td className="px-6 py-3">
                        <Badge color={status.color as any}>{status.label}</Badge>
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 text-right">
                        {formatCurrency(order.total || 0, order.currency_code?.toUpperCase())}
                      </td>
                    </tr>
                  )
                })}
                {!ordersData?.orders?.length && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 text-sm">Nenhum pedido encontrado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <TrendingUp size={16} className="text-indigo-500" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Resumo</h3>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: 'Pedidos Pendentes', value: pendingOrders, color: 'text-yellow-600' },
              { label: 'Pedidos Concluídos', value: analyticsData?.orders?.filter((o: any) => o.status === 'completed').length || 0, color: 'text-green-600' },
              { label: 'Pedidos Cancelados', value: analyticsData?.orders?.filter((o: any) => o.status === 'canceled').length || 0, color: 'text-red-600' },
              { label: 'Aguardando Pagamento', value: analyticsData?.orders?.filter((o: any) => o.payment_status === 'awaiting').length || 0, color: 'text-blue-600' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
                <span className={`font-bold text-lg ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

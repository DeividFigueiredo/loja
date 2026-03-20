import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Package, MapPin, CreditCard, Truck } from 'lucide-react'
import { api, formatCurrency, formatDate, ORDER_STATUS_MAP, PAYMENT_STATUS_MAP, FULFILLMENT_STATUS_MAP } from '../../lib/api'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import toast from 'react-hot-toast'

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get(`/admin/orders/${id}`).then((r) => r.data.order),
  })

  const updateStatus = useMutation({
    mutationFn: (_status: string) => api.post(`/admin/orders/${id}/complete`),
    onSuccess: () => {
      toast.success('Status atualizado!')
      queryClient.invalidateQueries({ queryKey: ['order', id] })
    },
    onError: () => toast.error('Erro ao atualizar status'),
  })

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
    </div>
  )

  if (!data) return <div className="text-center text-slate-500 py-20">Pedido não encontrado</div>

  const order = data
  const status = ORDER_STATUS_MAP[order.status] || { label: order.status, color: 'gray' }
  const payment = PAYMENT_STATUS_MAP[order.payment_status] || { label: order.payment_status, color: 'gray' }
  const fulfillment = FULFILLMENT_STATUS_MAP[order.fulfillment_status] || { label: order.fulfillment_status, color: 'gray' }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" icon={<ArrowLeft size={16} />} onClick={() => navigate('/pedidos')}>
          Voltar
        </Button>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Pedido #{order.display_id}
          </h2>
          <Badge color={status.color as any}>{status.label}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <CreditCard size={20} className="text-blue-500" />
          <div>
            <p className="text-xs text-slate-500">Pagamento</p>
            <Badge color={payment.color as any}>{payment.label}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <Truck size={20} className="text-green-500" />
          <div>
            <p className="text-xs text-slate-500">Envio</p>
            <Badge color={fulfillment.color as any}>{fulfillment.label}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <Package size={20} className="text-indigo-500" />
          <div>
            <p className="text-xs text-slate-500">Data do Pedido</p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{formatDate(order.created_at)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card title="Itens do Pedido" action={<Package size={16} className="text-slate-400" />}>
            <div className="space-y-3">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/40 rounded-lg">
                  {item.thumbnail && (
                    <img src={item.thumbnail} alt={item.title} className="w-12 h-12 rounded-lg object-cover bg-slate-200" />
                  )}
                  {!item.thumbnail && (
                    <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                      <Package size={18} className="text-slate-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.variant?.title} · Qtd: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    {formatCurrency(item.unit_price * item.quantity, order.currency_code?.toUpperCase())}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
              {order.shipping_total > 0 && (
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Frete</span>
                  <span>{formatCurrency(order.shipping_total, order.currency_code?.toUpperCase())}</span>
                </div>
              )}
              {order.discount_total > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Desconto</span>
                  <span>-{formatCurrency(order.discount_total, order.currency_code?.toUpperCase())}</span>
                </div>
              )}
              {order.tax_total > 0 && (
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Impostos</span>
                  <span>{formatCurrency(order.tax_total, order.currency_code?.toUpperCase())}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Total</span>
                <span>{formatCurrency(order.total, order.currency_code?.toUpperCase())}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Cliente">
            <div className="space-y-2">
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {order.customer?.first_name} {order.customer?.last_name}
              </p>
              <p className="text-sm text-slate-500">{order.email}</p>
              {order.customer?.phone && <p className="text-sm text-slate-500">{order.customer.phone}</p>}
            </div>
          </Card>

          {order.shipping_address && (
            <Card title="Endereço de Entrega" action={<MapPin size={16} className="text-slate-400" />}>
              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                <p>{order.shipping_address.address_1}</p>
                {order.shipping_address.address_2 && <p>{order.shipping_address.address_2}</p>}
                <p>{order.shipping_address.city}, {order.shipping_address.province}</p>
                <p>{order.shipping_address.postal_code} — {order.shipping_address.country_code?.toUpperCase()}</p>
              </div>
            </Card>
          )}

          {order.status === 'pending' && (
            <Card title="Ações">
              <div className="space-y-2">
                <Button
                  variant="primary"
                  className="w-full"
                  loading={updateStatus.isPending}
                  onClick={() => updateStatus.mutate('completed')}
                >
                  Marcar como Concluído
                </Button>
                <Button variant="danger" className="w-full">
                  Cancelar Pedido
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

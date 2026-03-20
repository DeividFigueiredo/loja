import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Store, Globe, CreditCard, Truck, Settings as SettingsIcon } from 'lucide-react'

export default function Settings() {
  const { data: storeData } = useQuery({
    queryKey: ['store'],
    queryFn: () => api.get('/admin/store').then((r) => r.data.store),
  })

  const { data: regionsData } = useQuery({
    queryKey: ['regions'],
    queryFn: () => api.get('/admin/regions?limit=50').then((r) => r.data),
  })

  const { data: shippingData } = useQuery({
    queryKey: ['shipping-options'],
    queryFn: () => api.get('/admin/shipping-options?limit=50').then((r) => r.data),
  })

  const { data: paymentData } = useQuery({
    queryKey: ['payment-providers'],
    queryFn: () => api.get('/admin/payment-providers').then((r) => r.data),
  })

  return (
    <div className="space-y-6 max-w-4xl">
      <Card title="Loja" action={<Store size={16} className="text-slate-400" />}>
        {storeData ? (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Nome</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">{storeData.name}</p>
            </div>
            <div>
              <p className="text-slate-500">Moeda padrão</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">{storeData.default_currency_code?.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-slate-500">Moedas aceitas</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {storeData.currencies?.map((c: any) => (
                  <Badge key={c.code} color="blue">{c.code?.toUpperCase()}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-slate-500">Países aceitos</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">{storeData.default_sales_channel?.countries?.length || 0} país(es)</p>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 text-sm">Carregando...</p>
        )}
      </Card>

      <Card title="Regiões" action={<Globe size={16} className="text-slate-400" />}>
        <div className="space-y-3">
          {regionsData?.regions?.length === 0 && <p className="text-slate-500 text-sm">Nenhuma região configurada</p>}
          {regionsData?.regions?.map((region: any) => (
            <div key={region.id} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{region.name}</p>
                <p className="text-xs text-slate-500">{region.countries?.map((c: any) => c.display_name).join(', ')}</p>
              </div>
              <Badge color="blue">{region.currency_code?.toUpperCase()}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Opções de Frete" action={<Truck size={16} className="text-slate-400" />}>
        <div className="space-y-3">
          {shippingData?.shipping_options?.length === 0 && <p className="text-slate-500 text-sm">Nenhuma opção de frete configurada</p>}
          {shippingData?.shipping_options?.map((opt: any) => (
            <div key={opt.id} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{opt.name}</p>
                <p className="text-xs text-slate-500">{opt.provider_id} · {opt.region?.name}</p>
              </div>
              <Badge color={opt.is_return ? 'orange' : 'green'}>{opt.is_return ? 'Devolução' : 'Entrega'}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Provedores de Pagamento" action={<CreditCard size={16} className="text-slate-400" />}>
        <div className="space-y-3">
          {paymentData?.payment_providers?.length === 0 && <p className="text-slate-500 text-sm">Nenhum provedor configurado</p>}
          {paymentData?.payment_providers?.map((pp: any) => (
            <div key={pp.id} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{pp.id}</p>
              <Badge color="green">Ativo</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Sistema" action={<SettingsIcon size={16} className="text-slate-400" />}>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
            <span className="text-slate-500">Backend URL</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">{import.meta.env.VITE_MEDUSA_URL || 'http://localhost:9000'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
            <span className="text-slate-500">Versão do Painel</span>
            <Badge color="indigo">v1.0.0</Badge>
          </div>
        </div>
      </Card>
    </div>
  )
}

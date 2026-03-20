import { useQuery } from '@tanstack/react-query'
import { Ticket } from 'lucide-react'
import { api, formatDate } from '../../lib/api'
import { Badge } from '../../components/ui/Badge'

export default function CouponList() {
  const { data, isLoading } = useQuery({
    queryKey: ['discounts-all'],
    queryFn: () => api.get('/admin/discounts?limit=100&is_dynamic=true').then((r) => r.data),
  })

  const coupons = data?.discounts || []

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
          <Ticket size={16} className="text-indigo-500" />
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Cupons Dinâmicos</h3>
          <span className="ml-auto text-xs text-slate-500">Cupons que geram códigos únicos</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
              {['Cupom', 'Tipo', 'Usos totais', 'Máx. por cliente', 'Expira em', 'Status'].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide px-4 py-3 first:pl-6 last:pr-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {isLoading && <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-500">Carregando...</td></tr>}
            {!isLoading && coupons.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-16 text-center">
                <Ticket size={40} className="mx-auto mb-3 text-slate-300" />
                <p className="text-slate-500">Nenhum cupom dinâmico criado</p>
                <p className="text-xs text-slate-400 mt-1">Cupons são criados na página de Descontos</p>
              </td></tr>
            )}
            {coupons.map((d: any) => (
              <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                <td className="px-4 pl-6 py-3 text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">{d.code}</td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                  {d.rule?.type === 'percentage' ? `${d.rule.value}%` : d.rule?.type === 'fixed' ? 'Valor fixo' : 'Frete grátis'}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{d.usage_count || 0}</td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{d.usage_limit || '—'}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{d.ends_at ? formatDate(d.ends_at) : '—'}</td>
                <td className="px-4 pr-6 py-3">
                  <Badge color={d.is_disabled ? 'gray' : 'green'}>{d.is_disabled ? 'Desativado' : 'Ativo'}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

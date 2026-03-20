import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Mail, Phone } from 'lucide-react'
import { api, formatDate } from '../../lib/api'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'

export default function CustomerList() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const limit = 20

  const { data, isLoading } = useQuery({
    queryKey: ['customers', page],
    queryFn: () =>
      api.get(`/admin/customers?limit=${limit}&offset=${page * limit}&order=-created_at`).then((r) => r.data),
  })

  const customers = data?.customers || []
  const total = data?.count || 0

  const filtered = search
    ? customers.filter((c: any) =>
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        c.last_name?.toLowerCase().includes(search.toLowerCase())
      )
    : customers

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cliente por nome ou email..."
          className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                {['Cliente', 'Email', 'Telefone', 'Pedidos', 'Cadastro', 'Status'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide px-4 py-3 first:pl-6 last:pr-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {isLoading && <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-500">Carregando...</td></tr>}
              {!isLoading && filtered.length === 0 && <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-500">Nenhum cliente encontrado</td></tr>}
              {filtered.map((customer: any) => (
                <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                  <td className="px-4 pl-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          {(customer.first_name?.[0] || customer.email?.[0] || '?').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {customer.first_name} {customer.last_name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Mail size={12} className="text-slate-400" />
                      {customer.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                    {customer.phone ? (
                      <div className="flex items-center gap-1.5">
                        <Phone size={12} className="text-slate-400" />
                        {customer.phone}
                      </div>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                    {customer.orders?.length || 0}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {formatDate(customer.created_at)}
                  </td>
                  <td className="px-4 pr-6 py-3">
                    <Badge color={customer.has_account ? 'green' : 'gray'}>
                      {customer.has_account ? 'Conta ativa' : 'Visitante'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 dark:border-slate-700">
          <span className="text-sm text-slate-500">{total} clientes no total</span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
            <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center px-2">
              Pág. {page + 1} / {Math.max(1, Math.ceil(total / limit))}
            </span>
            <Button variant="secondary" size="sm" disabled={(page + 1) * limit >= total} onClick={() => setPage((p) => p + 1)}>Próxima</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

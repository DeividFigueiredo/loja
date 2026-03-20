import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, Package, RefreshCw } from 'lucide-react'
import { api, formatCurrency } from '../../lib/api'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import toast from 'react-hot-toast'

export default function ProductList() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const limit = 20
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['products', page],
    queryFn: () =>
      api.get(`/admin/products?limit=${limit}&offset=${page * limit}&order=-created_at`).then((r) => r.data),
  })

  const deleteProduct = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/products/${id}`),
    onSuccess: () => {
      toast.success('Produto excluído!')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: () => toast.error('Erro ao excluir produto'),
  })

  const products = data?.products || []
  const total = data?.count || 0

  const filtered = search
    ? products.filter((p: any) => p.title?.toLowerCase().includes(search.toLowerCase()))
    : products

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produto..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <Button variant="secondary" icon={<RefreshCw size={14} />} onClick={() => refetch()}>Atualizar</Button>
        <Button icon={<Plus size={14} />} onClick={() => navigate('/produtos/novo')}>Novo Produto</Button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                {['Produto', 'Status', 'Variantes', 'Estoque', 'Preço base', 'Ações'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide px-4 py-3 first:pl-6 last:pr-6">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {isLoading && (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-500">Carregando...</td></tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-500">Nenhum produto encontrado</td></tr>
              )}
              {filtered.map((product: any) => {
                const firstVariant = product.variants?.[0]
                const firstPrice = firstVariant?.prices?.[0]
                const totalStock = product.variants?.reduce((sum: number, v: any) => sum + (v.inventory_quantity || 0), 0) || 0

                return (
                  <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                    <td className="px-4 pl-6 py-3">
                      <div className="flex items-center gap-3">
                        {product.thumbnail ? (
                          <img src={product.thumbnail} alt={product.title} className="w-10 h-10 rounded-lg object-cover bg-slate-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                            <Package size={16} className="text-slate-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{product.title}</p>
                          <p className="text-xs text-slate-500 truncate max-w-xs">{product.subtitle || product.handle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={product.status === 'published' ? 'green' : product.status === 'draft' ? 'gray' : 'yellow'}>
                        {product.status === 'published' ? 'Publicado' : product.status === 'draft' ? 'Rascunho' : product.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {product.variants?.length || 0}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {totalStock}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">
                      {firstPrice ? formatCurrency(firstPrice.amount, firstPrice.currency_code?.toUpperCase()) : '—'}
                    </td>
                    <td className="px-4 pr-6 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" icon={<Edit size={14} />} onClick={() => navigate(`/produtos/${product.id}`)}>
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Trash2 size={14} />}
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            if (confirm(`Excluir "${product.title}"?`)) deleteProduct.mutate(product.id)
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 dark:border-slate-700">
          <span className="text-sm text-slate-500">{total} produtos no total</span>
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

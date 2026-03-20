import { useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/pedidos': 'Pedidos',
  '/produtos': 'Produtos',
  '/clientes': 'Clientes',
  '/estoque': 'Estoque',
  '/colecoes': 'Coleções',
  '/categorias': 'Categorias',
  '/descontos': 'Descontos',
  '/gift-cards': 'Gift Cards',
  '/cupons': 'Cupons',
  '/usuarios': 'Usuários',
  '/configuracoes': 'Configurações',
}

export function Layout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const { pathname } = useLocation()

  const base = '/' + pathname.split('/')[1]
  const title = titles[base] || 'Painel'

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-slate-900">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex flex-col flex-1 min-w-0">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

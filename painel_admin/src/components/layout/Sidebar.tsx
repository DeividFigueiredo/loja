import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingCart, Package, Users, Tag, FolderTree,
  Layers, Ticket, Gift, Warehouse, Settings, LogOut, ChevronLeft, ChevronRight, Store, UserCog
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { to: '/produtos', label: 'Produtos', icon: Package },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/estoque', label: 'Estoque', icon: Warehouse },
  { to: '/colecoes', label: 'Coleções', icon: Layers },
  { to: '/categorias', label: 'Categorias', icon: FolderTree },
  { to: '/descontos', label: 'Descontos', icon: Tag },
  { to: '/gift-cards', label: 'Gift Cards', icon: Gift },
  { to: '/cupons', label: 'Cupons', icon: Ticket },
  { to: '/usuarios', label: 'Usuários', icon: UserCog },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { logout } = useAuth()

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} flex-shrink-0 bg-slate-900 dark:bg-slate-950 flex flex-col h-screen transition-all duration-300 relative border-r border-slate-800`}>
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-4 h-16 border-b border-slate-800`}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Store size={20} className="text-indigo-400" />
            <span className="font-bold text-slate-100 text-sm">Painel Admin</span>
          </div>
        )}
        {collapsed && <Store size={20} className="text-indigo-400" />}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-full p-1 shadow-md transition-colors z-10"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? 'justify-center px-0' : 'px-4'} py-2.5 mx-2 rounded-lg text-sm transition-colors duration-150 group gap-3 mb-0.5 ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-3">
        <button
          onClick={logout}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors text-sm`}
          title={collapsed ? 'Sair' : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  )
}

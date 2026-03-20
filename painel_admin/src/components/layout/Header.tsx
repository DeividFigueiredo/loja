import { Bell, Sun, Moon, Search } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()

  const initials = user
    ? `${user.first_name?.[0] || user.email[0]}${user.last_name?.[0] || ''}`.toUpperCase()
    : '?'

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-56 pl-9 pr-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 border border-transparent focus:border-slate-300 dark:focus:border-slate-500 rounded-lg text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none transition-colors"
          />
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
            {initials}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-none">
              {user?.first_name || user?.email?.split('@')[0] || 'Admin'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

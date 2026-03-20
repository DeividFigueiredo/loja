import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Login realizado com sucesso!')
      navigate('/')
    } catch {
      toast.error('Email ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors text-sm"
      >
        {theme === 'dark' ? '☀️ Claro' : '🌙 Escuro'}
      </button>

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Store size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Painel Admin</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Entre com sua conta</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoFocus
            />
            <div className="relative">
              <Input
                label="Senha"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 bottom-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
              Entrar
            </Button>
          </form>
        </div>
        <p className="text-center text-xs text-slate-500 mt-4">
          Painel administrativo — acesso restrito
        </p>
      </div>
    </div>
  )
}

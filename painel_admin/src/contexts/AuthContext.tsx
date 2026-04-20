import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '../lib/api'

interface User {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  metadata: Record<string, any> | null
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('medusa_user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('medusa_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      // Medusa v2 não expõe GET /auth/session; o perfil do admin é /admin/users/me
      api.get('/admin/users/me')
        .then((res) => {
          const u = res.data.user
          setUser(u)
          localStorage.setItem('medusa_user', JSON.stringify(u))
        })
        .catch(() => {
          setToken(null)
          setUser(null)
          localStorage.removeItem('medusa_token')
          localStorage.removeItem('medusa_user')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/user/emailpass', { email, password })
    const t = res.data.token
    localStorage.setItem('medusa_token', t)
    setToken(t)
    const meRes = await api.get('/admin/users/me', {
      headers: { Authorization: `Bearer ${t}` },
    })
    const u = meRes.data.user
    setUser(u)
    localStorage.setItem('medusa_user', JSON.stringify(u))
  }

  const logout = () => {
    // Sessão por cookie (DELETE /auth/session) não se aplica quando só usamos JWT no header
    setToken(null)
    setUser(null)
    localStorage.removeItem('medusa_token')
    localStorage.removeItem('medusa_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

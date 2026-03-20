import axios from 'axios'

const MEDUSA_URL = import.meta.env.VITE_MEDUSA_URL || 'http://localhost:9000'

export const api = axios.create({
  baseURL: MEDUSA_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medusa_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('medusa_token')
      localStorage.removeItem('medusa_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const formatCurrency = (amount: number, currency = 'BRL') => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(amount / 100)
}

export const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export const ORDER_STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'yellow' },
  processing: { label: 'Processando', color: 'blue' },
  completed: { label: 'Concluído', color: 'green' },
  canceled: { label: 'Cancelado', color: 'red' },
  archived: { label: 'Arquivado', color: 'gray' },
  requires_action: { label: 'Requer Ação', color: 'orange' },
}

export const PAYMENT_STATUS_MAP: Record<string, { label: string; color: string }> = {
  not_paid: { label: 'Não Pago', color: 'red' },
  awaiting: { label: 'Aguardando', color: 'yellow' },
  captured: { label: 'Pago', color: 'green' },
  partially_captured: { label: 'Parcial', color: 'blue' },
  partially_refunded: { label: 'Reemb. Parcial', color: 'orange' },
  refunded: { label: 'Reembolsado', color: 'purple' },
  canceled: { label: 'Cancelado', color: 'red' },
  requires_action: { label: 'Requer Ação', color: 'orange' },
}

export const FULFILLMENT_STATUS_MAP: Record<string, { label: string; color: string }> = {
  not_fulfilled: { label: 'Não Enviado', color: 'gray' },
  partially_fulfilled: { label: 'Enviado Parcial', color: 'blue' },
  fulfilled: { label: 'Enviado', color: 'green' },
  partially_shipped: { label: 'Enviado Parcial', color: 'blue' },
  shipped: { label: 'Enviado', color: 'green' },
  partially_returned: { label: 'Devolvido Parcial', color: 'orange' },
  returned: { label: 'Devolvido', color: 'purple' },
  canceled: { label: 'Cancelado', color: 'red' },
  requires_action: { label: 'Requer Ação', color: 'orange' },
}

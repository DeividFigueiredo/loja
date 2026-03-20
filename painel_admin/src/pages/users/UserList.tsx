import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Mail } from 'lucide-react'
import { api, formatDate } from '../../lib/api'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import toast from 'react-hot-toast'

export default function UserList() {
  const [inviteModal, setInviteModal] = useState(false)
  const [editModal, setEditModal] = useState<any>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [metadata, setMetadata] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/admin/users').then((r) => r.data),
  })

  const invite = useMutation({
    mutationFn: () => api.post('/admin/invites', { email: inviteEmail }),
    onSuccess: () => {
      toast.success(`Convite enviado para ${inviteEmail}!`)
      setInviteModal(false)
      setInviteEmail('')
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Erro ao enviar convite'),
  })

  const updateUser = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.post(`/admin/users/${id}`, data),
    onSuccess: () => {
      toast.success('Usuário atualizado!')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setEditModal(null)
    },
    onError: () => toast.error('Erro ao atualizar usuário'),
  })

  const openEdit = (user: any) => {
    setMetadata(JSON.stringify(user.metadata || {}, null, 2))
    setEditModal(user)
  }

  const users = data?.users || []

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button icon={<Plus size={14} />} onClick={() => setInviteModal(true)}>Convidar Usuário</Button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
              {['Usuário', 'Email', 'Permissões', 'Criado em', 'Ações'].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide px-4 py-3 first:pl-6 last:pr-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {isLoading && <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">Carregando...</td></tr>}
            {!isLoading && users.length === 0 && <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">Nenhum usuário</td></tr>}
            {users.map((user: any) => {
              const meta = user.metadata || {}
              const isSuperAdmin = meta.is_super_admin === true
              const perms = []
              if (isSuperAdmin) perms.push({ label: 'Super Admin', color: 'indigo' })
              if (meta.can_manage_products) perms.push({ label: 'Produtos', color: 'green' })
              if (meta.can_view_orders) perms.push({ label: 'Pedidos', color: 'blue' })
              if (meta.can_view_stock) perms.push({ label: 'Estoque', color: 'orange' })

              return (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                  <td className="px-4 pl-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          {(user.first_name?.[0] || user.email?.[0] || '?').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {user.first_name} {user.last_name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Mail size={12} className="text-slate-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {perms.length === 0 ? <Badge color="gray">Sem permissões</Badge> : perms.map((p, i) => <Badge key={i} color={p.color as any}>{p.label}</Badge>)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{formatDate(user.created_at)}</td>
                  <td className="px-4 pr-6 py-3">
                    <Button variant="ghost" size="sm" icon={<Edit size={14} />} onClick={() => openEdit(user)}>
                      Permissões
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Modal open={inviteModal} onClose={() => setInviteModal(false)} title="Convidar Usuário">
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Envie um convite por e-mail. O usuário receberá um link para criar a senha.
            Após aceitar, defina as permissões dele.
          </p>
          <Input label="E-mail *" type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="usuario@email.com" autoFocus />
          <div className="flex gap-2">
            <Button loading={invite.isPending} onClick={() => invite.mutate()} className="flex-1" icon={<Mail size={14} />}>
              Enviar Convite
            </Button>
            <Button variant="secondary" onClick={() => setInviteModal(false)} className="flex-1">Cancelar</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!editModal} onClose={() => setEditModal(null)} title="Editar Permissões" size="lg">
        {editModal && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Usuário: <strong className="text-slate-900 dark:text-slate-100">{editModal.email}</strong>
            </p>
            <div className="bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4 space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Atalhos de permissão</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Super Admin', value: { is_super_admin: true, can_manage_products: true, can_view_orders: true, can_view_stock: true } },
                  { label: 'Gerente de Produtos', value: { is_super_admin: false, can_manage_products: true, can_view_orders: false, can_view_stock: true } },
                  { label: 'Gerente de Pedidos', value: { is_super_admin: false, can_manage_products: false, can_view_orders: true, can_view_stock: false } },
                  { label: 'Visualizador de Estoque', value: { is_super_admin: false, can_manage_products: false, can_view_orders: false, can_view_stock: true } },
                ].map((preset) => (
                  <Button key={preset.label} variant="secondary" size="sm" className="text-left justify-start"
                    onClick={() => setMetadata(JSON.stringify(preset.value, null, 2))}>
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Metadata (JSON)</label>
              <textarea
                value={metadata}
                onChange={(e) => setMetadata(e.target.value)}
                rows={8}
                className="w-full font-mono text-xs rounded-lg border bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-slate-500">Chaves: <code>is_super_admin</code>, <code>can_manage_products</code>, <code>can_view_orders</code>, <code>can_view_stock</code></p>
            </div>
            <div className="flex gap-2">
              <Button
                loading={updateUser.isPending}
                onClick={() => {
                  try {
                    const parsed = JSON.parse(metadata)
                    updateUser.mutate({ id: editModal.id, data: { metadata: parsed } })
                  } catch {
                    toast.error('JSON inválido')
                  }
                }}
                className="flex-1"
              >
                Salvar Permissões
              </Button>
              <Button variant="secondary" onClick={() => setEditModal(null)} className="flex-1">Cancelar</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

import type { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * Redefine a senha do login admin (emailpass) para um e-mail que já existe.
 *
 * Uso (PowerShell):
 *   $env:RESET_EMAIL="seu@email.com"; $env:RESET_PASSWORD="NovaSenhaForte"; npx medusa exec ./src/scripts/reset-admin-password.ts
 *
 * Uso (cmd):
 *   set RESET_EMAIL=seu@email.com&& set RESET_PASSWORD=NovaSenhaForte&& npx medusa exec ./src/scripts/reset-admin-password.ts
 */
export default async function resetAdminPassword({ container }: ExecArgs) {
  const email = process.env.RESET_EMAIL?.trim()
  const password = process.env.RESET_PASSWORD

  if (!email || !password) {
    console.error(
      "Defina RESET_EMAIL e RESET_PASSWORD no ambiente antes de rodar este script."
    )
    console.error(
      'Ex.: $env:RESET_EMAIL="admin@loja.com"; $env:RESET_PASSWORD="..."; npx medusa exec ./src/scripts/reset-admin-password.ts'
    )
    process.exit(1)
  }

  const auth = container.resolve(Modules.AUTH)
  const result = await auth.updateProvider("emailpass", {
    entity_id: email,
    password,
  })

  if (!result.success) {
    console.error("Falha:", result.error ?? "desconhecida")
    process.exit(1)
  }

  console.info(`Senha atualizada para: ${email}`)
}

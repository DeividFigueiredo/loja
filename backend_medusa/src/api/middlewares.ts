import { MedusaError } from "@medusajs/framework/utils"
import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { defineMiddlewares } from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"

const PRODUCTS_PREFIXES = [
  // Produto (cadastro)
  "/admin/products",
  // Coleções / categorias (dependendo do build/UI)
  "/admin/collections",
  "/admin/categories",
  "/admin/product-categories",
  "/admin/product-tags",
  "/admin/product-types",
]

const ORDERS_PREFIX = "/admin/orders"

function isSuperAdmin(metadata: any): boolean {
  return metadata?.is_super_admin === true
}

function isProductsRoute(pathname: string): boolean {
  return PRODUCTS_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function isOrdersRoute(pathname: string): boolean {
  return pathname.startsWith(ORDERS_PREFIX)
}

async function getActorMetadata(req: MedusaRequest): Promise<any> {
  const actorId = (req as any)?.auth_context?.actor_id
  const actorType = (req as any)?.auth_context?.actor_type

  if (!actorId || actorType !== "user") {
    return null
  }

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const query = remoteQueryObjectFromString({
    entryPoint: "user",
    variables: { id: actorId },
    fields: ["metadata"],
  })

  const users = await remoteQuery(query)
  return users?.[0]?.metadata ?? null
}

async function adminPermissionsGuard(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  try {
    const pathname = (req as any)?.path ?? ""

    if (!isProductsRoute(pathname) && !isOrdersRoute(pathname)) {
      return next()
    }

    const metadata = await getActorMetadata(req)

    // Super admin bypass.
    if (isSuperAdmin(metadata)) {
      return next()
    }

    const canManageProducts = metadata?.can_manage_products === true
    const canViewOrders = metadata?.can_view_orders === true

    if (isProductsRoute(pathname)) {
      if (!canManageProducts) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Sem permissão para gerenciar produtos."
        )
      }
      return next()
    }

    if (isOrdersRoute(pathname)) {
      // Pedidos: apenas leitura (GET)
      if (!canViewOrders) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Sem permissão para visualizar pedidos."
        )
      }

      if (String(req.method).toUpperCase() !== "GET") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Apenas leitura de pedidos é permitida."
        )
      }
      return next()
    }

    return next()
  } catch (e: any) {
    throw e
  }
}

export default defineMiddlewares({
  routes: [
    // Produtos / cadastro
    ...PRODUCTS_PREFIXES.map((prefix) => ({
      matcher: new RegExp("^" + prefix.replace(/\//g, "\\/") + "(?:\\/|$)"),
      middlewares: [adminPermissionsGuard],
    })),
    // Pedidos (somente GET)
    {
      matcher: new RegExp("^" + ORDERS_PREFIX.replace(/\//g, "\\/") + "(?:\\/|$)"),
      middlewares: [adminPermissionsGuard],
    },
  ],
})


import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de création d'une commande
 */
export const createOrderValidator = vine.compile(
  vine.object({
    users_id: vine.number().exists({ table: 'users', column: 'id' }),
    currency: vine.string(),
    status_order: vine.enum(['Paid', 'Canceled', 'Failed']),
  }),
)

import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de mise à jour d'une commande
 */
export const updateOrderValidator = vine.compile(
  vine.object({
    currency: vine.string().optional(),
    status_order: vine.enum(['Paid', 'Canceled', 'Failed']).optional(),
  }),
)

import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de récupération des assignations de jeux par ID de plateforme
 */
export const getAllGamePlatformAssignmentByPlatformIdValidator = vine.compile(
  vine.object({
    params: vine.object({
      platformId: vine.number().exists({ table: 'game_platform_assignments', column: 'game_platforms_id' }),
    }),
  }),
)

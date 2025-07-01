import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de récupération des journaux de modifications par titre de jeu
 */
export const getAllGameChangeLogByTitleValidator = vine.compile(
  vine.object({
    params: vine.object({
      title: vine.string(),
    }),
  }),
)

import vine from '@vinejs/vine'

export const getInfoUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
  }),
)

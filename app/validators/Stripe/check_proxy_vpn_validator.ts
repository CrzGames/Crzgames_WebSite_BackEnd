import vine from '@vinejs/vine'

export const checkProxyVpnValidator = vine.compile(
  vine.object({
    ip: vine.string().ipAddress(),
  }),
)

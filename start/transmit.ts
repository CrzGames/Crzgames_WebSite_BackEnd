import transmit from '@adonisjs/transmit/services/main'
import GameVersionsRealtimeService from '#services/game_versions_realtime_service'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Canal des mises a jour de versions pour les launchers connectes.
 * L'acces est reserve aux utilisateurs authentifies.
 */
transmit.authorize(GameVersionsRealtimeService.CHANNEL, (ctx: HttpContext): boolean => {
  return Boolean(ctx.auth.user)
})

GameVersionsRealtimeService.registerTransmitHooks()

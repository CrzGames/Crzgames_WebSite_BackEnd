import logger from '@adonisjs/core/services/logger'
import transmit from '@adonisjs/transmit/services/main'
import type GameVersion from '#models/game_version'
import UserGameLibrary from '#models/user_game_library'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Payload diffused au launcher lorsqu'une version devient disponible.
 */
export type GameVersionAvailableRealtimePayload = {
  gameId: number
  gameTitle: string
  version: string
  isAvailable: true
  publishedAt: string
}

/**
 * Payload du hook de souscription Transmit.
 */
type SubscribeHookPayload = {
  uid: string
  channel: string
  context: HttpContext
}

/**
 * Payload du hook de desabonnement Transmit.
 */
type UnsubscribeHookPayload = {
  uid: string
  channel: string
}

/**
 * Payload du hook de deconnexion Transmit.
 */
type DisconnectHookPayload = {
  uid: string
}

/**
 * Service de diffusion temps reel des mises a jour de versions de jeux.
 */
export default class GameVersionsRealtimeService {
  /**
   * Canal unique ecoute par les launchers.
   */
  public static readonly CHANNEL: string = 'launcher/game-versions/available'
  private static readonly userIdByUid: Map<string, number> = new Map<string, number>()
  private static hooksRegistered: boolean = false

  /**
   * Enregistre les hooks Transmit pour maintenir le mapping uid -> userId.
   * @returns {void}
   */
  public static registerTransmitHooks(): void {
    if (this.hooksRegistered) {
      return
    }

    this.hooksRegistered = true

    transmit.on('subscribe', (payload: SubscribeHookPayload): void => {
      const { uid, channel, context } = payload
      if (channel !== this.CHANNEL) {
        return
      }

      const userId: number | undefined = context.auth.user?.id
      if (!userId) {
        return
      }

      this.userIdByUid.set(uid, userId)
    })

    transmit.on('unsubscribe', (payload: UnsubscribeHookPayload): void => {
      const { uid, channel } = payload
      if (channel === this.CHANNEL) {
        this.userIdByUid.delete(uid)
      }
    })

    transmit.on('disconnect', (payload: DisconnectHookPayload): void => {
      const { uid } = payload
      this.userIdByUid.delete(uid)
    })
  }

  /**
   * Diffuse une version de jeu disponible vers les users concernes.
   * @param {GameVersion} gameVersion - Version de jeu disponible.
   * @returns {Promise<void>}
   */
  public static async broadcastIfAvailable(gameVersion: GameVersion): Promise<void> {
    if (!gameVersion.isAvailable) {
      return
    }

    try {
      await gameVersion.load('game')
      const relatedGameId: number = Number(gameVersion.gamesId ?? gameVersion.game.id)

      const payload: GameVersionAvailableRealtimePayload = {
        gameId: relatedGameId,
        gameTitle: gameVersion.game.title,
        version: gameVersion.version,
        isAvailable: true,
        publishedAt: new Date().toISOString(),
      }

      const ownerRows: UserGameLibrary[] = await UserGameLibrary.query()
        .where('games_id', relatedGameId)
        .select('users_id')
      const ownerUserIdsSet: Set<number> = new Set<number>()
      for (const row of ownerRows) {
        if (row.usersId) {
          ownerUserIdsSet.add(row.usersId)
        }
      }

      if (ownerUserIdsSet.size === 0) {
        logger.info(
          `[SSE] Skip broadcast channel=${this.CHANNEL} gameId=${payload.gameId} version=${payload.version} reason=no-library-owner`,
        )
        return
      }

      const subscriberUids: string[] = transmit.getSubscribersFor(this.CHANNEL)
      if (subscriberUids.length === 0) {
        logger.info(
          `[SSE] Skip broadcast channel=${this.CHANNEL} gameId=${payload.gameId} version=${payload.version} reason=no-subscriber`,
        )
        return
      }

      const targetUids: string[] = subscriberUids.filter((uid: string): boolean => {
        const userId: number | undefined = this.userIdByUid.get(uid)
        return userId !== undefined && ownerUserIdsSet.has(userId)
      })

      if (targetUids.length === 0) {
        logger.info(
          `[SSE] Skip broadcast channel=${this.CHANNEL} gameId=${payload.gameId} version=${payload.version} reason=no-matching-connected-owner`,
        )
        return
      }

      if (targetUids.length === subscriberUids.length) {
        transmit.broadcast(this.CHANNEL, payload)
      } else {
        const targetUidsSet: Set<string> = new Set<string>(targetUids)
        const excludedUids: string[] = subscriberUids.filter((uid: string): boolean => !targetUidsSet.has(uid))
        transmit.broadcastExcept(this.CHANNEL, payload, excludedUids)
      }

      logger.info(
        `[SSE] Broadcast channel=${this.CHANNEL} gameId=${payload.gameId} version=${payload.version} targets=${targetUids.length}/${subscriberUids.length}`,
      )
    } catch (error: unknown) {
      logger.warn(`[SSE] Broadcast skipped: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}

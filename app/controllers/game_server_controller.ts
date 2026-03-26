import type { HttpContext } from '@adonisjs/core/http'
import type GameServer from '#models/game_server'
import GameServerService from '#services/game_server_service'

/**
 *
 */
export default class GameServerController {
  /**
   *
   */
  public async getAllGameServers({ response }: HttpContext): Promise<void> {
    const gameServers: GameServer[] = await GameServerService.getAllGameServers()
    response.status(200).json(gameServers)
  }

  /**
   *
   */
  public async createGameServer({ request, response }: HttpContext): Promise<void> {
    const name: string = request.input('name')
    const region: string = request.input('region')
    const gameServer: GameServer = await GameServerService.createGameServer(name, region)
    response.status(201).json(gameServer)
  }
}

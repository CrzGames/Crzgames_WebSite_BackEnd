import { HttpContext } from '@adonisjs/core/http'
import GameServer from '#models/game_server'
import GameServerService from '#services/game_server_service'

export default class GameServerController {
  public async getAllGameServers({ response }: HttpContext): Promise<void> {
    const gameServers: GameServer[] = await GameServerService.getAllGameServers()
    return response.status(200).json(gameServers)
  }

  public async createGameServer({ request, response }: HttpContext): Promise<void> {
    const { name, region } = request.body()
    const gameServer: GameServer = await GameServerService.createGameServer(name, region)
    return response.status(201).json(gameServer)
  }
}

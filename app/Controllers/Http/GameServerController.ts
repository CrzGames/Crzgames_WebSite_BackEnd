import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GameServer from 'App/Models/GameServer'
import GameServerService from 'App/Services/GameServerService'

export default class GameServerController {
  private async getAllGameServers({ response }: HttpContextContract): Promise<void> {
    const gameServers: GameServer[] = await GameServerService.getAllGameServers()
    return response.status(200).json(gameServers)
  }

  private async createGameServer({ request, response }: HttpContextContract): Promise<void> {
    const { name, region } = request.body()
    const gameServer: GameServer = await GameServerService.createGameServer(name, region)
    return response.status(201).json(gameServer)
  }
}

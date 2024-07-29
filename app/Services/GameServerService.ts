import GameServer from 'App/Models/GameServer'
import { NotFoundException } from 'App/Exceptions/NotFoundException'
import Logger from '@ioc:Adonis/Core/Logger'
import { BadRequestException } from 'App/Exceptions/BadRequestException'

export default class GameServerService {
  public static async getAllGameServers(): Promise<GameServer[]> {
    try {
      return await GameServer.all()
    } catch (error) {
      throw new NotFoundException(`Game servers not found: ${error.message}`)
    }
  }

  public static async createGameServer(name: string, region: string): Promise<GameServer> {
    try {
      return await GameServer.create({
        name: name,
        region: region,
      })
    } catch (error) {
      throw new BadRequestException(`Failed to create game server: ${error.message}`)
    }
  }
}

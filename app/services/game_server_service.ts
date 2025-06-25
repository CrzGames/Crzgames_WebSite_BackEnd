import GameServer from '#models/game_server'
import { NotFoundException } from '#exceptions/not_found_exception'
import logger from '@adonisjs/core/services/logger'
import { BadRequestException } from '#exceptions/bad_request_exception'

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

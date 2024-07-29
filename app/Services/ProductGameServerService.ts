import { NotFoundException } from 'App/Exceptions/NotFoundException'
import { BadRequestException } from 'App/Exceptions/BadRequestException'
import ProductGameServer from 'App/Models/ProductGameServer'

export default class ProductGameServerService {
  public static async getAllProductGameServers(): Promise<ProductGameServer[]> {
    try {
      return await ProductGameServer.query().preload('product').preload('gameServer')
    } catch (error) {
      throw new NotFoundException(`Product game servers not found: ${error.message}`)
    }
  }

  public static async createProductGameServer(
    productId: number,
    gameServerId: number,
  ): Promise<ProductGameServer> {
    try {
      return await ProductGameServer.create({
        products_id: productId,
        game_servers_id: gameServerId,
      })
    } catch (error) {
      throw new BadRequestException(`Failed to create product game server: ${error.message}`)
    }
  }
}

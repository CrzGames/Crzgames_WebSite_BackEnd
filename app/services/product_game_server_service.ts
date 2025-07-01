import NotFoundException from '#exceptions/not_found_exception'
import BadRequestException from '#exceptions/bad_request_exception'
import ProductGameServer from '#models/product_game_server'

export default class ProductGameServerService {
  public static async getAllProductGameServers(): Promise<ProductGameServer[]> {
    try {
      return await ProductGameServer.query().preload('product').preload('gameServer')
    } catch (error) {
      throw new NotFoundException(`Product game servers not found: ${error.message}`)
    }
  }

  public static async createProductGameServer(productId: number, gameServerId: number): Promise<ProductGameServer> {
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

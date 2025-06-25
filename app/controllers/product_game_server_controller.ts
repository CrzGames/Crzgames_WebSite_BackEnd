import { HttpContext } from '@adonisjs/core/http'
import ProductGameServerService from '#services/product_game_server_service'
import ProductGameServer from '#models/product_game_server'

export default class ProductGameServerController {
  public async getAllProductGameServers({ response }: HttpContext): Promise<void> {
    const gameServers: ProductGameServer[] =
      await ProductGameServerService.getAllProductGameServers()
    return response.status(200).json(gameServers)
  }

  public async createProductGameServer({ request, response }: HttpContext): Promise<void> {
    const { products_id, game_servers_id } = request.body()
    const gameServer: ProductGameServer = await ProductGameServerService.createProductGameServer(
      products_id,
      game_servers_id,
    )
    return response.status(201).json(gameServer)
  }
}

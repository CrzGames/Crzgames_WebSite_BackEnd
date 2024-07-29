import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProductGameServerService from 'App/Services/ProductGameServerService'
import ProductGameServer from 'App/Models/ProductGameServer'

export default class ProductGameServerController {
  private async getAllProductGameServers({ response }: HttpContextContract): Promise<void> {
    const gameServers: ProductGameServer[] =
      await ProductGameServerService.getAllProductGameServers()
    return response.status(200).json(gameServers)
  }

  private async createProductGameServer({ request, response }: HttpContextContract): Promise<void> {
    const { products_id, game_servers_id } = request.body()
    const gameServer: ProductGameServer = await ProductGameServerService.createProductGameServer(
      products_id,
      game_servers_id,
    )
    return response.status(201).json(gameServer)
  }
}

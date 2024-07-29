import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { OrderProductService, ProductOrderCommand } from 'App/Services/OrderProductService'
import OrderProduct from 'App/Models/OrderProduct'

export default class OrderProductController {
  private async createOrderProduct({ request, response }: HttpContextContract): Promise<void> {
    const payload: ProductOrderCommand = request.only([
      'orders_id',
      'products_id',
      'quantity',
      'game_servers_id',
      'price',
    ])
    const productOrder: OrderProduct = await OrderProductService.createOrderProduct(payload)
    return response.created(productOrder)
  }

  private async updateOrderProduct({
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const payload: ProductOrderCommand = request.only([
      'orders_id',
      'products_id',
      'quantity',
      'game_servers_id',
      'price',
    ])
    const productOrder: OrderProduct = await OrderProductService.updateOrderProduct(
      params.id,
      payload,
    )
    return response.status(200).json(productOrder)
  }

  private async deleteOrderProduct({ params, response }: HttpContextContract): Promise<void> {
    await OrderProductService.deleteOrderProduct(params.id)
    return response.noContent()
  }

  private async getAllOrderProductsByOrderId({
    params,
    response,
  }: HttpContextContract): Promise<void> {
    const productOrders: OrderProduct[] = await OrderProductService.getAllOrderProductsByOrderId(
      params.orders_id,
    )
    return response.status(200).json(productOrders)
  }
}

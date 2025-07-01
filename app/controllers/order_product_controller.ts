import type { HttpContext } from '@adonisjs/core/http'
import { OrderProductService } from '#services/order_product_service'
import type { ProductOrderCommand } from '#services/order_product_service'
import type OrderProduct from '#models/order_product'

export default class OrderProductController {
  public async createOrderProduct({ request, response }: HttpContext): Promise<void> {
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

  public async updateOrderProduct({ params, request, response }: HttpContext): Promise<void> {
    const payload: ProductOrderCommand = request.only([
      'orders_id',
      'products_id',
      'quantity',
      'game_servers_id',
      'price',
    ])
    const productOrder: OrderProduct = await OrderProductService.updateOrderProduct(params.id, payload)
    return response.status(200).json(productOrder)
  }

  public async deleteOrderProduct({ params, response }: HttpContext): Promise<void> {
    await OrderProductService.deleteOrderProduct(params.id)
    return response.noContent()
  }

  public async getAllOrderProductsByOrderId({ params, response }: HttpContext): Promise<void> {
    const productOrders: OrderProduct[] = await OrderProductService.getAllOrderProductsByOrderId(params.orders_id)
    return response.status(200).json(productOrders)
  }
}

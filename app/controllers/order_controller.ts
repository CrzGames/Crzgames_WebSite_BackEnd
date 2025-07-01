import type { HttpContext } from '@adonisjs/core/http'
import { OrderService } from '#services/order_service'
import type { OrderCommand } from '#services/order_service'
import type Order from '#models/order'
import { createOrderValidator } from '#validators/Order/CreateOrderValidator'
import { updateOrderValidator } from '#validators/Order/UpdateOrderValidator'

export default class OrderController {
  public async createOrder({ request, response }: HttpContext): Promise<void> {
    const payload: OrderCommand = await request.validateUsing(createOrderValidator)
    const order: Order = await OrderService.createOrder(payload)
    return response.created(order)
  }

  public async updateOrder({ params, request, response }: HttpContext): Promise<void> {
    const payload: OrderCommand = await request.validateUsing(updateOrderValidator)
    const order: Order = await OrderService.updateOrder(params.id, payload)
    return response.status(200).json(order)
  }

  public async deleteOrder({ params, response }: HttpContext): Promise<void> {
    await OrderService.deleteOrder(params.id)
    return response.noContent()
  }

  public async getAllOrdersByUserId({ params, response }: HttpContext): Promise<void> {
    const orders: Order[] = await OrderService.getAllOrdersByUserId(params.users_id)
    return response.status(200).json(orders)
  }

  public async getOrderById({ params, response }: HttpContext): Promise<void> {
    const order: Order | null = await OrderService.getOrderById(params.id)
    return order ? response.status(200).json(order) : response.notFound()
  }
}

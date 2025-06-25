import { HttpContext } from '@adonisjs/core/http'
import { OrderService, OrderCommand } from '#services/order_service'
import Order from '#models/order'
import CreateOrderValidator from '#validators/order/create_order_validator'
import UpdateOrderValidator from '#validators/order/update_order_validator'

export default class OrderController {
  public async createOrder({ request, response }: HttpContext): Promise<void> {
    const payload: OrderCommand = await request.validate(CreateOrderValidator)
    const order: Order = await OrderService.createOrder(payload)
    return response.created(order)
  }

  public async updateOrder({ params, request, response }: HttpContext): Promise<void> {
    const payload: OrderCommand = await request.validate(UpdateOrderValidator)
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

  public async geOrderById({ params, response }: HttpContext): Promise<void> {
    const order: Order | null = await OrderService.getOrderById(params.id)
    return order ? response.status(200).json(order) : response.notFound()
  }
}

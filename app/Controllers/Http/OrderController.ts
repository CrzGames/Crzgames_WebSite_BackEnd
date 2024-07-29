import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { OrderService, OrderCommand } from 'App/Services/OrderService'
import Order from 'App/Models/Order'
import CreateOrderValidator from 'App/Validators/Order/CreateOrderValidator'
import UpdateOrderValidator from 'App/Validators/Order/UpdateOrderValidator'

export default class OrderController {
  private async createOrder({ request, response }: HttpContextContract): Promise<void> {
    const payload: OrderCommand = await request.validate(CreateOrderValidator)
    const order: Order = await OrderService.createOrder(payload)
    return response.created(order)
  }

  private async updateOrder({ params, request, response }: HttpContextContract): Promise<void> {
    const payload: OrderCommand = await request.validate(UpdateOrderValidator)
    const order: Order = await OrderService.updateOrder(params.id, payload)
    return response.status(200).json(order)
  }

  private async deleteOrder({ params, response }: HttpContextContract): Promise<void> {
    await OrderService.deleteOrder(params.id)
    return response.noContent()
  }

  private async getAllOrdersByUserId({ params, response }: HttpContextContract): Promise<void> {
    const orders: Order[] = await OrderService.getAllOrdersByUserId(params.users_id)
    return response.status(200).json(orders)
  }

  private async geOrderById({ params, response }: HttpContextContract): Promise<void> {
    const order: Order | null = await OrderService.getOrderById(params.id)
    return order ? response.status(200).json(order) : response.notFound()
  }
}

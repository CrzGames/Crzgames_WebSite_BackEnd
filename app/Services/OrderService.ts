import Order from 'App/Models/Order'
import { BadRequestException } from 'App/Exceptions/BadRequestException'
import { NotFoundException } from 'App/Exceptions/NotFoundException'

export type OrderCommand = {
  users_id?: number
  currency?: string
  status_order?: 'Paid' | 'Canceled' | 'Failed'
  total_price?: number
}

export class OrderService {
  // Create a new order
  public static async createOrder(data: OrderCommand): Promise<Order> {
    try {
      return await Order.create(data)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Update an existing order
  public static async updateOrder(id: number, data: OrderCommand): Promise<Order> {
    const order: Order = await Order.findOrFail(id)

    try {
      order.merge(data)
      await order.save()
      return order
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Delete an order
  public static async deleteOrder(id: number): Promise<void> {
    const order: Order = await Order.findOrFail(id)

    try {
      await order.delete()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Get all orders for a specific user
  public static async getAllOrdersByUserId(userId: number): Promise<Order[]> {
    try {
      return Order.query().where('users_id', userId).preload('user')
    } catch (error) {
      throw new NotFoundException('Orders not found for the specified user')
    }
  }

  // Get a single order by ID
  public static async getOrderById(id: number): Promise<Order | null> {
    try {
      return Order.query().where('id', id).preload('user').firstOrFail()
    } catch (error) {
      throw new NotFoundException('Order not found')
    }
  }
}

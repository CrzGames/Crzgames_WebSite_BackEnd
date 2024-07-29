import OrderProduct from 'App/Models/OrderProduct'
import { BadRequestException } from 'App/Exceptions/BadRequestException'
import { NotFoundException } from 'App/Exceptions/NotFoundException'

export type ProductOrderCommand = {
  orders_id: number
  products_id: number
  quantity: number
  game_servers_id?: number
  price: number
}

export class OrderProductService {
  // Create a new product order
  public static async createOrderProduct(data: ProductOrderCommand): Promise<OrderProduct> {
    try {
      return await OrderProduct.create(data)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Update an existing product order
  public static async updateOrderProduct(
    orderProductId: number,
    data: Partial<ProductOrderCommand>,
  ): Promise<OrderProduct> {
    const productOrder: OrderProduct = await OrderProduct.findOrFail(orderProductId)

    try {
      productOrder.merge(data)
      await productOrder.save()
      return productOrder
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Delete a product order
  public static async deleteOrderProduct(orderProductId: number): Promise<void> {
    const productOrder: OrderProduct = await OrderProduct.findOrFail(orderProductId)

    try {
      await productOrder.delete()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Get all product orders for a specific order
  public static async getAllOrderProductsByOrderId(orderId: number): Promise<OrderProduct[]> {
    try {
      return OrderProduct.query()
        .where('orders_id', orderId)
        .preload('product', (queryProduct): void => {
          queryProduct.preload('imageFile', (queryImageFile): void => {
            queryImageFile.preload('bucket')
          })
        })
        .preload('order')
        .preload('gameServer')
    } catch (error) {
      throw new NotFoundException('Product orders not found for the specified order')
    }
  }

  public static getAllOrderProductsByProductId(productId: number): Promise<OrderProduct[]> {
    try {
      return OrderProduct.query()
        .where('products_id', productId)
        .preload('product', (queryProduct): void => {
          queryProduct.preload('imageFile', (queryImageFile): void => {
            queryImageFile.preload('bucket')
          })
        })
        .preload('order')
        .preload('gameServer')
    } catch (error) {
      throw new NotFoundException('Product orders not found for the specified product')
    }
  }
}

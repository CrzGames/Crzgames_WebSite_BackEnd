import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const OrderProductController = () => import('#controllers/order_product_controller')

router
  .group((): void => {
    router.post('/order-products', [OrderProductController, 'createOrderProduct'])
    router.put('/order-products/:id', [OrderProductController, 'updateOrderProduct'])
    router.delete('/order-products/:id', [OrderProductController, 'deleteOrderProduct'])
    router.get('/order-products/order/:orders_id', [OrderProductController, 'getAllOrderProductsByOrderId'])
  })
  .use(middleware.auth())

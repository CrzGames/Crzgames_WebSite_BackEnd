import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const OrderController = () => import('#controllers/order_controller')

router
  .group((): void => {
    router.post('/orders', [OrderController, 'createOrder'])
    router.put('/orders/:id', [OrderController, 'updateOrder'])
    router.delete('/orders/:id', [OrderController, 'deleteOrder'])
    router.get('/orders/user/:users_id', [OrderController, 'getAllOrdersByUserId'])
    router.get('/orders/:id', [OrderController, 'getOrderById'])
  })
  .use([middleware.auth()])

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router
  .group((): void => {
    router.post('/orders', [controllers.Order, 'createOrder'])
    router.put('/orders/:id', [controllers.Order, 'updateOrder'])
    router.delete('/orders/:id', [controllers.Order, 'deleteOrder'])
    router.get('/orders/user/:users_id', [controllers.Order, 'getAllOrdersByUserId'])
    router.get('/orders/:id', [controllers.Order, 'getOrderById'])
  })
  .use([middleware.auth()])

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router
  .group((): void => {
    router.post('/order-products', [controllers.OrderProduct, 'createOrderProduct'])
    router.put('/order-products/:id', [controllers.OrderProduct, 'updateOrderProduct'])
    router.delete('/order-products/:id', [controllers.OrderProduct, 'deleteOrderProduct'])
    router.get('/order-products/order/:orders_id', [controllers.OrderProduct, 'getAllOrderProductsByOrderId'])
  })
  .use(middleware.auth())

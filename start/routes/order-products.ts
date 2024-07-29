import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/order-products', 'OrderProductController.createOrderProduct')
  Route.put('/order-products/:id', 'OrderProductController.updateOrderProduct')
  Route.delete('/order-products/:id', 'OrderProductController.deleteOrderProduct')
  Route.get(
    '/order-products/order/:orders_id',
    'OrderProductController.getAllOrderProductsByOrderId',
  )
}).middleware('auth')

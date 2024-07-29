import Route from '@ioc:Adonis/Core/Route'

Route.group((): void => {
  Route.post('/orders', 'OrderController.createOrder')
  Route.put('/orders/:id', 'OrderController.updateOrder')
  Route.delete('/orders/:id', 'OrderController.deleteOrder')
  Route.get('/orders/user/:users_id', 'OrderController.getAllOrdersByUserId')
  Route.get('/orders/:id', 'OrderController.getOrderById')
}).middleware(['auth'])

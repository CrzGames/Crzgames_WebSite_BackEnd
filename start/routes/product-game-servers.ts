import Route from '@ioc:Adonis/Core/Route'

Route.group((): void => {
  Route.get('/product-game-servers', 'ProductGameServerController.getAllProductGameServers')
  Route.post('/product-game-servers', 'ProductGameServerController.createProductGameServer')
}).middleware('auth')

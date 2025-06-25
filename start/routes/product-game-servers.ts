import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const ProductGameServerController = () => import('#controllers/product_game_server_controller')

router
  .group((): void => {
    router.get('/product-game-servers', [ProductGameServerController, 'getAllProductGameServers'])
    router.post('/product-game-servers', [ProductGameServerController, 'createProductGameServer'])
  })
  .use(middleware.auth())

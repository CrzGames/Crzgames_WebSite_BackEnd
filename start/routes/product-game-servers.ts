import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router
  .group((): void => {
    router.get('/product-game-servers', [controllers.ProductGameServer, 'getAllProductGameServers'])
    router.post('/product-game-servers', [controllers.ProductGameServer, 'createProductGameServer'])
  })
  .use(middleware.auth())

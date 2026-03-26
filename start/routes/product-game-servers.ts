import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { UserRoles } from '#enums/user_roles'

router
  .group((): void => {
    router
      .get('/product-game-servers', [controllers.ProductGameServer, 'getAllProductGameServers'])
      .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
    router
      .post('/product-game-servers', [controllers.ProductGameServer, 'createProductGameServer'])
      .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
  })
  .use(middleware.auth())

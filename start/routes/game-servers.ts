import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { UserRoles } from '#enums/user_roles'

router
  .group((): void => {
    router
      .get('/game-servers', [controllers.GameServer, 'getAllGameServers'])
      .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
    router
      .post('/game-servers', [controllers.GameServer, 'createGameServer'])
      .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
  })
  .use(middleware.auth())

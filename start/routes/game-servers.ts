import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router
  .group((): void => {
    router.get('/game-servers', [controllers.GameServer, 'getAllGameServers'])
    router.post('/game-servers', [controllers.GameServer, 'createGameServer'])
  })
  .use(middleware.auth())

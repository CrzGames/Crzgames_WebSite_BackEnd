import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const GameServerController = () => import('#controllers/game_server_controller')

router
  .group((): void => {
    router.get('/game-servers', [GameServerController, 'getAllGameServers'])
    router.post('/game-servers', [GameServerController, 'createGameServer'])
  })
  .use(middleware.auth())

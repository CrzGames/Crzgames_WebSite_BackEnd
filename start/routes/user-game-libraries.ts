import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router
  .group((): void => {
    router.get('/user-game-libraries/:userId', [controllers.UserGameLibraries, 'getAllUsersGamesLibrariesByUserId'])
    router.post('/user-game-libraries', [controllers.UserGameLibraries, 'addGameToUserGameLibraries'])
  })
  .use([middleware.auth()])

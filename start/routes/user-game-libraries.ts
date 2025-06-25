import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const UserGameLibrariesController = () => import('#controllers/user_game_libraries_controller')

router
  .group((): void => {
    router.get('/user-game-libraries/:userId', [UserGameLibrariesController, 'getAllUsersGamesLibrariesByUserId'])
    router.post('/user-game-libraries', [UserGameLibrariesController, 'addGameToUserGameLibraries'])
  })
  .use([middleware.auth()])

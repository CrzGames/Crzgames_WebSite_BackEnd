import router from '@adonisjs/core/services/router'
const GamePlatformsController = () => import('#controllers/game_platforms_controller')

router.group((): void => {
  router.get('/game-platforms', [GamePlatformsController, 'getAllGamePlatforms'])
})

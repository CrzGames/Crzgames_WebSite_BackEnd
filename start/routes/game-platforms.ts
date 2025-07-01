import router from '@adonisjs/core/services/router'
const GamePlatformsController = () => import('#controllers/game_platforms_controller')

router.get('/game-platforms', [GamePlatformsController, 'getAllGamePlatforms'])

import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/game/:gameId/categories', [controllers.GameCategoryAssignments, 'getAllGameCategoryAssignmentByGameId'])
router.get('/game/categories/:categoryId', [
  controllers.GameCategoryAssignments,
  'getAllGameCategoryAssignmentByCategoryId',
])

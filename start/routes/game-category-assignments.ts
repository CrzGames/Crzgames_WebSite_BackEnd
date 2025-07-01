import router from '@adonisjs/core/services/router'
const GameCategoryAssignmentsController = () => import('#controllers/game_category_assignments_controller')

router.get('/game/:gameId/categories', [GameCategoryAssignmentsController, 'getAllGameCategoryAssignmentByGameId'])
router.get('/game/categories/:categoryId', [
  GameCategoryAssignmentsController,
  'getAllGameCategoryAssignmentByCategoryId',
])

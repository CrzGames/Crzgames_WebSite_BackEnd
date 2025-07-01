import router from '@adonisjs/core/services/router'
const GameCategoriesController = () => import('#controllers/game_categories_controller')

router.get('/game-categories', [GameCategoriesController, 'getAllGameCategories'])

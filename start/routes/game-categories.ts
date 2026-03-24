import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/game-categories', [controllers.GameCategories, 'getAllGameCategories'])

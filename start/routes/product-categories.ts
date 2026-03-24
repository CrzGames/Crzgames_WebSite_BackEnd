import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/product-categories', [controllers.ProductCategory, 'getAllProductCategories']).use(middleware.auth())

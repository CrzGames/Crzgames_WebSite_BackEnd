import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const ProductCategoryController = () => import('#controllers/product_category_controller')

router.get('/product-categories', [ProductCategoryController, 'getAllProductCategories']).use(middleware.auth())

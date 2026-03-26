import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { UserRoles } from '#enums/user_roles'

router
  .get('/product-categories', [controllers.ProductCategory, 'getAllProductCategories'])
  .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))

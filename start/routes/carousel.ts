import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import { UserRoles } from '#enums/user_roles'

router.get('/carousels', [controllers.Carousel, 'getAllCarousels'])
router.get('/carousel/:id', [controllers.Carousel, 'getCarouselById'])
router
  .post('/carousel', [controllers.Carousel, 'createCarousel'])
  .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
router
  .put('/carousel/:id', [controllers.Carousel, 'updateCarousel'])
  .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
router
  .delete('/carousel/:id', [controllers.Carousel, 'delete'])
  .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))

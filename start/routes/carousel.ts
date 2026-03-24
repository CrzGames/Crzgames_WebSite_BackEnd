import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/carousels', [controllers.Carousel, 'getAllCarousels'])
router.get('/carousel/:id', [controllers.Carousel, 'getCarouselById'])
router.post('/carousel', [controllers.Carousel, 'createCarousel'])
router.put('/carousel/:id', [controllers.Carousel, 'updateCarousel'])
router.delete('/carousel/:id', [controllers.Carousel, 'delete'])

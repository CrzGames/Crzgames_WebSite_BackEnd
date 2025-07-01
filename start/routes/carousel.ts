import router from '@adonisjs/core/services/router'
const CarouselController = () => import('#controllers/carousel_controller')

router.get('/carousels', [CarouselController, 'getAllCarousels'])
router.get('/carousel/:id', [CarouselController, 'getCarouselById'])
router.post('/carousel', [CarouselController, 'createCarousel'])
router.put('/carousel/:id', [CarouselController, 'updateCarousel'])
router.delete('/carousel/:id', [CarouselController, 'delete'])

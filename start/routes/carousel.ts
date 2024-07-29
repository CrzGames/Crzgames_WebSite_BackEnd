import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/carousels', 'CarouselController.getAllCarousels')
  Route.get('/carousel/:id', 'CarouselController.getCarouselById')
  Route.post('/carousel', 'CarouselController.createCarousel')
  Route.put('/carousel/:id', 'CarouselController.updateCarousel')
  Route.delete('/carousel/:id', 'CarouselController.delete')
})

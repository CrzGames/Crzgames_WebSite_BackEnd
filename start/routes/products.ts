import Route from '@ioc:Adonis/Core/Route'

Route.group((): void => {
  Route.post('/products', 'ProductController.createProduct')
  Route.get('/products/:id', 'ProductController.getProductById')
  Route.get('/products', 'ProductController.getAllProducts')
  Route.get('/products/name/:name', 'ProductController.getProductByName')
  Route.put('/products/:id', 'ProductController.updateProduct')
  Route.delete('/products/:id', 'ProductController.deleteProduct')
  Route.get(
    '/products/games/:gameId/paid-and-owned',
    'ProductController.getGameProductPaidAndOwned',
  )
  Route.get('/products/games/paid-and-owned', 'ProductController.getAllGamesProductsPaidAndOwned')
}).middleware(['auth'])

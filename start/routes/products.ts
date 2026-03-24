import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router
  .group((): void => {
    router.post('/products', [controllers.Product, 'createProduct'])
    router.get('/products/:id', [controllers.Product, 'getProductById'])
    router.get('/products', [controllers.Product, 'getAllProducts'])
    router.get('/products/name/:name', [controllers.Product, 'getProductByName'])
    router.put('/products/:id', [controllers.Product, 'updateProduct'])
    router.delete('/products/:id', [controllers.Product, 'deleteProduct'])
    router.get('/products/games/:gameId/paid-and-owned', [controllers.Product, 'getGameProductPaidAndOwned'])
    router.get('/products/games/paid-and-owned', [controllers.Product, 'getAllGamesProductsPaidAndOwned'])
  })
  .use([middleware.auth()])

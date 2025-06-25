import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const ProductController = () => import('#controllers/product_controller')

router
  .group((): void => {
    router.post('/products', [ProductController, 'createProduct'])
    router.get('/products/:id', [ProductController, 'getProductById'])
    router.get('/products', [ProductController, 'getAllProducts'])
    router.get('/products/name/:name', [ProductController, 'getProductByName'])
    router.put('/products/:id', [ProductController, 'updateProduct'])
    router.delete('/products/:id', [ProductController, 'deleteProduct'])
    router.get('/products/games/:gameId/paid-and-owned', [ProductController, 'getGameProductPaidAndOwned'])
    router.get('/products/games/paid-and-owned', [ProductController, 'getAllGamesProductsPaidAndOwned'])
  })
  .use([middleware.auth()])

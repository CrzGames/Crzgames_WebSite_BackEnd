import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router
  .group((): void => {
    router.post('/product-discounts', [controllers.ProductDiscount, 'createProductDiscount'])
    router.get('/product-discounts/:id', [controllers.ProductDiscount, 'getProductDiscountById'])
    router.get('/product-discounts/product/:productId', [
      controllers.ProductDiscount,
      'getAllProductDiscountsByProductId',
    ])
    router.put('/product-discounts/:id', [controllers.ProductDiscount, 'updateProductDiscount'])
    router.delete('/product-discounts/:id', [controllers.ProductDiscount, 'deleteProductDiscount'])
  })
  .use(middleware.auth())

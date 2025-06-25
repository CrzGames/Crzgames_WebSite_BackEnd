import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const ProductDiscountController = () => import('#controllers/product_discount_controller')

router
  .group(() => {
    router.post('/product-discounts', [ProductDiscountController, 'createProductDiscount'])
    router.get('/product-discounts/:id', [ProductDiscountController, 'getProductDiscountById'])
    router.get('/product-discounts/product/:productId', [
      ProductDiscountController,
      'getAllProductDiscountsByProductId',
    ])
    router.put('/product-discounts/:id', [ProductDiscountController, 'updateProductDiscount'])
    router.delete('/product-discounts/:id', [ProductDiscountController, 'deleteProductDiscount'])
  })
  .use(middleware.auth())

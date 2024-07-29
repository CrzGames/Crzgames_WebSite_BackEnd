import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/product-discounts', 'ProductDiscountController.createProductDiscount')
  Route.get('/product-discounts/:id', 'ProductDiscountController.getProductDiscountById')
  Route.get(
    '/product-discounts/product/:productId',
    'ProductDiscountController.getAllProductDiscountsByProductId',
  )
  Route.put('/product-discounts/:id', 'ProductDiscountController.updateProductDiscount')
  Route.delete('/product-discounts/:id', 'ProductDiscountController.deleteProductDiscount')
}).middleware('auth')

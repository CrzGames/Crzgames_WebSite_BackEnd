import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/product-categories', 'ProductCategoryController.getAllProductCategories')
}).middleware('auth')

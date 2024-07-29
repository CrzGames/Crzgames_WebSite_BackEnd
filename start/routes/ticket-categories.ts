import Route from '@ioc:Adonis/Core/Route'

Route.group((): void => {
  Route.get('/ticket-categories', 'TicketCategoriesController.getAllTicketCategories')
}).middleware(['auth'])

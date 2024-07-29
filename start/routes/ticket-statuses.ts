import Route from '@ioc:Adonis/Core/Route'

Route.group((): void => {
  Route.get('/ticket-statuses', 'TicketStatusesController.getAllTicketStatuses')
}).middleware(['auth'])

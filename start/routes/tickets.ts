import Route from '@ioc:Adonis/Core/Route'

Route.group((): void => {
  Route.post('/ticket', 'TicketsController.createTickets')
  Route.get('/ticket/:id', 'TicketsController.getTicketsById')
  Route.get('/tickets', 'TicketsController.getAllTickets')
  Route.get('/tickets/:userId', 'TicketsController.getAllTicketsByUserId')
  Route.put('/tickets/:id', 'TicketsController.updateTicketByIdForStatus')
  Route.get('/tickets-open-count/:userId', 'TicketsController.getTicketsCountByStatusOpenForUser')
})

import Route from '@ioc:Adonis/Core/Route'

Route.group((): void => {
  Route.post('/ticket-response', 'TicketResponsesController.createTicketResponses')
  Route.get(
    '/ticket-response/:ticketId',
    'TicketResponsesController.getAllTicketsResponsesByTicketId',
  )
}).middleware(['auth'])

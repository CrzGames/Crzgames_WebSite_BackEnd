import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/seatyrants/info-user', 'SeatyrantsController.getInfoUser')
}).middleware('restrict-cors-to-seatyrants')

import Route from '@ioc:Adonis/Core/Route'

Route.group((): void => {
  Route.post('/publish', 'NatsController.publish')
  Route.post('/subscribe', 'NatsController.subscription')
})

import Route from '@ioc:Adonis/Core/Route'

Route.post(
  '/stripe/create-payment-intent',
  'StripeController.createPaymentIntentStripe',
).middleware('auth')
Route.post('/proxy-check-io', 'StripeController.checkProxyVPN')
Route.post('/stripe/webhooks', 'StripeController.handleWebhookStripe')

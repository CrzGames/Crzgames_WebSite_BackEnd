import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.post('/stripe/create-payment-intent', [controllers.Stripe, 'createPaymentIntentStripe']).use(middleware.auth())
router.post('/proxy-check-io', [controllers.Stripe, 'checkProxyVPN'])
router.post('/stripe/webhooks', [controllers.Stripe, 'handleWebhookStripe'])

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const StripeController = () => import('#controllers/stripe_controller')

router.post('/stripe/create-payment-intent', [StripeController, 'createPaymentIntentStripe']).use(middleware.auth())
router.post('/proxy-check-io', [StripeController, 'checkProxyVPN'])
router.post('/stripe/webhooks', [StripeController, 'handleWebhookStripe'])

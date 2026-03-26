import type { HttpContext } from '@adonisjs/core/http'
import { StripeService, stripe } from '#services/stripe_service'
import type { PaymentIntentCommand } from '#services/stripe_service'
import { ProxyCheckIOService } from '#services/proxy_check_io_service'
import type { ResponseProxyCheckIO } from '#services/proxy_check_io_service'
import type Stripe from 'stripe'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import { checkProxyVpnValidator } from '#validators/Stripe/check_proxy_vpn_validator'

/**
 *
 */
export default class StripeController {
  /**
   *
   */
  public async createPaymentIntentStripe({ request, response, auth }: HttpContext): Promise<void> {
    // @ts-ignore
    const payload: PaymentIntentCommand[] = request.all()
    const user: any = await auth.authenticate()
    const clientSecret: string | null = await StripeService.createPaymentIntent(payload, user.id)
    response.status(201).json({ clientSecret })
  }

  /**
   *
   */
  public async checkProxyVPN({ response, request }: HttpContext): Promise<void> {
    const payload: { ip: string } = await request.validateUsing(checkProxyVpnValidator)
    const responseProxyCheckIO: ResponseProxyCheckIO = await ProxyCheckIOService.checkProxyVPN(payload.ip)
    response.status(200).json(responseProxyCheckIO)
  }

  /**
   *
   */
  public async handleWebhookStripe({ request, response }: HttpContext): Promise<void> {
    const stripeSignature: string | string[] | undefined = request.headers()['stripe-signature']
    const rawBody: string | null = request.raw()
    let event: Stripe.Event

    if (stripeSignature === undefined) {
      return response.status(400).send('Webhook Error: Signature not provided')
    }
    if (rawBody === null) {
      return response.status(400).send('Webhook Error: Raw body not provided')
    }

    try {
      event = stripe.webhooks.constructEvent(rawBody, stripeSignature, env.get('STRIPE_WEBHOOK_SECRET'))
    } catch (err) {
      logger.error('Webhook signature verification failed.', err.message)
      return response.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Vérifiez si l'événement a déjà été traité
    /*const existingEvent: StripeWebhookEvent | null = await StripeWebhookEvent.query().where('stripe_event_id', event.id).first()
    if (existingEvent) {
      Logger.info(`Event stripe ${event.id} already processed.`)
      return response.status(200).send({ received: true })
    }

    // Enregistrez l'événement comme traité
    await StripeWebhookEvent.create({ stripe_event_id: event.id })*/

    switch (event.type) {
      case 'payment_intent.succeeded':
        const succeededPaymentIntent: Stripe.PaymentIntent = event.data.object as Stripe.PaymentIntent
        await StripeService.handleAfterPaymentIntent(succeededPaymentIntent, 'Paid')
        break

      case 'payment_intent.payment_failed':
        const failedPaymentIntent: Stripe.PaymentIntent = event.data.object as Stripe.PaymentIntent
        await StripeService.handleAfterPaymentIntent(failedPaymentIntent, 'Failed')
        break

      case 'payment_intent.canceled':
        const canceledPaymentIntent: Stripe.PaymentIntent = event.data.object as Stripe.PaymentIntent
        await StripeService.handleAfterPaymentIntent(canceledPaymentIntent, 'Canceled')
        break

      default:
        logger.info(`Unhandled event type ${event.type}`)
    }

    response.send({ received: true })
  }
}

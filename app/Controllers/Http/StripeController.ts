import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StripeService, PaymentIntentCommand, stripe } from 'App/Services/StripeService'
import { ProxyCheckIOService } from 'App/Services/ProxyCheckIOService'
import type { ResponseProxyCheckIO } from 'App/Services/ProxyCheckIOService'
import CheckProxyVPNValidator from 'App/Validators/Stripe/CheckProxyVPNValidator'
import Stripe from 'stripe'
import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'
import StripeWebhookEvent from 'App/Models/StripeWebhookEvent'

export default class StripeController {
  private async createPaymentIntentStripe({
    request,
    response,
    auth,
  }: HttpContextContract): Promise<void> {
    // @ts-ignore
    const payload: PaymentIntentCommand[] = request.all()
    const user: any = await auth.authenticate()
    const clientSecret: string | null = await StripeService.createPaymentIntent(payload, user.id)
    response.status(201).json({ clientSecret })
  }

  private async checkProxyVPN({ response, request }: HttpContextContract): Promise<void> {
    const payload: { ip: string } = await request.validate(CheckProxyVPNValidator)
    const responseProxyCheckIO: ResponseProxyCheckIO = await ProxyCheckIOService.checkProxyVPN(
      payload.ip,
    )
    response.status(200).json(responseProxyCheckIO)
  }

  private async handleWebhookStripe({ request, response }: HttpContextContract): Promise<void> {
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
      event = stripe.webhooks.constructEvent(
        rawBody,
        stripeSignature,
        Env.get('STRIPE_WEBHOOK_SECRET'),
      )
    } catch (err) {
      Logger.error('Webhook signature verification failed.', err.message)
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
        const succeededPaymentIntent: Stripe.PaymentIntent = event.data
          .object as Stripe.PaymentIntent
        await StripeService.handleAfterPaymentIntent(succeededPaymentIntent, 'Paid')
        break

      case 'payment_intent.payment_failed':
        const failedPaymentIntent: Stripe.PaymentIntent = event.data.object as Stripe.PaymentIntent
        await StripeService.handleAfterPaymentIntent(failedPaymentIntent, 'Failed')
        break

      case 'payment_intent.canceled':
        const canceledPaymentIntent: Stripe.PaymentIntent = event.data
          .object as Stripe.PaymentIntent
        await StripeService.handleAfterPaymentIntent(canceledPaymentIntent, 'Canceled')
        break

      default:
        Logger.info(`Unhandled event type ${event.type}`)
    }

    response.send({ received: true })
  }
}

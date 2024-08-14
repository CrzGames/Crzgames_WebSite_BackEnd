import Stripe from 'stripe'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'
import Logger from '@ioc:Adonis/Core/Logger'
import { v4 as uuidv4 } from 'uuid'
import Product from 'App/Models/Product'
import ProductDiscount from 'App/Models/ProductDiscount'
import { ProductService } from 'App/Services/ProductService'
import Game from 'App/Models/Game'
import OrderMetadataStripe from 'App/Models/OrderMetadataStripe'
import Order from 'App/Models/Order'
import OrderProduct from 'App/Models/OrderProduct'
import UserGameLibrary from 'App/Models/UserGameLibrary'
import GamesService from 'App/Services/GamesService'
import axios, { AxiosError, AxiosResponse } from 'axios'
import * as util from 'util'

export type PaymentIntentCommand = {
  products_id: number
  quantity: number
  game_servers_id?: number | undefined | null
}

export type ProcessedCartItem = {
  products_id: number
  quantity: number
  game_servers_id?: number | undefined | null
  price: number // Le prix du produit x la quantité
}

export const stripe: Stripe = new Stripe(Env.get('STRIPE_SECRET_KEY'), {
  apiVersion: Env.get('STRIPE_API_VERSION'),
  telemetry: false,
})

export class StripeService {
  public static async createPaymentIntent(
    cartItems: PaymentIntentCommand[],
    userId: number,
  ): Promise<string | null> {
    let user: User = await User.findOrFail(userId)

    /**
     *  Pour éviter que le même PaymentIntent ne soit créé accidentellement plusieurs fois
     *  (par exemple, en cas de plusieurs clics sur le bouton de paiement par l'utilisateur),
     *  vous pouvez utiliser une clé idempotente. Stripe permet de spécifier une clé idempotente
     *  dans vos requêtes pour garantir que même si la même requête est envoyée plusieurs fois,
     *  elle ne sera traitée qu'une seule fois.
     */
    const idempotencyKey: string = uuidv4()

    try {
      // Si c'est la première fois qu'il paye un produit, ajoutée un stripe customer id au compte user
      if (user.stripe_customer_id === null || user.stripe_customer_id === undefined) {
        user = await this.createStripeCustomer(user.id)

        // On vérifie si l'utilisateur a un stripe_customer_id a nouveau
        if (user.stripe_customer_id === null || user.stripe_customer_id === undefined) {
          return null
        }
      }

      // Calculer le montant total en euros
      const { totalAmount, orderMetadataStripeId } = await this.calculateTotalAmount(
        cartItems,
        user,
      )

      /**
       * Création d'un PaymentIntent. Cela représente une intention de paiement,
       * et nous donne un moyen de suivre et de gérer le processus de paiement.
       */
      const paymentIntent: Stripe.Response<Stripe.PaymentIntent> =
        await stripe.paymentIntents.create(
          {
            /**
             *  Les montants sont traités dans la plus petite unité monétaire pour chaque devise.
             *  Pour l'euro (EUR), cela signifie que les montants sont exprimés en centimes.
             *  C'est pourquoi lorsque vous spécifiez un montant de 50, cela représente en fait 50 centimes
             */
            amount: Math.round(totalAmount * 100), // Les montants sont exprimés en centimes
            currency: 'eur', // Pour éviter des frais de conversion, on met la devise en euro
            use_stripe_sdk: true,
            customer: user.stripe_customer_id,
            automatic_payment_methods: {
              enabled: true,
            },
            setup_future_usage: 'off_session',
            metadata: {
              // On peut ajouter des métadonnées personnalisées pour suivre les paiements lors des webhooks
              user_id: user.id.toString(),
              order_metadata_stripe_id: orderMetadataStripeId.toString(),
            },
          },
          { idempotencyKey },
        )

      Logger.info('CreatePaymentIntent created successfully return client_secret')

      /**
       * On retourne le client_secret du PaymentIntent.
       * C'est une clé secrète qui permet à l'application cliente
       * de confirmer le paiement intent auprès de Stripe.
       */
      return paymentIntent.client_secret
    } catch (error) {
      Logger.error('CreatePaymentIntent An error occurred while trying to create a payment intent.')
      throw new Error(error)
    }
  }

  private static async calculateTotalAmount(
    cartItems: PaymentIntentCommand[],
    user: User,
  ): Promise<{ totalAmount: number; orderMetadataStripeId: number }> {
    try {
      let totalAmount: number = 0
      const processedItems: ProcessedCartItem[] = []

      const cartItemsArray: PaymentIntentCommand[] = Object.values(cartItems)

      for (const item of cartItemsArray) {
        const product: Product = await ProductService.getProductById(item.products_id)
        let productPrice: number = product.price * item.quantity

        if (product.productDiscounts) {
          const discount: ProductDiscount | undefined = product.productDiscounts.find(
            (productDiscount: ProductDiscount): boolean =>
              productDiscount.currency.toLowerCase() === user.currency_code?.toLowerCase(),
          )
          if (discount) {
            productPrice *= 1 - discount.discount_percent / 100
          }
        }

        totalAmount += productPrice

        processedItems.push({
          products_id: item.products_id,
          quantity: item.quantity,
          game_servers_id: item.game_servers_id,
          price: productPrice,
        })
      }

      const orderMetadataStripe: OrderMetadataStripe = await OrderMetadataStripe.create({
        users_id: user.id,
        processed_items: JSON.stringify(processedItems),
      })

      return { totalAmount, orderMetadataStripeId: orderMetadataStripe.id }
    } catch (error) {
      throw new Error(`CalculateTotalAmount : ${error}`)
    }
  }

  private static async createStripeCustomer(userId: number): Promise<User> {
    const user: User = await User.findOrFail(userId)

    // Paramètres pour créer un client chez Stripe
    const params: Stripe.CustomerCreateParams = {
      metadata: {
        user_id: user.id,
        email: user.email,
      },
    }

    try {
      // Création d'un nouveau client chez Stripe. Cela nous permet d'enregistrer
      // et de gérer des informations sur nos clients, comme leur adresse e-mail
      // ou leurs méthodes de paiement enregistrées.
      const customer: Stripe.Response<Stripe.Customer> = await stripe.customers.create(params)

      // On met à jour le stripe_customer_id de l'utilisateur dans la table 'users'
      await user.merge({ stripe_customer_id: customer.id }).save()

      Logger.info('CreateStripeCustomer Stripe customer created successfully')

      return user // Retourne l'utilisateur mis à jour
    } catch (error) {
      Logger.error(
        'CreateStripeCustomer An error occurred while trying to create a Stripe customer.',
      )
      throw new Error(error)
    }
  }

  public static async handleAfterPaymentIntent(
    paymentIntent: Stripe.PaymentIntent,
    orderStatus: 'Paid' | 'Failed' | 'Canceled',
  ): Promise<void> {
    const userId: number = parseInt(paymentIntent.metadata.user_id)
    const orderMetadataStripeId: number = parseInt(paymentIntent.metadata.order_metadata_stripe_id)

    const orderMetadataStripe: OrderMetadataStripe =
      await OrderMetadataStripe.findOrFail(orderMetadataStripeId)
    const processedItems: ProcessedCartItem[] = JSON.parse(orderMetadataStripe.processed_items)

    try {
      // Vérifiez si une commande avec le même paymentIntent.id existe déjà
      /*const existingOrder: Order | null = await Order.query()
        .where('payment_intent_id', paymentIntent.id)
        .first()

      if (existingOrder) {
        Logger.info(`Order with payment intent ID ${paymentIntent.id} already exists.`)
        return
      }*/

      // Créer la commande
      const order: Order = await Order.create({
        users_id: userId,
        currency: paymentIntent.currency,
        total_price: paymentIntent.amount / 100, // convertir en unité monétaire
        status_order: orderStatus,
        payment_intent_id: paymentIntent.id,
      })

      // Ajouter les produits de la commande
      for (const item of processedItems) {
        await OrderProduct.create({
          orders_id: order.id,
          products_id: item.products_id,
          game_servers_id: item.game_servers_id,
          quantity: item.quantity,
          price: item.price,
        })
      }

      if (orderStatus !== 'Paid') {
        return
      }

      // Check par rapport au products_id si c'est un product_category = 'game'
      // Ajouté a la table 'user_game_librairies' par rapport au game.id pour le users_id en question
      for (const item of processedItems) {
        const product: Product = await ProductService.getProductById(item.products_id)
        if (product.productCategory.name === 'game') {
          await UserGameLibrary.create({
            users_id: userId,
            games_id: product.game.id,
          })
        }
      }

      // Check par rapport au products_id si c'est un product_category = 'ingame'
      // se connecté a la base de donnée du jeu et ajouté l'item au joueur en question
      for (const item of processedItems) {
        const product: Product = await ProductService.getProductById(item.products_id)
        if (product.productCategory.name === 'ingame') {
          await this.addInGameItemToPlayer(userId, product.game.title, product.name, item.quantity)
        }
      }
    } catch (error) {
      Logger.error(
        'HandleAfterPaymentIntent An error occurred while trying to handle the payment intent.',
      )
      throw new Error(error)
    }
  }

  private static async addInGameItemToPlayer(
    userId: number,
    gameTitle: string,
    productName: string,
    productQuantity: number,
  ): Promise<void> {
    // Faire une requette HTTP a l'API du jeu pour ajouté l'item au joueur en question
    // World of Warcraft quand on'ai sur le server development
    if (gameTitle === 'SeaTyrants' || gameTitle === 'World of Warcraft') {
      let urlApi: string
      if (Env.get('NODE_ENV') === 'production') {
        urlApi = 'https://api.seatyrants.com/crzgames/add-in-game-item'
      } else if (Env.get('NODE_ENV') === 'staging') {
        urlApi = 'https://staging.api.seatyrants.com/crzgames/add-in-game-item'
      } else {
        urlApi = 'http://host.docker.internal:3400/crzgames/add-in-game-item'
      }

      let emeraldQuantity: number = 0
      if (productName === '500 Emerald') {
        emeraldQuantity = 500
      } else if (productName === '1000 Emerald') {
        emeraldQuantity = 1000
      } else if (productName === '2600 Emerald') {
        emeraldQuantity = 2600
      } else if (productName === '5500 Emerald') {
        emeraldQuantity = 5500
      }

      emeraldQuantity = emeraldQuantity * productQuantity

      try {
        const response: AxiosResponse<any, any> = await axios.post(
          urlApi,
          {
            crzgamesUserId: userId,
            emeraldQuantity: emeraldQuantity,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY': Env.get('SEATYRANTSxCRZGAMES_API_KEY_SECRET'),
            },
          },
        )

        if (response.status === 201) {
          Logger.info(`Successfully added ${productName} to user ${userId} in game ${gameTitle}`)
        } else {
          Logger.error(
            `Failed to add ${productName} to user ${userId} in game ${gameTitle}: ${response.data.message}`,
          )
        }
      } catch (error) {
        Logger.error(
          `Failed to add ${productName} to user ${userId} in game ${gameTitle}: ${error}`,
        )
        throw new Error(error)
      }
    }
  }
}

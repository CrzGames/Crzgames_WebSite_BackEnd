import Stripe from 'stripe'
import env from '#start/env'
import User from '#models/user'
import logger from '@adonisjs/core/services/logger'
import { v4 as uuidv4 } from 'uuid'
import type Product from '#models/product'
import type ProductDiscount from '#models/product_discount'
import { ProductService } from '#services/product_service'
import OrderMetadataStripe from '#models/order_metadata_stripe'
import Order from '#models/order'
import OrderProduct from '#models/order_product'
import UserGameLibrary from '#models/user_game_library'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { errors as lucidErrors } from '@adonisjs/lucid'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'

/**
 * Type pour les commandes de création de PaymentIntent.
 * @typedef {object} PaymentIntentCommand
 * @property {number} products_id - L'ID du produit associé.
 * @property {number} quantity - La quantité de produit commandée.
 * @property {number | undefined | null} [game_servers_id] - L'ID du serveur de jeu associé (optionnel).
 */
export type PaymentIntentCommand = {
  products_id: number
  quantity: number
  game_servers_id?: number | undefined | null
}

/**
 * Type pour les éléments de panier traités.
 * @typedef {object} ProcessedCartItem
 * @property {number} products_id - L'ID du produit associé.
 * @property {number} quantity - La quantité de produit commandée.
 * @property {number | undefined | null} [game_servers_id] - L'ID du serveur de jeu associé (optionnel).
 * @property {number} price - Le prix du produit multiplié par la quantité.
 */
export type ProcessedCartItem = {
  products_id: number
  quantity: number
  game_servers_id?: number | undefined | null
  price: number // Le prix du produit x la quantité
}

/**
 * Type pour les métadonnées de commande Stripe.
 * @typedef {object} OrderMetadataStripe
 * @property {number} users_id - L'ID de l'utilisateur associé à la commande.
 * @property {string} processed_items - Les éléments traités du panier en format JSON.
 */
export const stripe: Stripe = new Stripe(env.get('STRIPE_SECRET_KEY'), {
  apiVersion: env.get('STRIPE_API_VERSION'),
  telemetry: false,
})

/**
 * Service pour gérer les interactions avec Stripe, notamment la création de PaymentIntent,
 * la gestion des clients Stripe et le traitement des paiements.
 * @class StripeService
 */
export class StripeService {
  /**
   * Crée un PaymentIntent pour traiter le paiement d'un panier d'achats.
   * @param {PaymentIntentCommand[]} cartItems - Les articles du panier à payer.
   * @param {number} userId - L'ID de l'utilisateur effectuant le paiement.
   * @returns {Promise<string | null>} - Le client_secret du PaymentIntent ou null en cas d'erreur.
   */
  public static async createPaymentIntent(cartItems: PaymentIntentCommand[], userId: number): Promise<string | null> {
    try {
      let user: User = await User.findOrFail(userId)

      /**
       *  Pour éviter que le même PaymentIntent ne soit créé accidentellement plusieurs fois
       *  (par exemple, en cas de plusieurs clics sur le bouton de paiement par l'utilisateur),
       *  vous pouvez utiliser une clé idempotente. Stripe permet de spécifier une clé idempotente
       *  dans vos requêtes pour garantir que même si la même requête est envoyée plusieurs fois,
       *  elle ne sera traitée qu'une seule fois.
       */
      const idempotencyKey: string = uuidv4()

      // Si c'est la première fois qu'il paye un produit, ajoutée un stripe customer id au compte user
      if (user.stripeCustomerId === null) {
        user = await this.createStripeCustomer(user.id)

        // On vérifie si l'utilisateur a un stripe_customer_id a nouveau
        if (user.stripeCustomerId === null) {
          return null
        }
      }

      // Calculer le montant total en euros
      const { totalAmount, orderMetadataStripeId } = await this.calculateTotalAmount(cartItems, user)

      /**
       * Création d'un PaymentIntent. Cela représente une intention de paiement,
       * et nous donne un moyen de suivre et de gérer le processus de paiement.
       */
      const paymentIntent: Stripe.Response<Stripe.PaymentIntent> = await stripe.paymentIntents.create(
        {
          /**
           *  Les montants sont traités dans la plus petite unité monétaire pour chaque devise.
           *  Pour l'euro (EUR), cela signifie que les montants sont exprimés en centimes.
           *  C'est pourquoi lorsque vous spécifiez un montant de 50, cela représente en fait 50 centimes
           */
          amount: Math.round(totalAmount * 100), // Les montants sont exprimés en centimes
          currency: 'eur', // Pour éviter des frais de conversion, on met la devise en euro
          use_stripe_sdk: true,
          customer: user.stripeCustomerId,
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

      logger.info('CreatePaymentIntent created successfully return client_secret')

      /**
       * On retourne le client_secret du PaymentIntent.
       * C'est une clé secrète qui permet à l'application cliente
       * de confirmer le paiement intent auprès de Stripe.
       */
      return paymentIntent.client_secret
    } catch (error: any) {
      logger.error('CreatePaymentIntent An error occurred while trying to create a payment intent.')

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new Error(`User with ID ${userId} not found`)
      }

      throw new InternalServerErrorException(`Failed to create payment intent: ${error.message}`)
    }
  }

  /**
   * Calcule le montant total du panier d'achats et crée les métadonnées de la commande Stripe.
   * @param {PaymentIntentCommand[]} cartItems - Les articles du panier à payer.
   * @param {User} user - L'utilisateur effectuant le paiement.
   * @returns {Promise<{ totalAmount: number; orderMetadataStripeId: number }>} - Le montant total et l'ID des métadonnées de la commande Stripe.
   */
  private static async calculateTotalAmount(
    cartItems: PaymentIntentCommand[],
    user: User,
  ): Promise<{ totalAmount: number; orderMetadataStripeId: number }> {
    try {
      // On initialise le montant total à 0 et un tableau pour les éléments traités
      let totalAmount: number = 0
      const processedItems: ProcessedCartItem[] = []

      const cartItemsArray: PaymentIntentCommand[] = Object.values(cartItems)

      for (const item of cartItemsArray) {
        const product: Product = await ProductService.getProductById(item.products_id)
        let productPrice: number = product.price * item.quantity

        const discount: ProductDiscount | undefined = product.productDiscounts.find(
          (productDiscount: ProductDiscount): boolean =>
            productDiscount.currency.toLowerCase() === user.currencyCode?.toLowerCase(),
        )
        if (discount) {
          productPrice *= 1 - discount.discountPercent / 100
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
        usersId: user.id,
        processedItems: JSON.stringify(processedItems),
      })

      return { totalAmount, orderMetadataStripeId: orderMetadataStripe.id }
    } catch (error) {
      logger.error('CalculateTotalAmount An error occurred while trying to calculate the total amount.')

      throw new InternalServerErrorException(`Failed to calculate total amount: ${error.message}`)
    }
  }

  /**
   * Crée un client Stripe pour l'utilisateur si celui-ci n'en a pas déjà un.
   * @param {number} userId - L'ID de l'utilisateur pour lequel créer le client Stripe.
   * @returns {Promise<User>} - L'utilisateur mis à jour avec le stripe_customer_id.
   */
  private static async createStripeCustomer(userId: number): Promise<User> {
    try {
      const user: User = await User.findOrFail(userId)

      // Paramètres pour créer un client chez Stripe
      const params: Stripe.CustomerCreateParams = {
        metadata: {
          user_id: user.id,
          email: user.email,
        },
      }

      // Création d'un nouveau client chez Stripe. Cela nous permet d'enregistrer
      // et de gérer des informations sur nos clients, comme leur adresse e-mail
      // ou leurs méthodes de paiement enregistrées.
      const customer: Stripe.Response<Stripe.Customer> = await stripe.customers.create(params)

      // On met à jour le stripe_customer_id de l'utilisateur dans la table 'users'
      await user.merge({ stripeCustomerId: customer.id }).save()

      logger.info('CreateStripeCustomer Stripe customer created successfully')

      return user // Retourne l'utilisateur mis à jour
    } catch (error: any) {
      logger.error('CreateStripeCustomer An error occurred while trying to create a Stripe customer.')

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new Error(`User with ID ${userId} not found`)
      }

      throw new InternalServerErrorException(`Failed to create Stripe customer: ${error.message}`)
    }
  }

  /**
   * Gère les actions à effectuer après la confirmation d'un PaymentIntent.
   * Cela inclut la création d'une commande, l'ajout de produits à la bibliothèque de jeux de l'utilisateur,
   * et l'ajout d'objets en jeu si nécessaire.
   * @param {Stripe.PaymentIntent} paymentIntent - Le PaymentIntent confirmé.
   * @param {'Paid' | 'Failed' | 'Canceled'} orderStatus - Le statut de la commande.
   * @returns {Promise<void>} - Aucune valeur de retour, mais l'opération peut échouer avec une exception.
   */
  public static async handleAfterPaymentIntent(
    paymentIntent: Stripe.PaymentIntent,
    orderStatus: 'Paid' | 'Failed' | 'Canceled',
  ): Promise<void> {
    const userId: number = parseInt(paymentIntent.metadata.user_id)
    const orderMetadataStripeId: number = parseInt(paymentIntent.metadata.order_metadata_stripe_id)

    const orderMetadataStripe: OrderMetadataStripe = await OrderMetadataStripe.findOrFail(orderMetadataStripeId)
    const processedItems: ProcessedCartItem[] = JSON.parse(orderMetadataStripe.processedItems)

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
        usersId: userId,
        currency: paymentIntent.currency,
        totalPrice: paymentIntent.amount / 100, // convertir en unité monétaire
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
            usersId: userId,
            gamesId: product.game.id,
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
      logger.error('HandleAfterPaymentIntent An error occurred while trying to handle the payment intent.')
      throw new InternalServerErrorException(`Failed to handle after payment intent: ${error.message}`)
    }
  }

  /**
   * Ajoute un objet en jeu à l'utilisateur dans le jeu spécifié.
   * @param {number} userId - L'ID de l'utilisateur auquel ajouter l'objet en jeu.
   * @param {string} gameTitle - Le titre du jeu dans lequel ajouter l'objet.
   * @param {string} productName - Le nom du produit à ajouter en jeu.
   * @param {number} productQuantity - La quantité du produit à ajouter.
   * @returns {Promise<void>} - Aucune valeur de retour, mais l'opération peut échouer avec une exception.
   */
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
      if (env.get('NODE_ENV') === 'production') {
        urlApi = 'https://api.seatyrants.com/crzgames/add-in-game-item'
      } else if (env.get('NODE_ENV') === 'staging') {
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
              'X-API-KEY': env.get('SEATYRANTSxCRZGAMES_API_KEY_SECRET'),
            },
          },
        )

        if (response.status === 201) {
          logger.info(`Successfully added ${productName} to user ${userId} in game ${gameTitle}`)
        } else {
          logger.error(`Failed to add ${productName} to user ${userId} in game ${gameTitle}: ${response.data.message}`)
        }
      } catch (error) {
        logger.error(`Failed to add ${productName} to user ${userId} in game ${gameTitle}: ${error}`)
        throw new Error(error)
      }
    }
  }
}

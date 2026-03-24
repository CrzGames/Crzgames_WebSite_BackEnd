import { connect, StringCodec, ErrorCode, NatsError, nkeyAuthenticator } from 'nats'
import type { NatsConnection, Subscription, Codec } from 'nats'
import env from '#start/env'

/**
 * Un service pour gérer les connexions NATS.
 * Ce service fournit des méthodes pour se connecter, s'abonner, publier des messages,
 * se désabonner et fermer la connexion NATS.
 * @class NatsService
 */
export default class NatsService {
  /**
   * Une instance de connexion NATS.
   * @private
   * @type {NatsConnection | null}
   * @default null
   */
  private nc: NatsConnection | null = null

  /**
   * Un codec pour encoder et décoder les messages en chaînes de caractères.
   * @private
   * @type {Codec<string>}
   */
  private readonly sc: Codec<string> = StringCodec()

  /**
   * Un map pour stocker les abonnements NATS.
   * La clé est le sujet de l'abonnement et la valeur est l'objet Subscription.
   * @private
   * @type {Map<string, Subscription>}
   */
  private readonly subscriptions: Map<string, Subscription> = new Map()

  /**
   * Connecte le service NATS au serveur NATS.
   * Utilise les options de connexion définies dans les variables d'environnement.
   * @returns {Promise<void>} - Une promesse qui se résout lorsque la connexion est établie.
   * @throws {NatsError} - Si la connexion échoue.
   */
  public async connect(): Promise<void> {
    try {
      const serversOptions: string[] = [env.get('NATS_SERVER_URL')]
      const seed: Uint8Array = new TextEncoder().encode(env.get('NATS_NKEY_PRIVATE_KEY'))

      this.nc = await connect({
        servers: serversOptions,
        authenticator: nkeyAuthenticator(seed),
      })

      console.log(`Connected to Server NATS : ${this.nc.getServer()}`)
    } catch (error) {
      if (error instanceof NatsError) {
        console.error(`Failed to connect to NATS server: [${error.code}] ${error.message}`)
      } else {
        console.error('Failed to connect to NATS server:', error)
      }
      throw error
    }
  }

  /**
   * S'abonne à un sujet NATS et exécute un callback pour chaque message reçu.
   * @param {string} subject - Le sujet auquel s'abonner.
   * @param {function} callback - La fonction de rappel qui sera appelée avec le message reçu.
   * @returns {Promise<void>} - Une promesse qui se résout lorsque l'abonnement est réussi.
   * @throws {NatsError} - Si l'abonnement échoue ou si la connexion n'est pas établie.
   */
  public async subscribe(subject: string, callback: (message: string) => void): Promise<void> {
    if (!this.nc) {
      throw new NatsError('Not connected to NATS server.', ErrorCode.ApiError)
    }

    try {
      const subscription: Subscription = this.nc.subscribe(subject)
      this.subscriptions.set(subject, subscription)
      console.log(`Subscribed to ${subject}`)

      for await (const msg of subscription) {
        callback(this.sc.decode(msg.data))
      }
    } catch (error) {
      if (error instanceof NatsError) {
        console.error(`Failed to subscribe : [${error.code}] ${error.message}`)
      } else {
        console.error('Failed to subscribe :', error)
      }
      throw error
    }
  }

  /**
   * Publie un message sur un sujet NATS.
   * @param {string} subject - Le sujet sur lequel publier le message.
   * @param {string} message - Le message à publier.
   * @returns {void} - Une promesse qui se résout lorsque le message est publié.
   * @throws {NatsError} - Si la publication échoue ou si la connexion n'est pas établie.
   */
  public publish(subject: string, message: string): void {
    if (!this.nc) {
      throw new NatsError('Not connected to NATS server.', ErrorCode.ApiError)
    }

    try {
      this.nc.publish(subject, this.sc.encode(message))
      console.log(`Published message to subject: ${subject}`)
    } catch (error) {
      if (error instanceof NatsError) {
        console.error(`Failed to publish message: [${error.code}] ${error.message}`)
      } else {
        console.error('Failed to publish message:', error)
      }
      throw error
    }
  }

  /**
   * Se désabonne d'un sujet NATS.
   * @param {string} subject - Le sujet duquel se désabonner.
   * @returns {void}
   */
  private unsubscribe(subject: string): void {
    const subscription: Subscription | undefined = this.subscriptions.get(subject)

    if (subscription) {
      subscription.unsubscribe()
      this.subscriptions.delete(subject)
      console.log(`Unsubscribed from ${subject}`)
    }
  }

  /**
   * Se désabonne de tous les sujets NATS.
   * @returns {void} - Une promesse qui se résout lorsque tous les désabonnements sont effectués.
   */
  public unsubscribeAll(): void {
    for (const [subject] of this.subscriptions) {
      this.unsubscribe(subject)
    }

    this.subscriptions.clear()
  }

  /**
   * Ferme la connexion NATS et se désabonne de tous les sujets.
   * @returns {Promise<void>} - Une promesse qui se résout lorsque la connexion est fermée.
   * @throws {NatsError} - Si la fermeture de la connexion échoue.
   */
  public async close(): Promise<void> {
    if (!this.nc) {
      console.log('Connection already closed.')
      return
    }

    try {
      await this.unsubscribeAll()
      await this.nc.drain()
      console.log('Connection drained and closed.')
    } catch (error) {
      if (error instanceof NatsError) {
        console.error(`Failed to close connection: [${error.code}] ${error.message}`)
      } else {
        console.error('Failed to close connection:', error)
      }
      throw error
    } finally {
      this.nc = null
    }
  }
}

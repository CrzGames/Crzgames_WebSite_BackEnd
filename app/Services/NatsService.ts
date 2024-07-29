import {
  connect,
  NatsConnection,
  StringCodec,
  Subscription,
  ErrorCode,
  NatsError,
  Codec,
  nkeyAuthenticator,
} from 'nats'
import Env from '@ioc:Adonis/Core/Env'

export default class NatsService {
  private nc: NatsConnection | null = null
  private sc: Codec<string> = StringCodec()
  private subscriptions: Map<string, Subscription> = new Map()

  public async connect(): Promise<void> {
    try {
      const serversOptions: string[] = [Env.get('NATS_SERVER')]
      const seed: Uint8Array = new TextEncoder().encode(Env.get('NATS_NKEY_PUBLIC_KEY'))

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

  public async publish(subject: string, message: string): Promise<void> {
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

  private unsubscribe(subject: string): void {
    const subscription: Subscription | undefined = this.subscriptions.get(subject)

    if (subscription) {
      subscription.unsubscribe()
      this.subscriptions.delete(subject)
      console.log(`Unsubscribed from ${subject}`)
    }
  }

  public async unsubscribeAll(): Promise<void> {
    for (const [subject, subscription] of this.subscriptions) {
      subscription.unsubscribe()
      console.log(`Unsubscribed from ${subject}`)
    }

    this.subscriptions.clear()
  }

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

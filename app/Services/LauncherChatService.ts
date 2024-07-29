import NatsService from 'App/Services/NatsService'
import Logger from '@ioc:Adonis/Core/Logger'
import ChatFriend from 'App/Models/ChatFriend'

type ReceivedChatMessage = {
  sender_users_id: number
  receiver_users_id: number
  content: string
}

type ReceivedChatFriendRequest = {
  sender_users_id: number
  receiver_users_id: number
  status: 'pending' | 'accepted' | 'declined' | 'cancel' | 'delete'
}

type ReceivedUserStatusConnected = {
  sender_users_id: number
  status: 'online' | 'available' | 'invisible'
}

export default class LauncherChatService {
  public static setupChatMessageSubscription(natsService: NatsService): void {
    natsService.subscribe('chat.message.topic', async (message: string): Promise<void> => {
      await this.receivedChatMessage(message, natsService)
    })
  }

  public static setupChatFriendRequestSubscription(natsService: NatsService): void {
    natsService.subscribe('chat.friendRequest.topic', async (message: string): Promise<void> => {
      await this.receivedChatFriendRequest(message, natsService)
    })
  }

  public static setupUserStatusConnectedSubscription(natsService: NatsService): void {
    natsService.subscribe('chat.statusConnected.topic', async (message: string): Promise<void> => {
      await this.receivedUserStatusConnected(message, natsService)
    })
  }

  public static async receivedUserStatusConnected(
    message: string,
    natsService: NatsService,
  ): Promise<void> {
    console.log('UserStatusConnected Received : ', message)

    const receivedUserStatusConnected: ReceivedUserStatusConnected = JSON.parse(message)

    // Get Services import dynamic
    const { default: ChatFriendService } = await import('App/Services/ChatFriendService')
    const { default: ChatUserStatusConnectedService } = await import(
      'App/Services/ChatUserStatusConnectedService'
    )

    // Update le status de connexion du user
    await ChatUserStatusConnectedService.updateUserStatusConnectedStatus(
      receivedUserStatusConnected.sender_users_id,
      receivedUserStatusConnected.status,
    )

    // Publier le statut mis à jour uniquement aux amis connectés
    const friends: ChatFriend[] = await ChatFriendService.getAllChatFriendByUserId(
      receivedUserStatusConnected.sender_users_id,
    )
    for (const friend of friends) {
      const friendStatus: string = await ChatUserStatusConnectedService.getUserStatus(
        friend.friend_users_id,
      )
      if (['online', 'available'].includes(friendStatus)) {
        await natsService.publish(
          `chat.statusConnected.topic.${friend.friend_users_id}`,
          JSON.stringify(receivedUserStatusConnected),
        )
      }
    }
  }

  public static async receivedChatFriendRequest(
    message: string,
    natsService: NatsService,
  ): Promise<void> {
    console.log('ChatFriendRequest Received : ', message)

    const receivedChatFriendRequest: ReceivedChatFriendRequest = JSON.parse(message)

    // Get Services import dynamic
    const { default: ChatBlockedService } = await import('App/Services/ChatBlockedService')
    const { default: ChatFriendRequestService } = await import(
      'App/Services/ChatFriendRequestService'
    )
    const { default: ChatFriendService } = await import('App/Services/ChatFriendService')

    // Vérifie si l'utilisateur n'est pas bloqué
    const isBlocked: boolean = await ChatBlockedService.checkIfUserSenderBlocked(
      receivedChatFriendRequest.sender_users_id,
      receivedChatFriendRequest.receiver_users_id,
    )
    if (isBlocked) {
      Logger.info('Utilisateur est bloqué.')
      return
    }

    switch (receivedChatFriendRequest.status) {
      case 'pending':
        await ChatFriendRequestService.createChatFriendRequest(
          receivedChatFriendRequest.sender_users_id,
          receivedChatFriendRequest.receiver_users_id,
        )
        break
      case 'accepted':
        await ChatFriendRequestService.updateChatFriendRequestStatus(
          receivedChatFriendRequest.sender_users_id,
          'accepted',
        )

        // On les ajoute en tant qu'amis (on fait deux fois pour chacun des deux comptes)
        await ChatFriendService.createChatFriend(
          receivedChatFriendRequest.sender_users_id,
          receivedChatFriendRequest.receiver_users_id,
        )
        await ChatFriendService.createChatFriend(
          receivedChatFriendRequest.receiver_users_id,
          receivedChatFriendRequest.sender_users_id,
        )
        break
      case 'declined':
        await ChatFriendRequestService.updateChatFriendRequestStatus(
          receivedChatFriendRequest.sender_users_id,
          'declined',
        )
        break
      case 'cancel':
        await ChatFriendRequestService.cancelChatFriendRequest(
          receivedChatFriendRequest.sender_users_id,
          receivedChatFriendRequest.receiver_users_id,
        )
        break
      case 'delete':
        // On supprime l'amis (on fait deux fois pour chacun des deux comptes)
        await ChatFriendService.deleteChatFriend(
          receivedChatFriendRequest.sender_users_id,
          receivedChatFriendRequest.receiver_users_id,
        )
        await ChatFriendService.deleteChatFriend(
          receivedChatFriendRequest.receiver_users_id,
          receivedChatFriendRequest.sender_users_id,
        )
        break
    }

    // Publish message to user receiver
    await natsService.publish(
      `chat.friendRequest.topic.${receivedChatFriendRequest.receiver_users_id}`,
      JSON.stringify(receivedChatFriendRequest),
    )
  }

  public static async receivedChatMessage(
    message: string,
    natsService: NatsService,
  ): Promise<void> {
    console.log('ChatMessage Received : ', message)

    const receivedChatMessage: ReceivedChatMessage = JSON.parse(message)

    // Vérifie si les utilisateurs sont amis
    const { default: ChatFriendService } = await import('App/Services/ChatFriendService')
    const areFriends: boolean | undefined = await ChatFriendService.checkFriendship(
      receivedChatMessage.sender_users_id,
      receivedChatMessage.receiver_users_id,
    )
    if (!areFriends) {
      Logger.info('Les utilisateurs ne sont pas amis.')
      return
    }

    // Vérifie si l'utilisateur n'est pas bloqué
    const { default: ChatBlockedService } = await import('App/Services/ChatBlockedService')
    const isBlocked: boolean = await ChatBlockedService.checkIfUserSenderBlocked(
      receivedChatMessage.sender_users_id,
      receivedChatMessage.receiver_users_id,
    )
    if (isBlocked) {
      Logger.info('Utilisateur est bloqué.')
      return
    }

    // Publish message to user receiver
    await natsService.publish(
      `chat.message.topic.${receivedChatMessage.receiver_users_id}`,
      JSON.stringify(receivedChatMessage),
    )
  }
}

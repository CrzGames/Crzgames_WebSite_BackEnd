import ChatFriendRequest from 'App/Models/ChatFriendRequest'
import { BadRequestException } from 'App/Exceptions/BadRequestException'
import { NotFoundException } from 'App/Exceptions/NotFoundException'
import ChatFriendService from 'App/Services/ChatFriendService'

export default class ChatFriendRequestService {
  public static async updateChatFriendRequestStatus(
    userId: number,
    status: 'pending' | 'accepted' | 'declined',
  ): Promise<ChatFriendRequest> {
    const chatFriendRequest: ChatFriendRequest = await ChatFriendRequest.query()
      .where('sender_users_id', userId)
      .orWhere('receiver_users_id', userId)
      .andWhere('status', 'pending')
      .firstOrFail()

    chatFriendRequest.status = status
    await chatFriendRequest.save()

    return chatFriendRequest
  }

  public static async getAllChatFriendRequestByUserId(
    userId: number,
  ): Promise<ChatFriendRequest[]> {
    try {
      return ChatFriendRequest.query().where('sender_users_id', userId).preload('receiverUser')
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }

  public static async createChatFriendRequest(
    senderUserId: number,
    receiverUserId: number,
  ): Promise<ChatFriendRequest> {
    try {
      return await ChatFriendRequest.create({
        sender_users_id: senderUserId,
        receiver_users_id: receiverUserId,
        status: 'pending', // default status
      })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  public static async cancelChatFriendRequest(
    senderUserId: number,
    receiverUserId: number,
  ): Promise<void> {
    const chatFriendRequest: ChatFriendRequest = await ChatFriendRequest.query()
      .where('sender_users_id', senderUserId)
      .andWhere('receiver_users_id', receiverUserId)
      .andWhere('status', 'pending')
      .firstOrFail()

    await chatFriendRequest.delete()
  }
}

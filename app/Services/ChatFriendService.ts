import { BadRequestException } from 'App/Exceptions/BadRequestException'
import { NotFoundException } from 'App/Exceptions/NotFoundException'
import ChatFriend from 'App/Models/ChatFriend'

export default class ChatFriendService {
  public static async checkFriendship(
    senderUserId: number,
    receiverUserId: number,
  ): Promise<boolean> {
    try {
      await ChatFriend.query()
        .where('users_id', senderUserId)
        .andWhere('friend_users_id', receiverUserId)
        .firstOrFail()

      return true
    } catch (error) {
      new NotFoundException(error.message)
      return false
    }
  }

  public static async getAllChatFriendByUserId(userId: number): Promise<ChatFriend[]> {
    try {
      return ChatFriend.query().where('users_id', userId).preload('friendUser')
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }

  public static async getAllChatFriendByUserUsername(username: string): Promise<ChatFriend[]> {
    try {
      return ChatFriend.query().where('username', username).preload('friendUser')
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }

  public static async createChatFriend(userId: number, friendUserId: number): Promise<ChatFriend> {
    try {
      return await ChatFriend.create({
        users_id: userId,
        friend_users_id: friendUserId,
      })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  public static async deleteChatFriend(userId: number, friendUserId: number): Promise<void> {
    const chatFriend: ChatFriend = await ChatFriend.query()
      .where('users_id', userId)
      .andWhere('friend_users_id', friendUserId)
      .firstOrFail()

    try {
      await chatFriend.delete()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}

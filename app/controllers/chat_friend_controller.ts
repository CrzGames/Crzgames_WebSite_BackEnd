import type { HttpContext } from '@adonisjs/core/http'
import ChatFriendService from '#services/chat_friend_service'
import type ChatFriend from '#models/chat_friend'

export default class ChatFriendController {
  public async getAllChatFriendByUserId({ params, response }: HttpContext): Promise<void> {
    const userId: number = params.userId
    const chatFriends: ChatFriend[] = await ChatFriendService.getAllChatFriendByUserId(userId)
    return response.status(200).ok(chatFriends)
  }

  public async getAllChatFriendByUserUsername({ params, response }: HttpContext): Promise<void> {
    const username: string = params.username
    const chatFriends: ChatFriend[] = await ChatFriendService.getAllChatFriendByUserUsername(username)
    return response.status(200).ok(chatFriends)
  }
}

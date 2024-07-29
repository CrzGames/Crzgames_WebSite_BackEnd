import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ChatFriendService from 'App/Services/ChatFriendService'
import ChatFriend from 'App/Models/ChatFriend'

export default class ChatFriendController {
  private async getAllChatFriendByUserId({ params, response }: HttpContextContract): Promise<void> {
    const userId: number = params.userId
    const chatFriends: ChatFriend[] = await ChatFriendService.getAllChatFriendByUserId(userId)
    return response.status(200).ok(chatFriends)
  }

  private async getAllChatFriendByUserUsername({
    params,
    response,
  }: HttpContextContract): Promise<void> {
    const username: string = params.username
    const chatFriends: ChatFriend[] =
      await ChatFriendService.getAllChatFriendByUserUsername(username)
    return response.status(200).ok(chatFriends)
  }
}

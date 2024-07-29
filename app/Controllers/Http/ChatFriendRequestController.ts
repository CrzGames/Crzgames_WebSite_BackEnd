import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ChatFriendRequestService from 'App/Services/ChatFriendRequestService'
import ChatFriendRequest from 'App/Models/ChatFriendRequest'

export default class ChatFriendRequestController {
  private async getAllChatFriendRequestByUserId({
    params,
    response,
  }: HttpContextContract): Promise<void> {
    const userId: number = params.userId
    const chatFriendRequests: ChatFriendRequest[] =
      await ChatFriendRequestService.getAllChatFriendRequestByUserId(userId)
    return response.status(200).ok(chatFriendRequests)
  }
}

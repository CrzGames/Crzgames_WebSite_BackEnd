import ChatMessage from 'App/Models/ChatMessage'
import { BadRequestException } from 'App/Exceptions/BadRequestException'

class ChatMessageService {
  public async createChatMessage(
    senderUserId: number,
    receiverUserId: number,
    content: string,
  ): Promise<ChatMessage | undefined> {
    try {
      return await ChatMessage.create({
        sender_users_id: senderUserId,
        receiver_users_id: receiverUserId,
        content: content,
      })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}

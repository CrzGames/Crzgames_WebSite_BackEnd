import { NotFoundException } from 'App/Exceptions/NotFoundException'
import ChatBlocked from 'App/Models/ChatBlocked'

export default class ChatBlockedService {
  public static async checkIfUserSenderBlocked(
    senderUserId: number,
    receiverUserId: number,
  ): Promise<boolean> {
    try {
      await ChatBlocked.query()
        .where('blocker_users_id', receiverUserId)
        .andWhere('blocked_users_id', senderUserId)
        .firstOrFail()

      return true
    } catch (error) {
      new NotFoundException(error.message)
      return false
    }
  }
}

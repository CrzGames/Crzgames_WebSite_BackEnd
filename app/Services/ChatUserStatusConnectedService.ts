import ChatUserStatusConnected from 'App/Models/ChatUserStatusConnected'

export default class ChatUserStatusConnectedService {
  public static async updateUserStatusConnectedStatus(
    userId: number,
    status: 'online' | 'available' | 'invisible',
  ): Promise<void> {
    let chatUserStatusConnected: ChatUserStatusConnected | null =
      await ChatUserStatusConnected.findBy('users_id', userId)

    if (!chatUserStatusConnected) {
      // Créer un nouvel enregistrement si l'utilisateur n'existe pas
      chatUserStatusConnected = await ChatUserStatusConnected.create({
        users_id: userId,
      })
    }

    // Mettre à jour le statut
    chatUserStatusConnected.status = status
    await chatUserStatusConnected.save()
  }

  public static async getUserStatus(userId: number): Promise<string> {
    const userStatus: ChatUserStatusConnected | null = await ChatUserStatusConnected.findBy(
      'users_id',
      userId,
    )

    return userStatus ? userStatus.status : 'offline'
  }
}

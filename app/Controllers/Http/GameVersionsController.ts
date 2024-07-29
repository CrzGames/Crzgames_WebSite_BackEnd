import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GameVersionsService from 'App/Services/GameVersionsService'
import GameVersion from 'App/Models/GameVersion'
import CreateGameVersionValidator from 'App/Validators/GameVersions/CreateGameVersionValidator'
import UpdateGameVersionValidator from 'App/Validators/GameVersions/UpdateGameVersionValidator'

export default class GameVersionsController {
  // GET: Recupere la derniere version du jeu et qui est disponible pour le telechargement
  private async getLatestAvailableVersion({
    params,
    response,
  }: HttpContextContract): Promise<void> {
    const gameVersion: GameVersion = await GameVersionsService.getLatestAvailableVersion(
      params.gameId,
    )
    return response.ok(gameVersion)
  }

  // POST: Crée une version de jeu
  private async createGameVersion({
    request,
    params,
    response,
  }: HttpContextContract): Promise<void> {
    const payload: { version: string; is_available: boolean } = await request.validate(
      CreateGameVersionValidator,
    )
    const gameVersion: GameVersion = await GameVersionsService.createGameVersion(
      params.gameId,
      payload,
    )
    return response.created(gameVersion)
  }

  // GET: Récupère toutes la table pour n'importe quel jeu
  private async getAllGameVersions({ response }: HttpContextContract): Promise<void> {
    const gameVersions: GameVersion[] = await GameVersionsService.getAllGameVersions()
    return response.ok(gameVersions)
  }

  // GET: Récupère toutes les versions pour un jeu spécifique
  private async getAllGameVersionsByGameId({
    params,
    response,
  }: HttpContextContract): Promise<void> {
    const gameVersions: GameVersion[] = await GameVersionsService.getAllGameVersionsByGameId(
      params.gameId,
    )
    return response.ok(gameVersions)
  }

  // GET: Récupère une version de jeu spécifique
  private async getGameVersion({ params, response }: HttpContextContract): Promise<void> {
    const gameVersion: GameVersion = await GameVersionsService.getGameVersion(
      params.gameId,
      params.gameVersionId,
    )
    return response.ok(gameVersion)
  }

  // PUT: Met à jour une version de jeu spécifique
  private async updateGameVersion({
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const payload: { is_available: boolean } = await request.validate(UpdateGameVersionValidator)
    const gameVersion: GameVersion = await GameVersionsService.updateGameVersion(
      params.gameId,
      params.gameVersionId,
      payload.is_available,
    )
    return response.ok(gameVersion)
  }

  // DELETE: Supprime une version de jeu spécifique
  private async deleteGameVersion({ params, response }: HttpContextContract): Promise<void> {
    await GameVersionsService.deleteGameVersion(params.gameId, params.gameVersionId)
    return response.ok({ message: 'Game version deleted successfully' })
  }
}

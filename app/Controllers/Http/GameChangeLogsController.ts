import GameChangeLogService from 'App/Services/GameChangeLogService'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UpdateGameChangeLogValidator from 'App/Validators/GameChangeLog/UpdateGameChangeLogValidator'
import GameChangeLog from 'App/Models/GameChangeLog'
import DeleteGameChangeLogValidator from 'App/Validators/GameChangeLog/DeleteGameChangeLogValidator'
import GetAllGameChangeLogByGameId from 'App/Validators/GameChangeLog/GetAllGameChangeLogByGameIdValidator'
import CreateGameChangeLogValidator from 'App/Validators/GameChangeLog/CreateGameChangeLogValidator'
import GetGameChangeLogByIdValidator from 'App/Validators/GameChangeLog/GetGameChangeLogByIdValidator'
import GetAllGameChangeLogByTitleValidator from 'App/Validators/GameChangeLog/GetAllGameChangeLogByTitleValidator'

export default class GameChangeLogsController {
  //function to create a game change log
  private async createGameChangeLog({ request, response }: HttpContextContract): Promise<void> {
    const payload: { games_id: number; version: string; content: string } = await request.validate(
      CreateGameChangeLogValidator,
    )

    const gameChangeLog: GameChangeLog = await GameChangeLogService.createGameChangeLog(payload)

    response.status(201).json(gameChangeLog)
  }

  //function to get all game change logs
  private async getAllGameChangeLogs({ response }: HttpContextContract): Promise<void> {
    const gameChangeLogs: GameChangeLog[] = await GameChangeLogService.getAllGameChangeLogs()
    response.status(200).json(gameChangeLogs)
  }

  //function to update a game change log
  private async updateGameChangeLog({ request, response }: HttpContextContract): Promise<void> {
    const payload: { id: number; games_id: number; version: string; content: string } =
      await request.validate(UpdateGameChangeLogValidator)

    await GameChangeLogService.updateGameChangeLog(payload)

    response.status(204).noContent()
  }

  //function to delete a game change log
  private async deleteGameChangeLog({ request, response }: HttpContextContract): Promise<void> {
    const payload: { id: number } = await request.validate(DeleteGameChangeLogValidator)
    await GameChangeLogService.deleteGameChangeLog(payload.id)
    response.status(204).noContent()
  }

  //function to get a game change log by id game
  private async getAllGameChangeLogByGameId({
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const payload: { gameId: number } = await request.validate(GetAllGameChangeLogByGameId)
    const gameChangeLogs: GameChangeLog[] = await GameChangeLogService.getAllGameChangeLogByGameId(
      payload.gameId,
    )
    response.status(200).json(gameChangeLogs)
  }

  private async getGameChangeLogById({ request, response }: HttpContextContract): Promise<void> {
    const payload: { id: number } = await request.validate(GetGameChangeLogByIdValidator)
    const gameChangeLog: GameChangeLog = await GameChangeLogService.getGameChangeLogById(payload.id)
    response.status(200).json(gameChangeLog)
  }

  private async getAllGameChangeLogByGameTitle({
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const payload: { title: string } = await request.validate(GetAllGameChangeLogByTitleValidator)
    payload.title = decodeURIComponent(payload.title)
    const gameChangeLogs: GameChangeLog[] =
      await GameChangeLogService.getAllGameChangeLogByGameTitle(payload.title)
    response.status(200).json(gameChangeLogs)
  }
}

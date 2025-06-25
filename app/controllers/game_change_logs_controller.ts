import GameChangeLogService from '#services/game_change_log_service'
import { HttpContext } from '@adonisjs/core/http'
import UpdateGameChangeLogValidator from '#validators/game_change_log/update_game_change_log_validator'
import GameChangeLog from '#models/game_change_log'
import DeleteGameChangeLogValidator from '#validators/game_change_log/delete_game_change_log_validator'
import GetAllGameChangeLogByGameId from '#validators/game_change_log/get_all_game_change_log_by_game_id_validator'
import CreateGameChangeLogValidator from '#validators/game_change_log/create_game_change_log_validator'
import GetGameChangeLogByIdValidator from '#validators/game_change_log/get_game_change_log_by_id_validator'
import GetAllGameChangeLogByTitleValidator from '#validators/game_change_log/get_all_game_change_log_by_title_validator'

export default class GameChangeLogsController {
  //function to create a game change log
  public async createGameChangeLog({ request, response }: HttpContext): Promise<void> {
    const payload: { games_id: number; version: string; content: string } = await request.validate(
      CreateGameChangeLogValidator,
    )

    const gameChangeLog: GameChangeLog = await GameChangeLogService.createGameChangeLog(payload)

    response.status(201).json(gameChangeLog)
  }

  //function to get all game change logs
  public async getAllGameChangeLogs({ response }: HttpContext): Promise<void> {
    const gameChangeLogs: GameChangeLog[] = await GameChangeLogService.getAllGameChangeLogs()
    response.status(200).json(gameChangeLogs)
  }

  //function to update a game change log
  public async updateGameChangeLog({ request, response }: HttpContext): Promise<void> {
    const payload: { id: number; games_id: number; version: string; content: string } =
      await request.validate(UpdateGameChangeLogValidator)

    await GameChangeLogService.updateGameChangeLog(payload)

    response.status(204).noContent()
  }

  //function to delete a game change log
  public async deleteGameChangeLog({ request, response }: HttpContext): Promise<void> {
    const payload: { id: number } = await request.validate(DeleteGameChangeLogValidator)
    await GameChangeLogService.deleteGameChangeLog(payload.id)
    response.status(204).noContent()
  }

  //function to get a game change log by id game
  public async getAllGameChangeLogByGameId({
    request,
    response,
  }: HttpContext): Promise<void> {
    const payload: { gameId: number } = await request.validate(GetAllGameChangeLogByGameId)
    const gameChangeLogs: GameChangeLog[] = await GameChangeLogService.getAllGameChangeLogByGameId(
      payload.gameId,
    )
    response.status(200).json(gameChangeLogs)
  }

  public async getGameChangeLogById({ request, response }: HttpContext): Promise<void> {
    const payload: { id: number } = await request.validate(GetGameChangeLogByIdValidator)
    const gameChangeLog: GameChangeLog = await GameChangeLogService.getGameChangeLogById(payload.id)
    response.status(200).json(gameChangeLog)
  }

  public async getAllGameChangeLogByGameTitle({
    request,
    response,
  }: HttpContext): Promise<void> {
    const payload: { title: string } = await request.validate(GetAllGameChangeLogByTitleValidator)
    payload.title = decodeURIComponent(payload.title)
    const gameChangeLogs: GameChangeLog[] =
      await GameChangeLogService.getAllGameChangeLogByGameTitle(payload.title)
    response.status(200).json(gameChangeLogs)
  }
}

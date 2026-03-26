import GameChangeLogService from '#services/game_change_log_service'
import type { HttpContext } from '@adonisjs/core/http'
import type GameChangeLog from '#models/game_change_log'
import { getAllGameChangeLogByTitleValidator } from '#validators/GameChangeLog/GetAllGameChangeLogByTitleValidator'
import { getAllGameChangeLogByGameIdValidator } from '#validators/GameChangeLog/GetAllGameChangeLogByGameIdValidator'
import { createGameChangeLogValidator } from '#validators/GameChangeLog/CreateGameChangeLogValidator'
import { updateGameChangeLogValidator } from '#validators/GameChangeLog/UpdateGameChangeLogValidator'
import { deleteGameChangeLogValidator } from '#validators/GameChangeLog/DeleteGameChangeLogValidator'
import { getGameChangeLogByIdValidator } from '#validators/GameChangeLog/GetGameChangeLogByIdValidator'
import BadRequestException from '#exceptions/bad_request_exception'

/**
 *
 */
export default class GameChangeLogsController {
  //function to create a game change log
  /**
   *
   */
  public async createGameChangeLog({ request, response }: HttpContext): Promise<void> {
    const payload: { games_id: number; version: string; content: string } =
      await request.validateUsing(createGameChangeLogValidator)

    const gameChangeLog: GameChangeLog = await GameChangeLogService.createGameChangeLog(payload)

    response.status(201).json(gameChangeLog)
  }

  //function to get all game change logs
  /**
   *
   */
  public async getAllGameChangeLogs({ response }: HttpContext): Promise<void> {
    const gameChangeLogs: GameChangeLog[] = await GameChangeLogService.getAllGameChangeLogs()
    response.status(200).json(gameChangeLogs)
  }

  //function to update a game change log
  /**
   *
   */
  public async updateGameChangeLog({ request, params, response }: HttpContext): Promise<void> {
    const gameChangeLogId: number = Number(params.id)
    if (Number.isNaN(gameChangeLogId)) {
      throw new BadRequestException('Invalid game change log id')
    }

    const payload: { games_id: number; version: string; content: string } =
      await request.validateUsing(updateGameChangeLogValidator)

    await GameChangeLogService.updateGameChangeLog({
      id: gameChangeLogId,
      games_id: payload.games_id,
      version: payload.version,
      content: payload.content,
    })

    response.status(204).noContent()
  }

  //function to delete a game change log
  /**
   *
   */
  public async deleteGameChangeLog({ request, response }: HttpContext): Promise<void> {
    const payload: { params: { id: number } } = await request.validateUsing(deleteGameChangeLogValidator)
    await GameChangeLogService.deleteGameChangeLog(payload.params.id)
    response.status(204).noContent()
  }

  //function to get a game change log by id game
  /**
   *
   */
  public async getAllGameChangeLogByGameId({ request, response }: HttpContext): Promise<void> {
    const payload: { params: { gameId: number } } = await request.validateUsing(getAllGameChangeLogByGameIdValidator)
    const gameChangeLogs: GameChangeLog[] = await GameChangeLogService.getAllGameChangeLogByGameId(
      payload.params.gameId,
    )
    response.status(200).json(gameChangeLogs)
  }

  /**
   *
   */
  public async getGameChangeLogById({ request, response }: HttpContext): Promise<void> {
    const payload: { params: { id: number } } = await request.validateUsing(getGameChangeLogByIdValidator)
    const gameChangeLog: GameChangeLog = await GameChangeLogService.getGameChangeLogById(payload.params.id)
    response.status(200).json(gameChangeLog)
  }

  /**
   *
   */
  public async getAllGameChangeLogByGameTitle({ request, response }: HttpContext): Promise<void> {
    const payload: { params: { title: string } } = await request.validateUsing(getAllGameChangeLogByTitleValidator)
    const decodedTitle: string = decodeURIComponent(payload.params.title).replace(/\+/g, ' ').trim()
    const gameChangeLogs: GameChangeLog[] = await GameChangeLogService.getAllGameChangeLogByGameTitle(decodedTitle)
    response.status(200).json(gameChangeLogs)
  }
}

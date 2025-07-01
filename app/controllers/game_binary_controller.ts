import type { HttpContext } from '@adonisjs/core/http'
import type GameBinary from '#models/game_binary'
import GameBinariesService from '#services/game_binaries_service'
import type { GameBinaryCommand } from '#services/game_binaries_service'
import GameBinaryAssignmentsService from '#services/game_binary_assignments_service'
import { getGameBinariesByIdValidator } from '#validators/GameBinary/GetGameBinariesByIdValidator'
import { createGameBinaryValidator } from '#validators/GameBinary/CreateGameBinaryValidator'
import { updateGameBinaryValidator } from '#validators/GameBinary/UpdateGameBinaryValidator'
import { deleteGameBinariesValidator } from '#validators/GameBinary/DeleteGameBinariesValidator'

export default class GameBinaryController {
  public async getGameBinaryById({ request, response }: HttpContext): Promise<void> {
    const payload: { id: number } = await request.validateUsing(getGameBinariesByIdValidator)
    const gameBinary: GameBinary = await GameBinariesService.getGameBinaryById(payload.id)
    return response.status(200).json(gameBinary)
  }

  //function to create a game binary
  public async createGameBinary({ request, response }: HttpContext): Promise<void> {
    const payload: { gameId: number; binary: GameBinaryCommand } =
      await request.validateUsing(createGameBinaryValidator)
    const gameBinary: GameBinary = await GameBinariesService.createGameBinary(payload.binary)

    // Ajout du binary au game en utilisant le service GameBinaryAssignmentsService
    await GameBinaryAssignmentsService.createGameBinaryAssignment(payload.gameId, gameBinary.id)
    return response.status(201).json(gameBinary)
  }

  //function to update a binary by id
  public async updateGameBinary({ request, response, params }: HttpContext): Promise<void> {
    const gameBinaryId: number = params.id
    const payload: { gameId: number; binary: GameBinaryCommand } =
      await request.validateUsing(updateGameBinaryValidator)

    await GameBinariesService.updateGameBinary(gameBinaryId, payload.binary)

    return response.status(204).noContent()
  }

  //function to delete a binary by id
  public async deleteGameBinary({ request, response }: HttpContext): Promise<void> {
    const payload: { id: number } = await request.validateUsing(deleteGameBinariesValidator)
    await GameBinariesService.deleteGameBinary(payload.id)
    response.status(204).noContent()
  }
}

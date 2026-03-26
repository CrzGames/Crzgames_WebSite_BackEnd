import type { HttpContext } from '@adonisjs/core/http'
import type GameBinary from '#models/game_binary'
import GameBinariesService from '#services/game_binaries_service'
import type { GameBinaryCommand } from '#services/game_binaries_service'
import GameBinaryAssignmentsService from '#services/game_binary_assignments_service'
import { getGameBinariesByIdValidator } from '#validators/game_binary/get_game_binaries_by_id_validator'
import { createGameBinaryValidator } from '#validators/game_binary/create_game_binary_validator'
import { updateGameBinaryValidator } from '#validators/game_binary/update_game_binary_validator'
import { deleteGameBinariesValidator } from '#validators/game_binary/delete_game_binaries_validator'

/**
 *
 */
export default class GameBinaryController {
  /**
   *
   */
  public async getGameBinaryById({ request, response }: HttpContext): Promise<void> {
    const payload: { params: { id: number } } = await request.validateUsing(getGameBinariesByIdValidator)
    const gameBinary: GameBinary = await GameBinariesService.getGameBinaryById(payload.params.id)
    response.status(200).json(gameBinary)
  }

  //function to create a game binary
  /**
   *
   */
  public async createGameBinary({ request, response }: HttpContext): Promise<void> {
    const payload: { gameId: number; binary: GameBinaryCommand } =
      await request.validateUsing(createGameBinaryValidator)
    const gameBinary: GameBinary = await GameBinariesService.createGameBinary(payload.binary)

    // Ajout du binary au game en utilisant le service GameBinaryAssignmentsService
    await GameBinaryAssignmentsService.createGameBinaryAssignment(payload.gameId, gameBinary.id)
    response.status(201).json(gameBinary)
  }

  //function to update a binary by id
  /**
   *
   */
  public async updateGameBinary({ request, response, params }: HttpContext): Promise<void> {
    const gameBinaryId: number = params.id
    const payload: { gameId: number; binary: GameBinaryCommand } =
      await request.validateUsing(updateGameBinaryValidator)

    await GameBinariesService.updateGameBinary(gameBinaryId, payload.binary)

    response.status(204).noContent()
  }

  //function to delete a binary by id
  /**
   *
   */
  public async deleteGameBinary({ request, response }: HttpContext): Promise<void> {
    const payload: { params: { id: number } } = await request.validateUsing(deleteGameBinariesValidator)
    await GameBinariesService.deleteGameBinary(payload.params.id)
    response.status(204).noContent()
  }
}

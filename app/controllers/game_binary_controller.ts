import { HttpContext } from '@adonisjs/core/http'
import GetGameBinariesByIdValidator from '#validators/game_binary/get_game_binaries_by_id_validator'
import DeleteGameBinariesValidator from '#validators/game_binary/delete_game_binaries_validator'
import GameBinary from '#models/game_binary'
import GameBinariesService from '#services/game_binaries_service'
import type { GameBinaryCommand } from '#services/game_binaries_service'
import CreateGameBinaryValidator from '#validators/game_binary/create_game_binary_validator'
import GameBinaryAssignmentsService from '#services/game_binary_assignments_service'
import UpdateGameBinaryValidator from '#validators/game_binary/update_game_binary_validator'

export default class GameBinaryController {
  public async getGameBinaryById({ request, response }: HttpContext): Promise<void> {
    const payload: { id: number } = await request.validate(GetGameBinariesByIdValidator)
    const gameBinary: GameBinary = await GameBinariesService.getGameBinaryById(payload.id)
    return response.status(200).json(gameBinary)
  }

  //function to create a game binary
  public async createGameBinary({ request, response }: HttpContext): Promise<void> {
    const payload: { gameId: number; binary: GameBinaryCommand } = await request.validate(CreateGameBinaryValidator)
    const gameBinary: GameBinary = await GameBinariesService.createGameBinary(payload.binary)

    // Ajout du binary au game en utilisant le service GameBinaryAssignmentsService
    await GameBinaryAssignmentsService.createGameBinaryAssignment(payload.gameId, gameBinary.id)
    return response.status(201).json(gameBinary)
  }

  //function to update a binary by id
  public async updateGameBinary({ request, response, params }: HttpContext): Promise<void> {
    const gameBinaryId: number = params.id
    const payload: { gameId: number; binary: GameBinaryCommand } = await request.validate(UpdateGameBinaryValidator)

    await GameBinariesService.updateGameBinary(gameBinaryId, payload.binary)

    return response.status(204).noContent()
  }

  //function to delete a binary by id
  public async deleteGameBinary({ request, response }: HttpContext): Promise<void> {
    const payload: { id: number } = await request.validate(DeleteGameBinariesValidator)
    await GameBinariesService.deleteGameBinary(payload.id)
    response.status(204).noContent()
  }
}

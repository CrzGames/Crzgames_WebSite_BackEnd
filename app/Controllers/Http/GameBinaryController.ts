import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GetGameBinariesByIdValidator from 'App/Validators/GameBinary/GetGameBinariesByIdValidator'
import DeleteGameBinariesValidator from 'App/Validators/GameBinary/DeleteGameBinariesValidator'
import GameBinary from 'App/Models/GameBinary'
import GameBinariesService from 'App/Services/GameBinariesService'
import type { GameBinaryCommand } from 'App/Services/GameBinariesService'
import CreateGameBinaryValidator from 'App/Validators/GameBinary/CreateGameBinaryValidator'
import GameBinaryAssignmentsService from 'App/Services/GameBinaryAssignmentsService'
import UpdateGameBinaryValidator from 'App/Validators/GameBinary/UpdateGameBinaryValidator'

export default class GameBinaryController {
  private async getGameBinaryById({ request, response }: HttpContextContract): Promise<void> {
    const payload: { id: number } = await request.validate(GetGameBinariesByIdValidator)
    const gameBinary: GameBinary = await GameBinariesService.getGameBinaryById(payload.id)
    return response.status(200).json(gameBinary)
  }

  //function to create a game binary
  private async createGameBinary({ request, response }: HttpContextContract): Promise<void> {
    const payload: { gameId: number; binary: GameBinaryCommand } =
      await request.validate(CreateGameBinaryValidator)
    const gameBinary: GameBinary = await GameBinariesService.createGameBinary(payload.binary)

    // Ajout du binary au game en utilisant le service GameBinaryAssignmentsService
    await GameBinaryAssignmentsService.createGameBinaryAssignment(payload.gameId, gameBinary.id)
    return response.status(201).json(gameBinary)
  }

  //function to update a binary by id
  private async updateGameBinary({
    request,
    response,
    params,
  }: HttpContextContract): Promise<void> {
    const gameBinaryId: number = params.id
    const payload: { gameId: number; binary: GameBinaryCommand } =
      await request.validate(UpdateGameBinaryValidator)

    await GameBinariesService.updateGameBinary(gameBinaryId, payload.binary)

    return response.status(204).noContent()
  }

  //function to delete a binary by id
  private async deleteGameBinary({ request, response }: HttpContextContract): Promise<void> {
    const payload: { id: number } = await request.validate(DeleteGameBinariesValidator)
    await GameBinariesService.deleteGameBinary(payload.id)
    response.status(204).noContent()
  }
}

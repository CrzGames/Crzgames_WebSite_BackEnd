import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName: string = 'user_game_wishlists'

  public async up(): Promise<void> {
    this.schema.createTable(this.tableName, (table): void => {
      table.increments('id').primary().notNullable().unique()
      table
        .integer('users_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE') // Supprime les entrées si l'utilisateur est supprimé
      table
        .integer('games_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('games')
        .onDelete('CASCADE') // Supprime les entrées si le jeu est supprimé
      table.unique(['users_id', 'games_id']) // Assure qu'un utilisateur ne peut pas ajouter le même jeu plusieurs fois
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  public async down(): Promise<void> {
    this.schema.dropTable(this.tableName)
  }
}
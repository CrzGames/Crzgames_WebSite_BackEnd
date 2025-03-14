import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'game_medias'

  public async up(): Promise<void> {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().unique().notNullable()
      table
        .integer('games_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('games')
        .onDelete('CASCADE')
      table
        .integer('files_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('files')
        .onDelete('CASCADE')
      table
        .enum('type', ['screenshot', 'trailer', 'gameplay'])
        .notNullable()
        .comment('Définit si le fichier est une capture d’écran, une bande-annonce ou une vidéo de gameplay')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down(): Promise<void> {
    this.schema.dropTable(this.tableName)
  }
}

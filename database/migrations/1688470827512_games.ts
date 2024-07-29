import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName: string = 'games'

  public async up(): Promise<void> {
    this.schema.createTable(this.tableName, (table): void => {
      table.increments('id').primary()
      table.string('title').notNullable().unique()
      table
        .integer('trailer_files_id')
        .unsigned()
        .references('id')
        .inTable('files')
        .onDelete('CASCADE')
      table
        .integer('picture_files_id')
        .unsigned()
        .references('id')
        .inTable('files')
        .onDelete('CASCADE')
      table
        .integer('logo_files_id')
        .unsigned()
        .references('id')
        .inTable('files')
        .onDelete('CASCADE')
      table.text('description').notNullable()
      table.boolean('upcoming_game').nullable() // si c'est un jeu à venir
      table.boolean('new_game').nullable() // si c'est un nouveau jeu
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down(): Promise<void> {
    this.schema.dropTable(this.tableName)
  }
}

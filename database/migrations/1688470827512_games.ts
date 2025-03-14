import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName: string = 'games'

  public async up(): Promise<void> {
    this.schema.createTable(this.tableName, (table): void => {
      table.increments('id').primary().notNullable().unique()
      table.string('title').notNullable().unique()
      table
        .integer('trailer_files_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('files')
        .onDelete('CASCADE')
      table
        .integer('picture_files_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('files')
        .onDelete('CASCADE')
      table
        .integer('logo_files_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('files')
        .onDelete('CASCADE')
      table.text('description').notNullable()
      table.boolean('upcoming_game').nullable() // si c'est un jeu à venir
      table.boolean('new_game').nullable() // si c'est un nouveau jeu
      table.dateTime('release_date', { useTz: true }).nullable()
      table.enum('game_mode', ['solo', 'multiplayer', 'both']).notNullable()
      table.string('publisher').notNullable()
      table.string('developer').notNullable()
      table
        .integer('game_configurations_minimal_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('game_configurations')
        .onDelete('SET NULL')
      table
        .integer('game_configurations_recommended_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('game_configurations')
        .onDelete('SET NULL')
      table
        .enum('pegi_rating', ['PEGI 3', 'PEGI 7', 'PEGI 12', 'PEGI 16', 'PEGI 18'])
        .notNullable()
        .comment('Classification PEGI du jeu')
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  public async down(): Promise<void> {
    this.schema.dropTable(this.tableName)
  }
}

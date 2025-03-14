import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'game_configurations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable().unique()
      table.enum('type', ['minimal', 'recommended']).notNullable()
      table.string('cpu_intel').notNullable()
      table.string('cpu_amd').notNullable()
      table.string('gpu_nvidia').notNullable()
      table.string('gpu_amd').notNullable()
      table.string('ram').notNullable()
      table.string('storage').notNullable()
      table.string('os').notNullable()
      table.boolean('internet').nullable()
      table.string('additional_notes').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

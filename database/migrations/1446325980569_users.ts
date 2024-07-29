import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName: string = 'users'

  public async up(): Promise<void> {
    this.schema.createTable(this.tableName, (table): void => {
      table.increments('id').primary()
      table.integer('roles_id').unsigned().references('id').inTable('user_roles')
      table.string('username', 22).notNullable().unique()
      table.string('email').notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('currency_code', 45).nullable()
      table.string('ip_address', 45).nullable()
      table.string('ip_region', 45).nullable()
      table.boolean('is_active').defaultTo(false)
      table.integer('active_code', 6).notNullable()
      table.string('stripe_customer_id').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down(): Promise<void> {
    this.schema.dropTable(this.tableName)
  }
}

import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { UserRoles } from 'App/Enums/UserRoles'
import UserRole from 'App/Models/UserRole'

export const UserFactory = Factory.define(User, async ({ faker }) => {
  const userRoles: UserRoles[] = Object.values(UserRoles)
  const uniqueSuffix: string = Math.random().toString(36).substring(2)

  // Limiter à 18 caractères le username
  let username: string = faker.internet.userName() + uniqueSuffix
  username = username.length > 22 ? username.substring(0, 22) : username

  // Sélection aléatoire d'un rôle
  const randomRole: UserRoles = faker.helpers.arrayElement(userRoles)

  // Trouver l'ID du rôle dans la base de données
  const role: UserRole | null = await UserRole.findBy('name', randomRole)

  return {
    username: username,
    email: faker.internet.email().replace('@', `${uniqueSuffix}@`),
    password: 'Marylene59!',
    ip_address: faker.internet.ip(),
    ip_region: null,
    currency_code: faker.finance.currencyCode(),
    roles_id: role?.id,
    is_active: true,
    active_code: 234568,
    stripe_customer_id: null,
  }
}).build()

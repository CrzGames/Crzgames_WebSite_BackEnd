/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for the majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

import './routes/launcher'
import './routes/tickets'
import './routes/ticket-responses'
import './routes/games'
import './routes/users'
import './routes/auth'
import './routes/game-binary-assignments'
import './routes/game-category-assignments'
import './routes/game-platform-assignments'
import './routes/user-game-libraries'
import './routes/nats'
import './routes/cloud-storage-s3'
import './routes/user-roles'
import './routes/ticket-categories'
import './routes/ticket-statuses'
import './routes/game-change-logs'
import './routes/game-binaries'
import './routes/stripe'
import './routes/game-categories'
import './routes/game-platforms'
import './routes/health'
import './routes/carousel'
import './routes/chat-friends'
import './routes/chat-friend-requests'
import './routes/game-versions'
import './routes/products'
import './routes/orders'
import './routes/order-products'
import './routes/product-categories'
import './routes/game-servers'
import './routes/product-game-servers'
import './routes/product-discounts'
import './routes/maintenant-websites'

Route.get('/', async () => {
  return { hello: 'test' }
})

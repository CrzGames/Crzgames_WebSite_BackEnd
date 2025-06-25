import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Bucket from '#models/bucket'

export default class BucketSeeder extends BaseSeeder {
  public static environment: string[] = ['development', 'test', 'staging', 'production']

  public async run(): Promise<void> {
    const bucketsData: { name: string; visibility: string }[] = [
      { name: 'crzgames-public', visibility: 'public' },
      { name: 'crzgames-private', visibility: 'private' },
    ]

    for (const data of bucketsData) {
      await Bucket.firstOrCreate({ name: data.name }, data)
    }
  }
}

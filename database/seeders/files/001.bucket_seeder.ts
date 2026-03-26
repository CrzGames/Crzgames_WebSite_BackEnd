import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Bucket from '#models/bucket'
import env from '#start/env'

export default class BucketSeeder extends BaseSeeder {
  public static environment: string[] = ['development', 'development-remote', 'test', 'staging', 'production']

  public async run(): Promise<void> {
    const bucketsData: { name: string; visibility: string }[] = [
      { name: env.get('S3_BUCKET_NAME'), visibility: env.get('S3_BUCKET_VISIBILITY') },
    ]

    for (const data of bucketsData) {
      await Bucket.firstOrCreate({ name: data.name }, data)
    }
  }
}

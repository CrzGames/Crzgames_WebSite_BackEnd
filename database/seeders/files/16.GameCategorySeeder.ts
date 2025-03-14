import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import GameCategory from 'App/Models/GameCategory'

export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'test', 'staging', 'production']

  public async run(): Promise<void> {
    // Write your database queries inside the run method
    const categoriesData = [
      { name: 'Action' },
      { name: 'Adventure' },
      { name: 'Anime' },
      { name: 'Arcade' },
      { name: 'Artillery' },
      { name: 'Battle royale' },
      { name: "Beat 'em up" },
      { name: 'Board' },
      { name: 'Card' },
      { name: 'Card battle' },
      { name: 'Casual' },
      { name: 'Cartoon' },
      { name: 'Competitive' },
      { name: 'Construction' },
      { name: 'Cooperative' },
      { name: 'Cyberpunk' },
      { name: 'Educational' },
      { name: 'Fantasy' },
      { name: 'Farming' },
      { name: 'Fighter' },
      { name: 'First-person' },
      { name: 'Flight' },
      { name: 'Fighting' },
      { name: 'Horror' },
      { name: 'Historical' },
      { name: 'Historical fantasy' },
      { name: 'Historical fiction' },
      { name: 'Management' },
      { name: 'Martial arts' },
      { name: 'Massively multiplayer online' },
      { name: 'Metroidvania' },
      { name: 'MMORPG' },
      { name: 'Movie-based' },
      { name: 'Music' },
      { name: 'Mystery' },
      { name: 'Mythology' },
      { name: 'Open world' },
      { name: 'Party' },
      { name: 'Platformer' },
      { name: 'Point-and-click' },
      { name: 'Post-apocalyptic' },
      { name: 'Puzzle' },
      { name: 'Racing' },
      { name: 'Real-time' },
      { name: 'Real-time strategy' },
      { name: 'Rhythm' },
      { name: 'Roguelike' },
      { name: 'UserRole-playing' },
      { name: 'RPG' },
      { name: 'Sci-fi' },
      { name: 'Shooter' },
      { name: 'Simulation' },
      { name: 'Sports' },
      { name: 'Stealth' },
      { name: 'Stealth-based' },
      { name: 'Steampunk' },
      { name: 'Strategy' },
      { name: 'Superhero' },
      { name: 'Survival' },
      { name: 'Survival horror' },
      { name: 'Tactical' },
      { name: 'Tactical shooter' },
      { name: 'Third-person' },
      { name: 'Tower defense' },
      { name: 'Trivia' },
      { name: 'Turn-based' },
      { name: 'TV show-based' },
      { name: 'Visual novel' },
      { name: 'Western' },
      { name: 'Word' },
      { name: 'Zombie' },
    ]

    for (const data of categoriesData) {
      await GameCategory.firstOrCreate({ name: data.name }, data)
    }
  }
}

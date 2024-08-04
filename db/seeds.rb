# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

puts 'seedデータ投入開始'

user1 = User.create!(email: 'satou@example.com', password: 'password', password_confirmation: 'password')

routes1 = [
  { source: 0, target: 1, l: 20, id: 'root10' },
  { source: 1, target: 2, l: 20, id: 'root11' },
  { source: 2, target: 0, l: 20, id: 'root12' },
  { source: 0, target: 2, l: 20, id: 're_root10' },
  { source: 1, target: 0, l: 20, id: 're_root11' },
  { source: 2, target: 1, l: 20, id: 're_root12' }
]

operator1 = { name: 'Alice' }

facilities1 = [
  {
    index: 0,
    x: 230,
    y: 310,
    r: 10,
    id: 'n0',
    processingTime: 1,
    type: 'start',
    name: 'startPoint'
  },
  {
    index: 1,
    x: 330,
    y: 60,
    r: 15,
    id: 'n1',
    processingTime: 15,
    type: 'machine',
    name: 'machine-no-1',
    isProcessing: false,
    hasMaterial: false,
    storageSize: 0,
    processingEndTime: 0
  },
  {
    index: 2,
    x: 430,
    y: 310,
    r: 10,
    id: 'n2',
    processingTime: 1,
    type: 'goal',
    name: 'goalPoint'
  }
]

Simulation.create!(user: user1, routes: routes1, operators: operator1, facilities: facilities1)

puts 'seedデータ投入終了'

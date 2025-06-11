class Simulation < ApplicationRecord
  belongs_to :user
  validates :title, length: { maximum: 20 }, presence: true
  validate :simulation_total_count_cannot_set_exceeded_limit, on: :create

  SIMULATION_MAX_COUNT = 3
  def simulation_total_count_cannot_set_exceeded_limit
    count_in_simulation = user.simulations.count
    errors.add(:status, 'シミュレーションの総数は3個までです') if count_in_simulation >= SIMULATION_MAX_COUNT
  end
end

class Simulation < ApplicationRecord
  belongs_to :user
  validates :title, length: { maximum: 20 }, presence: true
  validate :validate_simulation_limit, on: :create

  SIMULATION_MAX_COUNT = 3
  def validate_simulation_limit
    count_in_simulation = user.simulations.count
    errors.add(:status, 'シミュレーションの総数は3個までです') if count_in_simulation >= SIMULATION_MAX_COUNT
  end
end

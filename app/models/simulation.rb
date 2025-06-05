class Simulation < ApplicationRecord
  belongs_to :user
  validates :title, length: { maximum: 20 }, presence: true
end

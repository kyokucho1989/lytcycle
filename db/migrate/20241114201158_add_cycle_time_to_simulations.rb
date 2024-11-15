class AddCycleTimeToSimulations < ActiveRecord::Migration[7.0]
  def change
    add_column :simulations, :cycle_time, :float
  end
end

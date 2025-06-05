class ChangeSimulationTitleNotNull < ActiveRecord::Migration[7.0]
  def change
    change_column_null(:simulations, :title, false)
  end
end

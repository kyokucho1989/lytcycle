# frozen_string_literal: true

class AddSimulationTitleNotNull < ActiveRecord::Migration[7.0]
  def up
    Simulation.where(title: '').update_all(title: 'Untitle')
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end

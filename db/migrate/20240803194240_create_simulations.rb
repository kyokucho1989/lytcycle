class CreateSimulations < ActiveRecord::Migration[7.0]
  def change
    create_table :simulations do |t|
      t.belongs_to :user
      t.jsonb :routes
      t.jsonb :operators
      t.jsonb :facilities

      t.timestamps
    end
  end
end

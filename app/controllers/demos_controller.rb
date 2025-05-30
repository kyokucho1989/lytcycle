class DemosController < ApplicationController
  def new
    if user_signed_in?
      redirect_to new_user_simulation_path(current_user.id)
      return
    end
    @simulation = Simulation.new
    render 'simulations/demo'
  end
end

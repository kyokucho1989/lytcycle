class DemosController < ApplicationController
  def new
    redirect_to new_user_simulation_path(current_user.id) if user_signed_in?
    @simulation = Simulation.new
    render 'simulations/demo'
  end
end

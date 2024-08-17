class SimulationsController < ApplicationController
  before_action :authenticate_user!, except: :demo
  def index
    @simulations = Simulation.all
  end

  def demo
    if user_signed_in?
      redirect_to new_user_simulation_path(current_user.id)
    end
  end

  def new

  end
end

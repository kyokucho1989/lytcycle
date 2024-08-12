class SimulationsController < ApplicationController
  before_action :authenticate_user!
  def index
    @simulations = Simulation.all
  end
end

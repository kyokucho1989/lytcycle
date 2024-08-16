class SimulationsController < ApplicationController
  before_action :authenticate_user! except: :new
  def index
    @simulations = Simulation.all
  end

  def new

  end
end

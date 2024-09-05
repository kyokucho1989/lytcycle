class SimulationsController < ApplicationController
  before_action :authenticate_user!, except: :demo
  before_action :set_simulation, only: %i[show edit update destroy]

  def index
    @simulations = Simulation.all
  end

  def demo
    redirect_to new_user_simulation_path(current_user.id) if user_signed_in?
    @simulation = Simulation.new
  end

  def edit
    respond_to do |format|
      format.html
      format.json { render json: @simulation }
    end
  end

  def new
    @simulation = Simulation.new
  end

  def show
    respond_to do |format|
      format.html
      format.json { render json: @simulation }
    end
  end

  def create
    @simulation = Simulation.new(simulation_params)
    @simulation.user_id = current_user.id
    respond_to do |format|
      if @simulation.save
        format.html { redirect_to user_simulations_url, notice: 'Simurate was successfully created.' }
        format.json { render json: { status: :ok, location: user_simulations_url } }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @simulation.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @simulation.update(simulation_params)
        format.html { redirect_to user_simulations_url, notice: 'Simurate was successfully updated.' }
        format.json { render :show, status: :ok, location: @simulation }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @simulation.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @simulation.destroy

    respond_to do |format|
      format.html { redirect_to user_simulations_url, notice: 'Simurate was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_simulation
    @simulation = Simulation.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def simulation_params
    routes = params.require(:js_routes)
    facilities = params.require(:js_facilities)
    operators = params.require(:js_operators)
    params.require(:simulation)[:facilities] = facilities
    params.require(:simulation)[:operators] = operators
    params.require(:simulation)[:routes] = routes
    params.require(:simulation).permit(:user_id, :title, :bottleneck_process, :waiting_time, :routes, :operators,
                                       :facilities)
  end
end

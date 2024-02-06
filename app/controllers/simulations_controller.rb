class SimulationsController < ApplicationController
  before_action :set_simulation, only: %i[ show edit update destroy ]

  # GET /simulations or /simulations.json
  def index
    @simulations = Simulation.all
  end

  # GET /simulations/1 or /simulations/1.json
  def show
  end

  # GET /simulations/new
  def new
    @simulation = Simulation.new
  end

  # GET /simulations/1/edit
  def edit
  end

  # POST /simulations or /simulations.json
  def create
    @simulation = Simulation.new(simulation_params)

    respond_to do |format|
      if @simulation.save
        format.html { redirect_to simulation_url(@simulation), notice: "Simulation was successfully created." }
        format.json { render :show, status: :created, location: @simulation }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @simulation.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /simulations/1 or /simulations/1.json
  def update
    respond_to do |format|
      if @simulation.update(simulation_params)
        format.html { redirect_to simulation_url(@simulation), notice: "Simulation was successfully updated." }
        format.json { render :show, status: :ok, location: @simulation }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @simulation.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /simulations/1 or /simulations/1.json
  def destroy
    @simulation.destroy

    respond_to do |format|
      format.html { redirect_to simulations_url, notice: "Simulation was successfully destroyed." }
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
      params.require(:simulation).permit(:name)
    end
end

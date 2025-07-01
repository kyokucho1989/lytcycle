class SimulationsController < ApplicationController
  before_action :authenticate_user!, except: :new
  before_action :set_simulation, only: %i[edit update destroy]

  def index
    @simulations = current_user.simulations.order(:id)
  end

  def edit
    respond_to do |format|
      format.html
    end
  end

  def new
    @simulation = Simulation.new
  end

  def show
    redirect_to simulations_path
  end

  def create
    @simulation = current_user.simulations.new(simulation_params)
    respond_to do |format|
      if @simulation.save
        flash[:notice] = 'シミュレーションが作成されました。'
        format.html
      else
        format.html { render :new, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @simulation.update(simulation_params)
        flash[:notice] = 'シミュレーションが更新されました。'
        format.html
      else
        format.html { render :edit, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @simulation.destroy
    respond_to do |format|
      format.html { redirect_to simulations_url, notice: 'シミュレーションが削除されました。' }
    end
  end

  private

  def set_simulation
    @simulation = current_user.simulations.find(params[:id])
  end

  def simulation_params
    params.require(:simulation).permit(:user_id, :title, :bottleneck_process, :waiting_time, :routes, :operators,
                                       :facilities, :cycle_time)
  end
end

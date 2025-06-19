class SimulationsController < ApplicationController
  before_action :authenticate_user!, except: :new
  before_action :set_simulation, only: %i[edit update destroy]
  before_action :correct_user

  def index
    @simulations = current_user.simulations.order(:id)
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

  # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
  def create
    @simulation = current_user.simulations.new(simulation_params)
    respond_to do |format|
      if @simulation.save
        flash[:notice] = 'シミュレーションが作成されました。'
        format.html
        format.json { render json: { status: :ok, location: user_simulations_url } }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @simulation.errors, status: :unprocessable_entity }
      end
    end
  end

  # rubocop:enable Metrics/MethodLength, Metrics/AbcSize
  def update
    respond_to do |format|
      if @simulation.update(simulation_params)
        flash[:notice] = 'シミュレーションが更新されました。'
        format.html
        format.json { render json: { status: :ok, location: user_simulations_url } }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: { status: 'error', errors: @simulation.errors.full_messages }, status: :ok }
      end
    end
  end

  def destroy
    @simulation.destroy
    respond_to do |format|
      format.html { redirect_to user_simulations_url, notice: 'シミュレーションが削除されました。' }
      format.json { head :no_content }
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

  def correct_user
    @user = User.find(params[:user_id])
    return unless @user != current_user

    flash[:alert] = '他のユーザーのページにはアクセスできません。'
    redirect_to(root_url)
  end
end

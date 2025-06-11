class SimulationsController < ApplicationController
  before_action :authenticate_user!, except: :new
  before_action :set_simulation, only: %i[edit update destroy]
  before_action :correct_user

  def index
    @simulations = Simulation.all
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

  def create
    @simulation = Simulation.new(simulation_params)
    @simulation.user_id = current_user.id
    respond_to do |format|
      if @simulation.save
        create_success_response(format)
      else
        create_failure_response(format)
      end
    end
  end

  def update
    respond_to do |format|
      if @simulation.update(simulation_params)
        flash[:notice] = 'シミュレーションが更新されました。'
        format.html {}
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

  # Use callbacks to share common setup or constraints between actions.
  def set_simulation
    @simulation = Simulation.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def simulation_params
    params.require(:simulation).permit(:user_id, :title, :bottleneck_process, :waiting_time, :routes, :operators,
                                       :facilities, :cycle_time)
  end

  def create_success_response(format)
    flash[:notice] = 'シミュレーションが作成されました。'
    format.html {}
    format.json { render json: { status: :ok, location: user_simulations_url } }
  end

  def create_failure_response(format)
    format.html { render :new, status: :unprocessable_entity }
    format.json { render json: @simulation.errors, status: :unprocessable_entity }
  end

  def correct_user
    @user = User.find(params[:user_id])
    return unless @user != current_user

    flash[:alert] = '他のユーザーのページにはアクセスできません。'
    redirect_to(root_url)
  end
end

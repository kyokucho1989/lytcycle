class SimuratesController < ApplicationController
  before_action :set_simurate, only: %i[ show edit update destroy ]

  # GET /simurates or /simurates.json
  def index
    @simurates = Simurate.all
  end

  # GET /simurates/1 or /simurates/1.json
  def show
  end

  # GET /simurates/new
  def new
    @simurate = Simurate.new
  end

  # GET /simurates/1/edit
  def edit
  end

  # POST /simurates or /simurates.json
  def create
    @simurate = Simurate.new(simurate_params)

    respond_to do |format|
      if @simurate.save
        format.html { redirect_to simurate_url(@simurate), notice: "Simurate was successfully created." }
        format.json { render :show, status: :created, location: @simurate }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @simurate.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /simurates/1 or /simurates/1.json
  def update
    respond_to do |format|
      if @simurate.update(simurate_params)
        format.html { redirect_to simurate_url(@simurate), notice: "Simurate was successfully updated." }
        format.json { render :show, status: :ok, location: @simurate }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @simurate.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /simurates/1 or /simurates/1.json
  def destroy
    @simurate.destroy

    respond_to do |format|
      format.html { redirect_to simurates_url, notice: "Simurate was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_simurate
      @simurate = Simurate.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def simurate_params
      params.require(:simurate).permit(:title, :content)
    end
end

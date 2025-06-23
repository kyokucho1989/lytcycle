class WelcomesController < ApplicationController
  def show
    redirect_to simulations_path(current_user.id) if user_signed_in?
  end
end

class WelcomeController < ApplicationController
  def index
    redirect_to user_simulations_path(current_user.id) if user_signed_in?
  end
end

Rails.application.routes.draw do
  resource :privacies, only: [:show]
  resource :welcomes, only: [:show]

  devise_for :users
  resources :simulations
  resource :demo, only: [:new]
  resource :term, only: [:show]
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "welcomes#show"
end

Rails.application.routes.draw do
  devise_for :users
  resources :users do
    resources :simulations
  end
  resources :simurates
  get 'demo' , to: 'simulations#demo'

  resource :term, only: [:show]
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "simurates#index"
end

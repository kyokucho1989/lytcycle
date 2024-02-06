Rails.application.routes.draw do
  resources :simulations
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  root "simulations#index"
end

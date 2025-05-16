Rails.application.routes.draw do
  get 'pages/privacy'
  get 'welcome/index'
  devise_for :users
  resources :users do
    resources :simulations, except: :show
  end
  resources :simurates
  get 'demo' , to: 'simulations#demo'
  resource :term, only: [:show]
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "welcome#index"
end

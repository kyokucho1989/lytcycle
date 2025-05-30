Rails.application.routes.draw do
  resource :privacy, only: [:show], controller: 'pages'
  resource :welcome, only: [:index], controller: 'welcome'

  devise_for :users
  resources :users do
    resources :simulations, except: :show
  end
  resource :demo, only: [:new]

  resource :term, only: [:show]
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "welcome#index"
end

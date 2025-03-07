Rails.application.routes.draw do
  devise_for :users,
             controllers: {
               sessions: 'api/v1/sessions',
               registrations: 'api/v1/registrations'
             },
             defaults: { format: :json }
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      resources :chat_rooms do
        member do
          post :join
          delete :leave
        end
        resources :messages, only: [:index, :create]
      end
    end
  end

  mount ActionCable.server => '/cable'

  # Defines the root path route ("/")
  # root "posts#index"
end

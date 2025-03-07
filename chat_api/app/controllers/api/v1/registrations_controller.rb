module Api
  module V1
    class RegistrationsController < Devise::RegistrationsController
      respond_to :json
      include RackSessionFixController

      private

      def respond_with(resource, _opts = {})
        if resource.persisted?
          render json: {
            status: { code: 200, message: 'Signed up successfully' },
            data: {
              user: {
                id: resource.id,
                email: resource.email,
                username: resource.username
              },
              token: request.env['warden-jwt_auth.token']
            }
          }
        else
          render json: {
            status: { message: 'User could not be created' },
            errors: resource.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
    end
  end
end
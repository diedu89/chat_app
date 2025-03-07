module Api
  module V1
    class SessionsController < Devise::SessionsController
      respond_to :json
      skip_before_action :verify_signed_out_user

      include RackSessionFixController

      private

      def respond_with(resource, _opts = {})
        token = request.env['warden-jwt_auth.token']
        render json: {
          status: { code: 200, message: 'Logged in successfully' },
          data: {
            token: token,
            user: {
              id: resource.id,
              email: resource.email
            }
          }
        }
      end

      def respond_to_on_destroy
        head :no_content
      end
    end
  end
end
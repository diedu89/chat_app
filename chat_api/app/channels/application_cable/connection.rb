module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      header = request.headers[:HTTP_AUTHORIZATION]
      token = header&.split(' ')&.last&.strip

      return reject_unauthorized_connection if token.blank?

      decoded_token = JWT.decode(
        token,
        Rails.application.credentials.fetch(:secret_key_base),
        true,
        { algorithm: 'HS256' }
      ).first

      User.find(decoded_token['sub'])
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      reject_unauthorized_connection
    end
  end
end
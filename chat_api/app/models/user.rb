class User < ApplicationRecord
  # Devise configuration
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  # Chat relationships
  has_many :chat_room_users
  has_many :chat_rooms, through: :chat_room_users
  has_many :messages, foreign_key: :sender_id
end

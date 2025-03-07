class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  validates :username, presence: true, uniqueness: { case_sensitive: false }
  validates :username, format: { with: /\A[a-zA-Z0-9_\.]*\z/, message: "can only contain letters, numbers, dots and underscores" }
  validates :username, length: { minimum: 3, maximum: 30 }

  has_many :chat_room_users
  has_many :chat_rooms, through: :chat_room_users
  has_many :messages, foreign_key: :sender_id
end

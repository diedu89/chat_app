class ChatRoom < ApplicationRecord
  has_many :messages
  has_many :chat_room_users
  has_many :users, through: :chat_room_users
  validates :name, presence: true
end
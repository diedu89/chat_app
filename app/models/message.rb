class Message < ApplicationRecord
  belongs_to :sender, class_name: 'User'
  belongs_to :chat_room
  validates :content, presence: true
end
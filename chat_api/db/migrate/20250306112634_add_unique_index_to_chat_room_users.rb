class AddUniqueIndexToChatRoomUsers < ActiveRecord::Migration[8.0]
  def change
    add_index :chat_room_users, [:user_id, :chat_room_id], unique: true
  end
end

class ChatRoomChannel < ApplicationCable::Channel
  def subscribed
    stream_from "chat_room_#{params[:chat_room_id]}"
  end

  def receive(data)
    message = Message.create!(
      content: data['content'],
      chat_room_id: params[:chat_room_id],
      sender: current_user
    )
    
    ActionCable.server.broadcast(
      "chat_room_#{params[:chat_room_id]}", 
      { type: 'new_message', message: message.as_json(include: { sender: { only: [:id, :username] } }) }
    )
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
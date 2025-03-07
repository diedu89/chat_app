class ChatRoomChannel < ApplicationCable::Channel
  def subscribed
    @chat_room = ChatRoom.find(params[:chat_room_id])
    stream_for @chat_room
    transmit({ type: 'confirm_subscription', message: "Connected to chat room #{@chat_room.name}" })
  end

  def receive(data)
    MessageSerializer.new(data).as_json
    ChatRoomChannel.broadcast_to(
      @chat_room,
      {
        type: 'message',
        message: data
      }
    )
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  private

  def serialize_message(message)
    {
      id: message.id,
      content: message.content,
      sender: {
        id: message.sender.id,
        email: message.sender.email
      },
      created_at: message.created_at
    }
  end
end
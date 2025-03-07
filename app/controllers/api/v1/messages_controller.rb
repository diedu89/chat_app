module Api
  module V1
    class MessagesController < ApplicationController
      before_action :authenticate_user!
      before_action :set_chat_room
      before_action :ensure_member

      def index
        @messages = @chat_room.messages.includes(:sender).order(created_at: :desc)
        render json: @messages
      end

      def create
        @message = @chat_room.messages.build(message_params)
        @message.sender = current_user

        if @message.save
          ChatRoomChannel.broadcast_to(
            @chat_room,
            {
              type: 'message',
              message: MessageSerializer.new(@message).as_json
            }
          )
          render json: @message, status: :created
        else
          render json: { errors: @message.errors.full_messages }, 
                 status: :unprocessable_entity
        end
      end

      private

      def set_chat_room
        @chat_room = ChatRoom.find(params[:chat_room_id])
      end

      def ensure_member
        unless @chat_room.users.include?(current_user)
          render json: { error: 'You must be a member of this chat room' }, 
                 status: :forbidden
        end
      end

      def message_params
        params.require(:message).permit(:content)
      end
    end
  end
end
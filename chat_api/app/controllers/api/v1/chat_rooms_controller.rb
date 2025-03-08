module Api
  module V1
    class ChatRoomsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_chat_room, only: [:show, :join, :leave]

      def index
        @chat_rooms = ChatRoom.all
        render json: @chat_rooms.map { |room|
          room.as_json.merge(
            is_member: room.users.include?(current_user),
            members_count: room.users.count
          )
        }
      end

      def create
        @chat_room = ChatRoom.new(chat_room_params)
        
        if @chat_room.save
          @chat_room.chat_room_users.create(user: current_user)
          render json: room_with_metadata(@chat_room), status: :created
        else
          render json: { errors: @chat_room.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def show
        render json: room_with_metadata(@chat_room)
      end

      def join
        @chat_room.chat_room_users.create(user: current_user)
        render json: room_with_metadata(@chat_room)
      rescue ActiveRecord::RecordNotUnique
        render json: { error: 'Already a member' }, status: :unprocessable_entity
      end

      def leave
        if @chat_room.chat_room_users.find_by(user: current_user)&.destroy
          render json: room_with_metadata(@chat_room)
        else
          head :no_content
        end
      end

      private

      def set_chat_room
        @chat_room = ChatRoom.find(params[:id])
      end

      def chat_room_params
        params.require(:chat_room).permit(:name)
      end

      def room_with_metadata(room)
        room.as_json.merge(
          is_member: room.users.include?(current_user),
          members_count: room.users.count
        )
      end
    end
  end
end
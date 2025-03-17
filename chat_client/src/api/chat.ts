import { apiClient } from "../utils/apiClient";
import { ChatRoom } from "../types/chat";
import { Subscription } from "@rails/actioncable";

export const fetchChatRooms = (): Promise<ChatRoom[]> => {
  return apiClient.get("/chat_rooms");
};

export const createChatRoom = (name: string): Promise<ChatRoom> => {
  return apiClient.post("/chat_rooms", { chat_room: { name } });
};

export interface Message {
  id: number;
  content: string;
  sender: {
    id: number;
    username: string;
  };
  created_at: string;
}

export const fetchMessages = (roomId: number): Promise<Message[]> => {
  return apiClient.get(`/chat_rooms/${roomId}/messages`);
};

export const createMessage = async (
  subscription: Subscription,
  content: string
): Promise<void> => {
  subscription.send({ content });
};

export const joinChannel = (roomId: number): Promise<ChatRoom> => {
  return apiClient.post(`/chat_rooms/${roomId}/join`);
};

import { ChatRoom } from "../types/chat";
import Cookies from "js-cookie";

export const fetchChatRooms = async (): Promise<ChatRoom[]> => {
  const response = await fetch("http://localhost:3000/api/v1/chat_rooms", {
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("auth") || "{}").token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch chat rooms");
  }

  return response.json();
};

export const createChatRoom = async (name: string): Promise<ChatRoom> => {
  const response = await fetch("http://localhost:3000/api/v1/chat_rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(Cookies.get("auth") || "{}").token}`,
    },
    body: JSON.stringify({
      chat_room: {
        name,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create chat room");
  }

  return response.json();
};

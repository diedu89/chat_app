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

export interface Message {
  id: number;
  content: string;
  sender: {
    id: number;
    username: string;
  };
  created_at: string;
}

export const fetchMessages = async (roomId: number): Promise<Message[]> => {
  const response = await fetch(
    `http://localhost:3000/api/v1/chat_rooms/${roomId}/messages`,
    {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(Cookies.get("auth") || "{}").token
        }`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  return response.json();
};

export const createMessage = async (
  roomId: number,
  content: string
): Promise<Message> => {
  const response = await fetch(
    `http://localhost:3000/api/v1/chat_rooms/${roomId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(Cookies.get("auth") || "{}").token
        }`,
      },
      body: JSON.stringify({
        message: {
          content,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
};

export const joinChannel = async (roomId: number): Promise<ChatRoom> => {
  const response = await fetch(
    `http://localhost:3000/api/v1/chat_rooms/${roomId}/join`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(Cookies.get("auth") || "{}").token
        }`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to join channel");
  }

  return response.json();
};

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { Subscription } from "@rails/actioncable";
import { AUTH_COOKIE_NAME } from "../constants/auth";
import {
  fetchChatRooms,
  createChatRoom,
  fetchMessages,
  createMessage,
  Message,
  joinChannel,
} from "../api/chat";
import { ChatRoom } from "../types/chat";
import consumer from "../utils/cable";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSubscription, setActiveSubscription] =
    useState<Subscription | null>(null);

  const handleReceivedMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const subscribeToChannel = useCallback(
    (roomId: number) => {
      const subscription = consumer.subscriptions.create(
        { channel: "ChatRoomChannel", chat_room_id: roomId },
        {
          received: (message: { type: string; message: Message }) => {
            if (message.type === "new_message") {
              handleReceivedMessage(message.message);
            }
          },
          connected: () => {
            console.log(`Connected to room ${roomId}`);
            setActiveSubscription(subscription);
          },
          disconnected: () => {
            console.log(`Disconnected from room ${roomId}`);
            setActiveSubscription(null);
          },
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    },
    [handleReceivedMessage]
  );

  useEffect(() => {
    if (selectedRoom) {
      const unsubscribe = subscribeToChannel(selectedRoom.id);
      return () => {
        unsubscribe();
      };
    }
  }, [selectedRoom, subscribeToChannel]);

  useEffect(() => {
    const loadChatRooms = async () => {
      try {
        const rooms = await fetchChatRooms();
        setChatRooms(rooms);
      } catch (err) {
        setError("Failed to load chat rooms");
        console.error("Error loading chat rooms:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatRooms();
  }, []);

  const handleLogout = () => {
    Cookies.remove(AUTH_COOKIE_NAME);
    window.location.reload();
  };

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newRoom = await createChatRoom(newChannelName);
      setChatRooms((prevRooms) => [...prevRooms, newRoom]);
      setNewChannelName("");
      setIsCreatingChannel(false);
    } catch (err) {
      setError("Failed to create channel");
      console.error("Error creating channel:", err);
    }
  };

  const handleChannelSelect = async (room: ChatRoom) => {
    try {
      if (!room.is_member) {
        await joinChannel(room.id);
        // Update the room's is_member status in the local state
        setChatRooms((prevRooms) =>
          prevRooms.map((r) =>
            r.id === room.id ? { ...r, is_member: true } : r
          )
        );
      }

      setSelectedRoom(room);
      const messages = await fetchMessages(room.id);
      setMessages(messages);
      setIsSidebarOpen(false);
    } catch (err) {
      setError("Failed to load messages");
      console.error("Error loading messages:", err);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!selectedRoom || !message.trim()) return;

    try {
      // Use the active subscription to send the message
      if (activeSubscription) {
        await createMessage(activeSubscription, message.trim());
        setMessage("");
      }
    } catch (err) {
      setError("Failed to send message");
      console.error("Error sending message:", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen relative">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 w-64 bg-gray-800 text-gray-100
        transform transition-transform duration-300 ease-in-out z-30 lg:z-auto
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full p-4 border-b border-gray-700 !bg-gray-800 transition-colors flex items-center justify-between"
          >
            <h2 className="text-xl font-bold">WorkSpace Name</h2>
            <svg
              className={`w-5 h-5 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div
            className={`absolute w-full bg-gray-800 border-gray-700 shadow-lg transition-all duration-200 z-50 ${
              isDropdownOpen
                ? "opacity-100 translate-y-0 border-b"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            <button
              onClick={handleLogout}
              className="w-full p-4 text-left text-gray-300 !bg-gray-800 transition-colors flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
        <div className="p-4 relative">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Channels
            </h3>
            <button
              onClick={() => setIsCreatingChannel(true)}
              className="text-gray-400 hover:text-gray-200 !p-1"
              title="Create Channel"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>

          {isCreatingChannel && (
            <form
              onSubmit={handleCreateChannel}
              className="absolute left-0 right-0 bg-gray-800 p-2 rounded shadow-lg z-50"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newChannelName}
                  onChange={(e) => {
                    const input = e.target;
                    const start = input.selectionStart || 0;

                    const value = input.value;
                    const kebabCase = value
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "");

                    setNewChannelName(kebabCase);

                    requestAnimationFrame(() => {
                      const newPosition =
                        start - (value.length - kebabCase.length);
                      input.setSelectionRange(newPosition, newPosition);
                    });
                  }}
                  className="flex-1 min-w-0 px-2 py-1 text-sm rounded bg-gray-700 text-white border-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="channel-name"
                  autoFocus
                />
                <button
                  type="submit"
                  className="flex-shrink-0 px-2 py-1 text-xs !bg-blue-500 text-white rounded hover:bg-blue-600 !p-1"
                >
                  Save
                </button>
              </div>
            </form>
          )}

          <div className="space-y-1">
            {isLoading ? (
              <div className="text-gray-400 text-sm">Loading channels...</div>
            ) : error ? (
              <div className="text-red-400 text-sm">{error}</div>
            ) : (
              chatRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => handleChannelSelect(room)}
                  className={`flex items-center justify-between p-2 rounded hover:bg-gray-700 cursor-pointer ${
                    selectedRoom?.id === room.id ? "bg-gray-700" : ""
                  }`}
                >
                  <span className="text-gray-300"># {room.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-700">
        {/* Add mobile menu button */}
        <div className="p-4 border-b border-gray-600 bg-gray-800">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="mr-4 lg:hidden text-gray-400 hover:text-white !p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-100">
              # {selectedRoom?.name || "Select a channel"}
            </h2>
            {selectedRoom && (
              <span className="ml-2 text-sm text-gray-400">
                {/* TODO: Add member count */}3 members
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedRoom ? (
            messages
              .sort(
                (a, b) =>
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime()
              )
              .map((msg) => (
                <div key={msg.id} className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-semibold">
                    {msg.sender?.username[0]}
                  </div>
                  <div className="ml-4">
                    <div className="flex items-baseline">
                      <span className="font-semibold text-white">
                        {msg.sender?.username}
                      </span>
                      <span className="ml-2 text-xs text-gray-400">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-100">{msg.content}</p>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center text-gray-400 mt-10">
              Select a channel to start chatting
            </div>
          )}
        </div>

        {selectedRoom && (
          <div className="p-4 bg-gray-800">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                placeholder={`Message #${selectedRoom.name}`}
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="px-6 py-2 !bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

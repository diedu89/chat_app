import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { AUTH_COOKIE_NAME } from "../constants/auth";
import { fetchChatRooms, createChatRoom } from "../api/chat";
import { ChatRoom } from "../types/chat";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");

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

  // Dummy messages
  const messages = [
    { id: 1, user: "John", content: "Hey everyone!", time: "12:00 PM" },
    { id: 2, user: "Alice", content: "Hello! How are you?", time: "12:01 PM" },
    {
      id: 3,
      user: "Bob",
      content: "Working on the new features!",
      time: "12:05 PM",
    },
  ];

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-800 text-gray-100">
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
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-700 cursor-pointer"
                >
                  <span className="text-gray-300"># {room.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-700">
        <div className="p-4 border-b border-gray-600 bg-gray-800">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-100"># general</h2>
            <span className="ml-2 text-sm text-gray-400">3 members</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-semibold">
                {msg.user[0]}
              </div>
              <div className="ml-4">
                <div className="flex items-baseline">
                  <span className="font-semibold text-white">{msg.user}</span>
                  <span className="ml-2 text-xs text-gray-400">{msg.time}</span>
                </div>
                <p className="text-gray-100">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-800">
          <div className="flex space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="Message #general"
            />
            <button className="px-6 py-2 bg-blue-500 text-gray-900 font-medium rounded-lg hover:bg-blue-600 transition-colors">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import Cookies from "js-cookie";
import { AUTH_COOKIE_NAME } from "../constants/auth";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove(AUTH_COOKIE_NAME);
    window.location.reload();
  };

  // Dummy data for chat list
  const chats = [
    { id: 1, name: "# general", unread: 3 },
    { id: 2, name: "# random", unread: 0 },
    { id: 3, name: "🤝 team-chat", unread: 5 },
    { id: 4, name: "💡 ideas", unread: 0 },
  ];

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
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Channels
          </h3>
          <div className="space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center justify-between p-2 rounded hover:bg-gray-700 cursor-pointer"
              >
                <span className="text-gray-300">{chat.name}</span>
                {chat.unread > 0 && (
                  <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                    {chat.unread}
                  </span>
                )}
              </div>
            ))}
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

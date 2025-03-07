import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

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
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">WorkSpace Name</h2>
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
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

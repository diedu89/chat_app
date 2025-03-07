import { useEffect, useState } from "react";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Cookies from "js-cookie";
import "./App.css";
import { AuthData } from "./types/auth";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = JSON.parse(Cookies.get("auth") || "{}") as AuthData;
    setIsAuthenticated(!!auth.token);
  }, []);

  return <>{isAuthenticated ? <Chat /> : <Login />}</>;
}

export default App;

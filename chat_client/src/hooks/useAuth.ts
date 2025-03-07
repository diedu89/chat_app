import { useState } from "react";
import Cookies from "js-cookie";
import { signup, login } from "../api/auth";
import { AuthData } from "../types/auth";
import { AUTH_COOKIE_NAME } from "../constants/auth";

interface UseAuthReturn {
  isLoading: boolean;
  error: string;
  handleAuth: (
    type: "login" | "signup",
    credentials: {
      email: string;
      password: string;
      username?: string;
    }
  ) => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (
    type: "login" | "signup",
    credentials: { email: string; password: string; username?: string }
  ) => {
    setError("");
    setIsLoading(true);

    try {
      const response = await (type === "login"
        ? login(credentials.email, credentials.password)
        : signup(
            credentials.email,
            credentials.password,
            credentials.username!
          ));

      if (response.status.code === 200 && response.data) {
        const authData: AuthData = {
          token: response.data.token,
          user: response.data.user,
        };
        Cookies.set(AUTH_COOKIE_NAME, JSON.stringify(authData));
        window.location.reload();
        return;
      }

      setError(response.errors?.[0] || `${type} failed. Please try again.`);
    } catch (err) {
      setError(`An error occurred during ${type}. Please try again.`);
      console.error(`${type} error:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, handleAuth };
}

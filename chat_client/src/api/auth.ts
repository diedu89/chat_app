interface AuthResponse {
  status: {
    code: number;
    message: string;
  };
  data: {
    user: {
      id: number;
      email: string;
      username: string;
    };
    token: string;
  };
  errors?: string[];
}

export const signup = async (
  email: string,
  password: string,
  username: string
): Promise<AuthResponse> => {
  const response = await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: {
        email,
        password,
        username,
      },
    }),
  });

  return response.json() as Promise<AuthResponse>;
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch("http://localhost:3000/users/sign_in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: {
        email,
        password,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      status: {
        code: response.status,
        message: "Login failed",
      },
      data: {
        user: {
          id: 0,
          email: "",
          username: "",
        },
        token: "",
      },
      errors: data.errors || ["Invalid email or password"],
    };
  }

  return data;
};

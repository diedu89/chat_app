export interface AuthData {
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
  };
}

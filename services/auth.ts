import { API_URL } from "@/config";
import axios from "axios";

export interface AuthResponse {
  jwt: string;
  user: {
    name: string;
    email: string;
    [key: string]: any;
  };
}

class AuthServiceClass {
  private api = axios.create({
    baseURL: API_URL,
  });

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await this.api.post<AuthResponse>("/login.php", {
      email,
      password,
    });
    return res.data;
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const res = await this.api.post<AuthResponse>("/register", {
      name,
      email,
      password,
    });
    return res.data;
  }
}

export const AuthService = new AuthServiceClass();

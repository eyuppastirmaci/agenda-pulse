import axios from "axios";

const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export async function signup(email: string, password: string) {
  const response = await authApi.post("/api/auth/signup", {
    email,
    password,
  });
  return response.data;
}

export async function checkHealth() {
  const response = await authApi.get("/actuator/health");
  return response.data;
}

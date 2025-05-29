import api from "./api";

interface SignupProps {
    name: string;
    email: string;
    password: string;
    photo_url: string;
}

interface LoginProps {
    email: string;
    password: string;
}


const signup = async (data:SignupProps) => {
  try {
    const response = await api.post("/auth/sign-up", data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

const login = async (data:LoginProps) => {
  try {
    const response = await api.post("/auth", data);
    const token = response.data.token;
    localStorage.setItem("authToken", token);
    return response.data;
  } catch (error) {
    throw error;
  }
}

const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return !!token; // Retorna true se o token estiver presente, caso contrário, false
}

export { signup, login, isAuthenticated };
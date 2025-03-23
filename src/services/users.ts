import api from "./api";

interface ResetPasswordProps {
    email: string;
}


const listUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export { listUsers };
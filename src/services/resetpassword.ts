import api from "./api";

interface ResetPasswordProps {
    email: string;
}


const resetpassword = async (data:ResetPasswordProps) => {
  try {
    const response = await api.post("/resetpassword", data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default resetpassword;
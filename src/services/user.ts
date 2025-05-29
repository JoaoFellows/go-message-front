import { StaticImageData } from "next/image";
import api from "./api";

interface UserPropsGet {
    avatar: string | StaticImageData;
    name: string;
}

interface UserProps {
    name: string;
    photo: string | StaticImageData;
}


const getUserInfo = async () => {
  try {
    const response = await api.get("/users");
    const { avatar, name }: UserPropsGet = response.data;
    return { avatar, name };
  } catch (error) {
    throw error;
  }
}

const editUserInfo = async (data: UserProps) => {
  try {
    const response = await api.patch("/users", data); 
    return response.data;
  } catch (error) {
    console.error('Error editing user info:', error);
    throw error;
  }
}

export { getUserInfo, editUserInfo };
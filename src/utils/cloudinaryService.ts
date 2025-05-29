export const uploadToCloudinary = async (file: File): Promise<string | null> => {
    if (!file) return null;
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "gomessage"); // Defina isso no Cloudinary
  
    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dqixjhiy0/image/upload", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) throw new Error("Erro ao fazer upload");
  
      const data = await response.json();
      return data.secure_url; // Retorna a URL da imagem no Cloudinary
    } catch (error) {
      console.error("Erro no upload para Cloudinary:", error);
      return null;
    }
  };
  

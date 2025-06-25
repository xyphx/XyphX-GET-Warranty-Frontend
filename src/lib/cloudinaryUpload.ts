import axios from "axios";

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const folder = import.meta.env.VITE_CLOUDINARY_UPLOAD_FOLDER;

export const uploadToCloudinary = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );
    const imageUrl = response.data.secure_url;
    return imageUrl;
  } catch (error) {
    console.error("Cloudinary upload failed", error);
    return null;
  }
};

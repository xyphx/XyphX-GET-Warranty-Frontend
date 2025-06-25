import API from "@/api/axios";

export interface ProfileData {
  profile: any;
  name: any;
  email: string;
  phone: string;
  location: string;
  jobTitle: string;
  company: string;
  website: string;
  imageUrl: string;
}

export const updateProfile = async (profile: ProfileData) => {
  const token = localStorage.getItem("accessToken");

  const res = await API.patch("/user/profile", profile, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data;
};

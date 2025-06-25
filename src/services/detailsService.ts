import API from "@/api/axios";

export const userDetails = async () => {
  const token = localStorage.getItem("accessToken");

  const res = await API.get("/user/details", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data;
};

import { refreshToken as getNewToken } from "@/services/authSevice";

const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

setInterval(() => {
  const token = getRefreshToken();
  if (!token) return;

  getNewToken(token).then((res) => {
    if (res) {
      localStorage.setItem("accessToken", res.accessToken);
    }
  }).catch((err) => {
    console.error("Failed to refresh token:", err);
  });
}, 10 * 60 * 10); // every 10 minutes

import API from "@/api/axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const addService = async (userId: string, serviceData: any) => {
  const res = await API.post(`/services/add/${userId}`, serviceData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const editService = async (
  userId: string,
  serviceId: string,
  serviceData: any
) => {
  const res = await API.put(
    `/services/update/${userId}/${serviceId}`,
    serviceData,
    { headers: getAuthHeaders() }
  );
  return res.data;
};

export const deleteService = async (userId: string, serviceId: string) => {
  const res = await API.delete(
    `/services/delete/${userId}/${serviceId}`,
    { headers: getAuthHeaders() }
  );
  return res.data;
};

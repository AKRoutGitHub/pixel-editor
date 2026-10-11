import api from "./api";

const register = async (userData) => {
  const response = await api.post("/users/register", userData);
  return response.data;
};

const login = async (credentials) => {
  const response = await api.post("/users/login", credentials);
  // console.log(response);
  // console.log(response.data);
  return response.data;
};

const refreshToken = async () => {
  const response = await api.post("/users/refresh-token");
  return response.data;
};

const logout = async () => {
  const response = await api.post("/users/logout");
  return response.data;
};

const authService = {
  register,
  login,
  refreshToken,
  logout,
};

export default authService;

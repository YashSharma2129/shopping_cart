import axios from "axios";

export const login = async (username, password) => {
  try {
    const response = await axios.post("https://fakestoreapi.com/auth/login", {
      username,
      password,
    });
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Invalid credentials");
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

import apiClient from "../../global/services/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Register
export const registerUser = async (fullName, email, password) => {
  return await apiClient.post("/auth/register", { fullName, email, password });
};

// Login
export const loginUser = async (email, password) => {
  const res = await apiClient.post("/auth/login", { email, password });

  const token = res.data?.data?.token;
  if (token) {
    await AsyncStorage.setItem("jwt", token);
  }

  return res;
};

// Logout
export const logoutUser = async () => {
  await AsyncStorage.removeItem("jwt");
};






//--------------------------------------------------------------------



// import apiClient from "../../global/services/apiClient";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export const registerUser = async (fullName, email, password) =>
//   await apiClient.post("/auth/register", { fullName, email, password });

// // Login → get token, save it
// export const loginUser = async (email, password) => {
//   const res = await apiClient.post("/auth/login", { email, password });
//   const token = res.data?.data?.token;
//   if (token) await AsyncStorage.setItem("jwt", token);
//   return res;
// };

// // Logout → remove token
// export const logoutUser = async () => {
//   await AsyncStorage.removeItem("jwt");
// };

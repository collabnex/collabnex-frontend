import axios from "axios";
import { API_BASE_URL } from "./env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// 🔐 attach JWT automatically
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("jwt");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;

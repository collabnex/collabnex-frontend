// // Single source of truth for API base URL
// // Change this value for different environments (dev/stage/prod)
// export const API_BASE_URL = 'http://localhost:8080/api';  this is the line which is not commented

// // export const API_BASE_URL = '192.168.1.6:8081';


import { Platform } from "react-native";

const API_BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:8080/api"
    : "http://192.168.1.6:8080/api";  // Works for both Android and iOS physical devices

export { API_BASE_URL };


import apiClient from "../../global/services/apiClient";

export const getCurrentUser = async () =>
    await apiClient.get("/auth/me");

import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add authorization token to requests if available
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token refresh on 401
let refreshPromise: Promise<string> | null = null;

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                try {
                    if (!refreshPromise) {
                        refreshPromise = (async () => {
                            const response = await axios.post(
                                `${API_BASE_URL}/users/refresh-token`,
                                {
                                    refreshToken,
                                },
                            );

                            const { accessToken, refreshToken: newRefreshToken } =
                                response.data;
                            localStorage.setItem("accessToken", accessToken);
                            localStorage.setItem("refreshToken", newRefreshToken);
                            return accessToken;
                        })().finally(() => {
                            refreshPromise = null;
                        });
                    }

                    const accessToken = await refreshPromise;

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return apiClient(originalRequest);
                } catch {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("userId");
                    window.location.href = "/login";
                }
            } else {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userId");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    },
);


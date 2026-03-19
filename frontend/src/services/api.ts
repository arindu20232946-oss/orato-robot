import axios from "axios";

const API = axios.create({
    baseURL: window.config.backendUrl,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            
            // Redirect to login only if not already there
            if (window.location.pathname !== "/signin" && window.location.pathname !== "/login") {
                window.location.href = "/signin";
            }
        }
        return Promise.reject(error);
    }
);

export default API;
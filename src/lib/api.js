import axios from "axios";
import { toast } from "react-toastify";

/**
 * Normalized API Base URL:
 * Strips all trailing slashes so concatenations like `${API_BASE_URL}/api/...`
 * or `api.get("/api/...")` can NEVER produce a double slash `//`.
 */
const rawBaseUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_SERVER_URL ||
  import.meta.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:8000";

export const API_BASE_URL = (rawBaseUrl || "").toString().trim().replace(/\/+$/, "");

/**
 * Pre-configured Axios instance
 * - 60-second timeout to accommodate Render free-tier cold starts
 * - Credentials included for cross-domain cookie sessions
 * - Automatic Authorization header from localStorage token
 * - Cold-start detector: displays a friendly notification if request takes > 5 seconds
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let coldStartTimer = null;
let coldStartToastActive = false;
let pendingRequestsCount = 0;

const resetColdStartTimer = () => {
  if (coldStartTimer) {
    clearTimeout(coldStartTimer);
    coldStartTimer = null;
  }
  if (coldStartToastActive) {
    toast.dismiss("server-cold-start-toast");
    coldStartToastActive = false;
  }
};

api.interceptors.request.use(
  (config) => {
    // Ensure request path starts with exactly one single slash (if relative)
    if (config.url && !config.url.startsWith("http://") && !config.url.startsWith("https://")) {
      config.url = "/" + config.url.replace(/^\/+/, "");
    }

    // Attach Bearer token from localStorage if available
    try {
      const token = localStorage.getItem("token");
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // localStorage unavailable (e.g. strict sandbox)
    }

    // Start 5-second cold-start timer if not already active
    pendingRequestsCount++;
    if (!coldStartTimer) {
      coldStartTimer = setTimeout(() => {
        if (pendingRequestsCount > 0) {
          coldStartToastActive = true;
          toast.info("Server is waking up, please wait...", {
            toastId: "server-cold-start-toast",
            autoClose: 12000,
          });
        }
      }, 5000);
    }

    return config;
  },
  (error) => {
    pendingRequestsCount = Math.max(0, pendingRequestsCount - 1);
    if (pendingRequestsCount === 0) {
      resetColdStartTimer();
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    pendingRequestsCount = Math.max(0, pendingRequestsCount - 1);
    if (pendingRequestsCount === 0) {
      resetColdStartTimer();
    }
    return response;
  },
  (error) => {
    pendingRequestsCount = Math.max(0, pendingRequestsCount - 1);
    if (pendingRequestsCount === 0) {
      resetColdStartTimer();
    }
    return Promise.reject(error);
  }
);

export default api;

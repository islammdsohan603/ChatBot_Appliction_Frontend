import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../lib/api";
import {
  setUserData,
  setLoading,
  clearUser,
} from "../../redux/userSlice";

const useCurrentUser = () => {
  const dispatch = useDispatch();
  const { userData, isAuthenticated, isLoading, error } = useSelector(
    (state) => state.user,
  );
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch user profile on initial application mount
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const fetchUser = async () => {
      dispatch(setLoading(true));
      try {
        const response = await api.get("/api/user/current");
        const user = response.data;
        if (user) {
          try {
            localStorage.setItem("user", JSON.stringify(user));
          } catch {
            // ignore storage quota errors
          }
          dispatch(setUserData(user));
        } else {
          dispatch(setLoading(false));
        }
      } catch (err) {
        // 401 (unauthenticated) or 404 (user deleted) is normal for guests/expired sessions.
        // Clean up stale session data without spamming errors or causing redirect loops.
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } catch {
          // ignore
        }
        dispatch(clearUser());
      }
    };

    // If a token exists in localStorage or cookies, verify with the backend
    if (token || (typeof document !== "undefined" && document.cookie.includes("token="))) {
      fetchUser();
    } else {
      // Guest user: finish loading immediately
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return { userData, isAuthenticated, isLoading, error };
};

export default useCurrentUser;

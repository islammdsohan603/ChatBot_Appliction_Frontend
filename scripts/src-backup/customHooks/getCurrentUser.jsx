import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setUserData,
  setLoading,
  setError,
  clearUser,
} from "../../redux/userSlice";

const useCurrentUser = () => {
  const dispatch = useDispatch();
  const { userData, isAuthenticated, isLoading, error } = useSelector(
    (state) => state.user,
  );

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading(true));
      try {
        const serverUrl =
          import.meta.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
        const response = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });

        dispatch(setUserData(response.data));
      } catch (err) {
        dispatch(
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to fetch user",
          ),
        );
        dispatch(clearUser());
      }
    };

    if (!userData && !isAuthenticated) {
      fetchUser();
    } else {
      dispatch(setLoading(false));
    }
  }, [dispatch, userData, isAuthenticated]);

  return { userData, isAuthenticated, isLoading, error };
};

export default useCurrentUser;

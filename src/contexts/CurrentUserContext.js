import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router";

// Creating context for current user data and setCurrentUser function
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

// Custom hooks for accessing current user data and setCurrentUser function
export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

// Component for providing current user data and setCurrentUser function to child components
export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // State for holding current user data
  const history = useHistory(); // History object for navigation

  // Function to fetch current user data on component mount
  const handleMount = async () => {
    try {
      const { data } = await axiosRes.get("dj-rest-auth/user/");
      setCurrentUser(data); // Setting current user data in state
    } catch (err) {
      console.log(err);
    }
  };

  // Effect hook to fetch current user data on component mount
  useEffect(() => {
    handleMount();
  }, []);

  // Memoized effect hook to intercept axios requests and responses
  useMemo(() => {
    // Intercepting requests
    axiosReq.interceptors.request.use(
      async (config) => {
        try {
          await axios.post("/dj-rest-auth/token/refresh/");
        } catch (err) {
          setCurrentUser((prevCurrentUser) => {
            if (prevCurrentUser) {
              history.push("/signin"); // Redirecting to sign-in page if token refresh fails
            }
            return null;
          });
          return config;
        }
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );

    // Intercepting responses
    axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401) {
          try {
            await axios.post("/dj-rest-auth/token/refresh/");
          } catch (err) {
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                history.push("/signin"); // Redirecting to sign-in page if token refresh fails
              }
              return null;
            });
          }
          return axios(err.config);
        }
        return Promise.reject(err);
      }
    );
  }, [history]);

  // Providing current user data and setCurrentUser function to child components
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};

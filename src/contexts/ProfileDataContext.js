import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { followHelper, unfollowHelper } from "../utils/utils";

// Creating context for profile data and setProfileData function
const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

// Custom hooks for accessing profile data and setProfileData function
export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

// Component for providing profile data and setProfileData function to child components
export const ProfileDataProvider = ({ children }) => {
  // State for holding profile data
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
    popularProfiles: { results: [] },
  });

  // Custom hook for accessing current user data
  const currentUser = useCurrentUser();

  // Function to handle follow action
  const handleFollow = async (clickedProfile) => {
    try {
      // Sending follow request to the backend
      const { data } = await axiosRes.post("/followers/", {
        followed: clickedProfile.id,
      });

      // Updating profile data after successful follow
      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  // Function to handle unfollow action
  const handleUnfollow = async (clickedProfile) => {
    try {
      // Sending unfollow request to the backend
      await axiosRes.delete(`/followers/${clickedProfile.following_id}/`);

      // Updating profile data after successful unfollow
      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  // Effect hook to fetch popular profiles data on component mount or when current user changes
  useEffect(() => {
    const handleMount = async () => {
      try {
        // Fetching popular profiles data from the backend
        const { data } = await axiosReq.get(
          "/profiles/?ordering=-followers_count"
        );
        // Updating profile data with fetched popular profiles
        setProfileData((prevState) => ({
          ...prevState,
          popularProfiles: data,
        }));
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [currentUser]);

  // Providing profile data and setProfileData function to child components
  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider
        value={{ setProfileData, handleFollow, handleUnfollow }}
      >
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};

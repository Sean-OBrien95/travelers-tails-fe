import React from "react";
import { Container } from "react-bootstrap";
import appStyles from "../../App.module.css";
import Asset from "../../components/Asset";
import Profile from "./Profile";
import { useProfileData } from "../../contexts/ProfileDataContext";

const PopularProfiles = ({ mobile }) => {
  // Access popular profiles data using custom hook useProfileData
  const { popularProfiles } = useProfileData();

  return (
    <Container
      // Conditionally apply classes based on mobile prop
      className={`${appStyles.Content} ${
        mobile && "d-lg-none text-center mb-3"
      }`}
    >
      {popularProfiles.results.length ? (
        // Render popular profiles if data is available
        <>
          <p>Most followed profiles.</p>
          {mobile ? (
            // Display profiles in a row for mobile view
            <div className="d-flex justify-content-around">
              {popularProfiles.results.slice(0, 4).map((profile) => (
                <Profile key={profile.id} profile={profile} mobile />
              ))}
            </div>
          ) : (
            // Display profiles individually for desktop view
            popularProfiles.results.map((profile) => (
              <Profile key={profile.id} profile={profile} />
            ))
          )}
        </>
      ) : (
        // Display spinner if data is still loading
        <Asset spinner />
      )}
    </Container>
  );
};

export default PopularProfiles;

import { useState } from 'react';
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import signUpImage from "./assets/signupimage.jpg";
import SignInForm from "./pages/auth/SignInForm";
import PostCreateForm from "./pages/posts/PostCreateForm";
import PostPage from "./pages/posts/PostPage";
import PostsPage from "./pages/posts/PostsPage";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import PostEditForm from "./pages/posts/PostEditForm";
import ProfilePage from "./pages/profiles/ProfilePage";
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import Notification from './pages/notifications/Notifications';



function App() {
  // Get the current user from the context
  const currentUser = useCurrentUser();

  // Get the profile ID of the current user, or an empty string if no user is logged in
  const profile_id = currentUser?.profile_id || "";
  
  // State to control the display of the sign-up image
  const [showSignUpImage, setShowSignUpImage] = useState('none');

  return (
        <div className={styles.App}>
          {/* Sign up image */}
          <img
            src={signUpImage}
            style={{ display: showSignUpImage, position: 'absolute', width: '100vw', objectFit: 'cover', minHeight: 'calc(100vh + 105px)' }} alt="background"
          />
          <NavBar />
            <Container className={styles.Main}>
              <Switch>
                <Route
                exact
                path="/"
                render={() => (
                  <PostsPage message="No results found. Adjust the search keyword." />
                )}
              />
              <Route
                exact
                path="/feed"
                render={() => (
                  <PostsPage
                    message="No results found. Adjust the search keyword or follow a user."
                    filter={`owner__followed__owner__profile=${profile_id}&`}
                  />
                )}
              />
              <Route
                exact
                path="/liked"
                render={() => (
                  <PostsPage
                    message="No results found. Adjust the search keyword or like a post."
                    filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
                  />
                )}
              />
              <Route exact path="/signin" render={() => <SignInForm setShowSignUpImage={setShowSignUpImage} />} />
              <Route exact path="/signup" render={() => <SignUpForm setShowSignUpImage={setShowSignUpImage} />} />
              <Route exact path="/posts/create" render={() => <PostCreateForm />} />
              <Route exact path="/posts/:id" render={() => <PostPage />} />
              <Route exact path="/posts/:id/edit" render={() => <PostEditForm />} />
              <Route exact path="/profiles/:id" render={() => <ProfilePage />} />
              <Route
                exact
                path="/profiles/:id/edit/username"
               render={() => <UsernameForm />}
              />
              <Route
                exact
                path="/profiles/:id/edit/password"
                render={() => <UserPasswordForm />}
              />
              <Route
                exact
                path="/profiles/:id/edit"
                render={() => <ProfileEditForm />}
              />
              <Route exact 
                path="/notifications" 
                render={() => <Notification />}
              />
              <Route render={() => <p>Page not found!</p>} />
            </Switch>
          </Container>
        </div>
  );
}

export default App;
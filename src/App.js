import { useState } from 'react';
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import signUpImage from "./assets/signupimage.jpg";
import SignInForm from "./pages/auth/SignInForm";

function App() {
  const [showSignUpImage, setShowSignUpImage] = useState('none');

  return (
    <div className={styles.App}>
      <img
        src={signUpImage}
        style={{ display: showSignUpImage, position: 'absolute', width: '100vw', objectFit: 'cover', minHeight: 'calc(100vh + 105px)' }} alt="background"
      />
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route exact path="/" render={() => <h1>Home page</h1>} />
          <Route exact path="/signin" render={() => <SignInForm setShowSignUpImage={setShowSignUpImage} />} />
          <Route exact path="/signup" render={() => <SignUpForm setShowSignUpImage={setShowSignUpImage} />} />
          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { Form, Alert, Button, Container } from "react-bootstrap";
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";

function SignInForm({ setShowSignUpImage }) {
  // Effect hook to show or hide sign up image
  useEffect(() => {
    setShowSignUpImage('block');
    return () => setShowSignUpImage('none');
  }, [setShowSignUpImage]);

  const setCurrentUser = useSetCurrentUser();

  useRedirect("loggedIn");

  // State hook to manage sign in form data
  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });
  const { username, password } = signInData;

  const [errors, setErrors] = useState({});

  const history = useHistory();

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      setCurrentUser(data.user);
      // Navigate back to the previous page
      history.goBack();
    } catch (err) {
      // Set validation errors if request fails
      setErrors(err.response?.data);
    }
  };

  // Function to handle input change
  const handleChange = (event) => {
    // Update sign in data with new input value
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  // JSX for the sign in form
  return (
    <div className={styles.pageContainer}>
      <Container className={`${appStyles.Content} ${styles.formContainer}`}>
        <h1 className={styles.Header}>Sign In</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username">
            <Form.Control
              type="text"
              placeholder="Username"
              name="username"
              value={username}
              onChange={handleChange}
              className={styles.Input}
            />
          </Form.Group>
          {errors.username?.map((message, idx) => (
            <Alert key={idx} variant="warning">
              {message}
            </Alert>
          ))}
          <Form.Group controlId="password">
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleChange}
              className={styles.Input}
            />
          </Form.Group>
          {errors.password?.map((message, idx) => (
            <Alert key={idx} variant="warning">
              {message}
            </Alert>
          ))}
          <Button
            type="submit"
            className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
          >
            Sign In
          </Button>
          {/* Display non-field errors */}
          {errors.non_field_errors?.map((message, idx) => (
            <Alert key={idx} variant="warning" className="mt-3">
              {message}
            </Alert>
          ))}
        </Form>
        <div className={`mt-3 ${appStyles.Content}`}>
          <Link className={styles.Link} to="/signup">
            Don't have an account? <span>Sign up now!</span>
          </Link>
        </div>
      </Container>
    </div>
  );
}

export default SignInForm;

import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import {
  Form,
  Button,
  Container,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { useRedirect } from "../../hooks/useRedirect";

const SignUpForm = ({ setShowSignUpImage }) => {
  // Effect hook to show or hide sign up image
  useEffect(() => {
    setShowSignUpImage('block');
    // Cleanup function to hide sign up image when component unmounts or re-renders
    return () => setShowSignUpImage('none');
  }, [setShowSignUpImage]);

  useRedirect("loggedIn");

  // State hook to manage sign up form data
  const [signUpData, setSignUpData] = useState({
    username: "",
    password1: "",
    password2: "",
  });

  const { username, password1, password2 } = signUpData;

  const [errors, setErrors] = useState({});

  const history = useHistory();

  // Function to handle input change
  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/dj-rest-auth/registration/", signUpData);
      // Redirect to sign in page after successful sign up
      history.push("/signin");
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  // JSX for the sign up form
  return (
    <div className={styles.pageContainer}>
      <Container className={`${appStyles.Content} ${styles.formContainer}`}>
        <h1 className={styles.Header}>Sign Up</h1>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="username"
              value={username}
              onChange={handleChange}
            />
          </Form.Group>
          {errors.username?.map((message, idx) => (
            <Alert key={idx} variant="warning">
              {message}
            </Alert>
          ))}

          {/* Password input */}
          <Form.Group controlId="password1">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              name="password1"
              value={password1}
              onChange={handleChange}
            />
          </Form.Group>
          {/* Display password validation errors */}
          {errors.password1?.map((message, idx) => (
            <Alert key={idx} variant="warning">
              {message}
            </Alert>
          ))}

          <Form.Group controlId="password2">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              name="password2"
              value={password2}
              onChange={handleChange}
            />
          </Form.Group>
          {/* Display confirm password validation errors */}
          {errors.password2?.map((message, idx) => (
            <Alert key={idx} variant="warning">
              {message}
            </Alert>
          ))}

          <Button
            className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
            type="submit"
          >
            Sign Up
          </Button>
          {/* Display non-field errors */}
          {errors.non_field_errors?.map((message, idx) => (
            <Alert key={idx} variant="warning" className="mt-3">
              {message}
            </Alert>
          ))}
        </Form>
        <Link className={styles.Link} to="/signin">
          Already have an account? <span>Sign in</span>
        </Link>
      </Container>
    </div>
  );
};

export default SignUpForm;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { Form, Alert, Button, Container } from "react-bootstrap";
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";


function SignInForm({ setShowSignUpImage }) {
    useEffect(() => {
        setShowSignUpImage('block')
        return () => setShowSignUpImage('none');
      }, [setShowSignUpImage])
    const setCurrentUser = useSetCurrentUser();
    const [signInData, setSignInData] = useState({
    username: "",
    password: "",
    });
  const { username, password } = signInData;
  const [errors, setErrors] = useState({});
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const { data } = await axios.post("/dj-rest-auth/login/", signInData);
        setCurrentUser(data.user);
        history.push("/");
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

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

import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import { useCurrentUser, useSetCurrentUser } from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import axios from "axios";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";


// Functional component for rendering the navbar
const NavBar = () => {
  // Getting current user data and setCurrentUser function from context
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  // State and handler for toggling the navbar menu
  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  // Handler for user sign out
  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  // Navigation icon for adding a new post
  const addPostIcon = (
    <NavLink
      className={styles.NavLink}
      activeClassName={styles.Active}
      to="/posts/create"
    >
      <i class="fa-solid fa-plus"></i>Create
    </NavLink>
  );

  // Icons to display for logged-in users
  const loggedInIcons =
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/feed"
      >
        <i class="fa-regular fa-newspaper"></i>Feed
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/notifications"
      >
        <i class="fa-solid fa-bell"></i>Notifications
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/liked"
      >
        <i class="fa-solid fa-heart"></i>Liked
      </NavLink>
      <NavLink className={styles.NavLink} to="/" onClick={handleSignOut}>
        <i class="fa-solid fa-arrow-right-from-bracket"></i>Logout
      </NavLink>
      <NavLink
        className={styles.NavLink}
        to={`/profiles/${currentUser?.profile_id}`}
      >
        <Avatar src={currentUser?.profile_image} height={40} />
      </NavLink>
    </>

  // Icons to display for logged-out users
  const loggedOutIcons = (
    <>
    <NavLink
              className={styles.NavLink}
              activeClassName={styles.Active1}
              to="/signin"
            >
              <i className="fas fa-sign-in-alt"></i>Sign in
            </NavLink>
            <NavLink
              to="/signup"
              className={styles.NavLink}
              activeClassName={styles.Active1}
            >
              <i class="fa-solid fa-address-card"></i>Create Account
            </NavLink>
    </>
  );

  // Rendering of NavBar
  return (
    <Navbar expanded={expanded} className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <NavLink to="/">
          <Navbar.Brand>
            <img src={logo} alt="logo" height="75" />
          </Navbar.Brand>
        </NavLink>
        {currentUser && addPostIcon}
        <Navbar.Toggle ref={ref} onClick={() => setExpanded(!expanded)} aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
          <NavLink
              exact
              className={styles.NavLink}
              activeClassName={styles.Active1}
              to="/"
            >
              <i className="fa-solid fa-house-chimney"></i>Home
            </NavLink>
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
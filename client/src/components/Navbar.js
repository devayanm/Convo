import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserById } from "../services/api";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";

function NavbarComponent() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("User");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const userId = JSON.parse(atob(token.split(".")[1])).sub;
      fetchUsername(userId);
    }
  }, []);

  const fetchUsername = async (userId) => {
    try {
      const userData = await getUserById(userId);
      setUsername(userData.username || "User");
    } catch (error) {
      console.error("Error fetching user:", error);
      setUsername("User");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      navigate("/login");
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  return (
    <Navbar
      bg={darkMode ? "dark" : "light"}
      variant={darkMode ? "dark" : "light"}
      expand="lg"
      style={{ padding: "0.5rem 1rem" }}
    >
      <Navbar.Brand as={Link} to="/">
        Convo
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          {isLoggedIn && (
            <>
              <Nav.Link as={Link} to="/meetings">
                Meetings
              </Nav.Link>
              <Nav.Link
                as={Link}
                to={`/user/${
                  JSON.parse(atob(localStorage.getItem("token")?.split(".")[1]))
                    .sub
                }`}
              >
                Profile
              </Nav.Link>
            </>
          )}
        </Nav>
        <Nav className="ms-auto">
          {isLoggedIn ? (
            <NavDropdown
              title={
                loading ? (
                  "Loading..."
                ) : (
                  <>
                    <img
                      src="https://via.placeholder.com/30"
                      alt="Avatar"
                      style={{ borderRadius: "50%", marginRight: "0.5rem" }}
                    />
                    {username}
                  </>
                )
              }
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item as={Link} to="/settings">
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <>
              <Nav.Link as={Link} to="/register">
                Register
              </Nav.Link>
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            </>
          )}
          <Button
            variant={darkMode ? "light" : "dark"}
            onClick={toggleDarkMode}
            className="ms-3"
            style={{ fontSize: "0.9rem" }}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarComponent;

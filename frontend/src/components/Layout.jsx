import React, { useContext, useState } from "react";
import { Container, Navbar, Nav, Offcanvas } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faChartLine,
  faVolumeUp,
  faVolumeMute,
  faTrophy,
  faUser,
  faTachometerAlt,
  faUsers,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";
import "./Layout.css";
import { AuthContext } from "./AuthContext";
import NotificationDropdown from "./NotificationDropdown";
import SoundConfigModal from "./SoundConfigModal";
import { soundManager } from "../utils/SoundManager";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const { username, logout, role } = useContext(AuthContext);

  const [showSoundConfig, setShowSoundConfig] = useState(false);
  const [isSoundEnabled] = useState(soundManager.isSoundEnabled);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Build links based on role
  const getNavigationLinks = () => {
    if (role === "admin") {
      return [
        { path: "/admin-dash", label: "Admin Dashboard", icon: faTachometerAlt },
        { path: "/student-dash", label: "Student Dash", icon: faUser },
        { path: "/teacher-dash", label: "Teacher Dash", icon: faUsers },
        { path: "/analytics", label: "Analytics", icon: faChartBar },
        { path: "/progress-dashboard", label: "Progress", icon: faChartLine },
      ];
    } else if (role === "teacher") {
      return [
        { path: "/teacher-dash", label: "Teacher Dash", icon: faUsers },
        { path: "/analytics", label: "Analytics", icon: faChartBar },
        { path: "/progress-dashboard", label: "Progress", icon: faChartLine },
      ];
    }
    // student (default)
    return [
      { path: "/student-dash", label: "Student Dash", icon: faUser },
      { path: "/student-analysis", label: "Student Analysis", icon: faChartBar },
      { path: "/progress-dashboard", label: "Progress", icon: faChartLine },
    ];
  };

  // ✅ call the function to produce the array
  const navigationLinks = getNavigationLinks();

  // ✅ optional filter
  const filteredLinks = navigationLinks.filter((link) => {
    if (role === "student") return link.path !== "/teacher-dash";
    return true;
  });

  return (
    <div id="main-content" className="d-flex flex-column min-vh-100">
      <Navbar expand="lg" className="custom-navbar">
        <Container fluid>
          <Navbar.Brand className="h3 text-white">Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar" />
          <Navbar.Offcanvas id="offcanvasNavbar" placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title className="text-white">Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="ms-auto justify-content-end flex-grow-1 pe-3">
                {filteredLinks.map((link) => (
                  <Nav.Link
                    key={link.path}
                    className={`custom-nav-link mx-2 ${
                      currentLocation.pathname === link.path ? "active" : ""
                    }`}
                    onClick={() => navigate(link.path)}
                  >
                    {link.icon && (
                      <FontAwesomeIcon icon={link.icon} className="mr-2" />
                    )}
                    {link.label}
                  </Nav.Link>
                ))}

                {/* Sound Toggle */}
                <Nav.Link
                  className="custom-nav-link mx-2"
                  onClick={() => setShowSoundConfig(true)}
                >
                  <FontAwesomeIcon
                    icon={isSoundEnabled ? faVolumeUp : faVolumeMute}
                    className="text-white"
                  />
                </Nav.Link>

                {/* Notifications (students only) */}
                {role === "student" ? (
                  <div className="ms-0">
                    <NotificationDropdown />
                  </div>
                ) : null}

                {/* User / Logout */}
                <Nav.Item className="d-flex align-items-center ms-0">
                  <FontAwesomeIcon icon={faUser} className="text-white" />
                  <span className="ms-2 username-text admin-text">
                    {username}
                  </span>
                  <span
                    onClick={handleLogout}
                    className="custom-nav-link mx-2"
                    style={{ cursor: "pointer" }}
                    title="Logout"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                  </span>
                </Nav.Item>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      <main className="flex-fill">
        <Container>{children}</Container>
      </main>

      <footer className="footer text-center">
        <p>&copy; AI EDUCATOR</p>
      </footer>

      <SoundConfigModal
        show={showSoundConfig}
        onHide={() => setShowSoundConfig(false)}
      />
    </div>
  );
};

export default Layout;
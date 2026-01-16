import { Navbar, Container, Dropdown, Nav } from "react-bootstrap";
import { AuthService } from "../../services/authService";
import { Link } from "react-router-dom";

const Header = ({ pageTitle }) => {
  const handleLogout = async () => {
    await AuthService.logout();
    window.location.href = "/login";
  };

  return (
    <Navbar bg="white" expand="lg" className="border-bottom px-3">
      <Container fluid>
        {/* Brand / Title */}
        <Navbar.Brand href="#" className="fw-bold fs-5">
          {pageTitle}
        </Navbar.Brand>

        <Nav className="ms-auto d-flex align-items-center">
          {/* Last Sync */}
          <div className="me-4 d-none d-md-flex align-items-center text-muted small">
            <i className="ri-time-line me-1"></i>
            Dernière synchro:{" "}
            <span className="ms-1" id="lastSync">
              29/04/2025 14:42
            </span>
          </div>

          {/* Notifications */}
          <div className="position-relative me-3" style={{ cursor: "pointer" }}>
            <i className="ri-notification-3-line ri-lg text-muted"></i>
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
          </div>

          {/* User Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              className="p-0 d-flex align-items-center border-0"
            >
              <p className="mb-0 me-2 d-none d-md-inline">Logan Lerman</p>
              <img
                src="https://placedog.net/300"
                alt="avatar"
                className="rounded-circle"
                width="32"
                height="32"
              />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                as={Link}
                to="/user/profile"
                className="text-dark text-decoration-none"
              >
                <i className="ri-user-line me-2"></i> Profil
              </Dropdown.Item>

              <Dropdown.Divider />

              <Dropdown.Item as="button" onClick={handleLogout}>
                <i className="ri-logout-box-line me-2"></i> Déconnexion
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;

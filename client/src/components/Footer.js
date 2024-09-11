import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#f8f9fa", // Whitish color
        color: "#343a40", // Dark text
        position: "absolute", // Ensures it sticks to the bottom
        bottom: "0",
        width: "100%",
        padding: "10px 0",
      }}
    >
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Convo. Connecting People, Simplifying Meetings.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <Link
              to="/privacy"
              className="text-dark me-3 text-decoration-none"
              style={{ color: "#343a40" }}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-dark me-3 text-decoration-none"
              style={{ color: "#343a40" }}
            >
              Terms of Service
            </Link>
            <Link
              to="/contact"
              className="text-dark text-decoration-none"
              style={{ color: "#343a40" }}
            >
              Contact Us
            </Link>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

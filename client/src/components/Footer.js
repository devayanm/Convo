import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, ListGroup } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>About Us</h5>
            <p>
              Convo is a powerful platform designed for seamless scheduling and
              management of meetings. Our goal is to help you stay connected and
              organized.
            </p>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Quick Links</h5>
            <ListGroup variant="flush">
              <ListGroup.Item className="bg-dark border-0">
                <Link
                  to="/features"
                  className="text-light text-decoration-none"
                >
                  Features
                </Link>
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark border-0">
                <Link to="/contact" className="text-light text-decoration-none">
                  Contact Us
                </Link>
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark border-0">
                <Link to="/privacy" className="text-light text-decoration-none">
                  Privacy Policy
                </Link>
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark border-0">
                <Link to="/terms" className="text-light text-decoration-none">
                  Terms of Service
                </Link>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={4}>
            <h5>Contact</h5>
            <p>
              Email:{" "}
              <a href="mailto:support@convo.com" className="text-light">
                support@convo.com
              </a>
            </p>
            <p>Follow us on:</p>
            <div>
              <a
                href="https://facebook.com"
                className="text-light me-3"
                aria-label="Facebook"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a
                href="https://twitter.com"
                className="text-light me-3"
                aria-label="Twitter"
              >
                <i className="bi bi-twitter"></i>
              </a>
              <a
                href="https://linkedin.com"
                className="text-light"
                aria-label="LinkedIn"
              >
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </Col>
        </Row>
        <div className="text-center mt-4">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Convo. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

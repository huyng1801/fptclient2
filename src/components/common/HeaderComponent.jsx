import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { FaBell, FaUserCircle } from "react-icons/fa";

const HeaderComponent = () => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/">
          <img
            src="/assets/images/logo.png"
            alt="Logo"
            className="me-2"
            height="40"
          />
          <span style={{ color: "#FFB400", fontWeight: "bold" }}>
            Alumni Connect
          </span>
        </Navbar.Brand>
        <Nav className="ms-auto d-flex align-items-center">
          <Nav.Link href="#jobs">Tìm Alumni</Nav.Link>
          <Nav.Link href="#companies">Mentor</Nav.Link>
          <Nav.Link href="#guide">Cẩm nang</Nav.Link>
          <Nav.Link href="/cv">Tạo CV</Nav.Link>
          <Nav.Link href="/create-job-post">Tạo việc làm</Nav.Link>
          <FaBell size={20} className="mx-3 text-secondary" />
          <FaUserCircle size={24} className="text-secondary" />
        </Nav>
      </Container>
    </Navbar>
  );
};

export default HeaderComponent;

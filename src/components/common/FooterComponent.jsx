import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const FooterComponent = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <Container>
        <Row>
          <Col md={4}>
            <h5 style={{ color: "#FFB400" }}>Thông tin người liên hệ</h5>
            <p>485B Nguyễn Đình Chiểu, P.2, Q.3, TP.HCM</p>
            <p>abc@abc.abc</p>
            <p>(028) 3820-0510</p>
          </Col>
          <Col md={4}>
            <h5 style={{ color: "#FFB400" }}>Menu</h5>
            <p>
              <a href="#" className="text-white text-decoration-none">
                Người tìm việc
              </a>
            </p>
            <p>
              <a href="#" className="text-white text-decoration-none">
                Tìm việc
              </a>
            </p>
            <p>
              <a href="#" className="text-white text-decoration-none">
                Nhà tuyển dụng
              </a>
            </p>
          </Col>
          <Col md={4}>
            <h5 style={{ color: "#FFB400" }}>Link</h5>
            <p>
              <a href="#" className="text-white text-decoration-none">
                Tạo CV miễn phí
              </a>
            </p>
            <p>
              <a href="#" className="text-white text-decoration-none">
                Tìm việc IT
              </a>
            </p>
            <p>
              <a href="#" className="text-white text-decoration-none">
                Dịch vụ tuyển dụng
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default FooterComponent;

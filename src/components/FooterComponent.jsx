import React from "react";
import { Row, Col, Typography, Divider } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const FooterComponent = () => {
  return (
    <footer
      style={{
        backgroundColor: "#2C3E50", // Darker background for the footer
        color: "#fff",
        padding: "60px 20px", // Increased padding for better spacing
      }}
    >
      <Row gutter={[16, 16]} justify="space-between">
        {/* Contact Info Column */}
        <Col md={8} sm={24}>
          <Title level={4} style={{ color: "#FFB400" }}>
            Thông tin người liên hệ
          </Title>
          <Text style={{ color: "#fff", fontSize: "14px" }}>
            <EnvironmentOutlined style={{ marginRight: 8, color: "#FFB400" }} />
            485B Nguyễn Đình Chiểu, P.2, Q.3, TP.HCM
          </Text>
          <br />
          <Text style={{ color: "#fff", fontSize: "14px" }}>
            <MailOutlined style={{ marginRight: 8, color: "#FFB400" }} />
            abc@abc.abc
          </Text>
          <br />
          <Text style={{ color: "#fff", fontSize: "14px" }}>
            <PhoneOutlined style={{ marginRight: 8, color: "#FFB400" }} />
            (028) 3820-0510
          </Text>
        </Col>

        {/* Menu Column */}
        <Col md={8} sm={24}>
          <Title level={4} style={{ color: "#FFB400" }}>
            Menu
          </Title>
          <Text style={{ display: "block", marginBottom: "8px" }}>
            <a
              href="#"
              style={{
                color: "#fff",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#FFB400")}
              onMouseOut={(e) => (e.target.style.color = "#fff")}
            >
              Người tìm việc
            </a>
          </Text>
          <Text style={{ display: "block", marginBottom: "8px" }}>
            <a
              href="#"
              style={{
                color: "#fff",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#FFB400")}
              onMouseOut={(e) => (e.target.style.color = "#fff")}
            >
              Tìm việc
            </a>
          </Text>
          <Text style={{ display: "block", marginBottom: "8px" }}>
            <a
              href="#"
              style={{
                color: "#fff",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#FFB400")}
              onMouseOut={(e) => (e.target.style.color = "#fff")}
            >
              Nhà tuyển dụng
            </a>
          </Text>
        </Col>

        {/* Link Column */}
        <Col md={8} sm={24}>
          <Title level={4} style={{ color: "#FFB400" }}>
            Link
          </Title>
          <Text style={{ display: "block", marginBottom: "8px" }}>
            <a
              href="#"
              style={{
                color: "#fff",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#FFB400")}
              onMouseOut={(e) => (e.target.style.color = "#fff")}
            >
              Tạo CV miễn phí
            </a>
          </Text>
          <Text style={{ display: "block", marginBottom: "8px" }}>
            <a
              href="#"
              style={{
                color: "#fff",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#FFB400")}
              onMouseOut={(e) => (e.target.style.color = "#fff")}
            >
              Tìm việc IT
            </a>
          </Text>
          <Text style={{ display: "block", marginBottom: "8px" }}>
            <a
              href="#"
              style={{
                color: "#fff",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#FFB400")}
              onMouseOut={(e) => (e.target.style.color = "#fff")}
            >
              Dịch vụ tuyển dụng
            </a>
          </Text>
        </Col>
      </Row>

      <Divider
        style={{
          borderColor: "#FFB400",
          marginTop: "30px",
          marginBottom: "30px",
        }}
      />

      <Row justify="center">
        <Col>
          <Text style={{ color: "#fff" }}>
            © 2024 Your Company. All rights reserved.
          </Text>
        </Col>
      </Row>
    </footer>
  );
};

export default FooterComponent;

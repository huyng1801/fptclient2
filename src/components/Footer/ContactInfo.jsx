import React from 'react';
import { Col, Typography } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const contactInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const contactItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#fff',
  fontSize: '14px'
};

const iconStyle = {
  color: '#f05123',
  fontSize: '16px'
};

function ContactInfo() {
  return (
    <Col md={8} sm={24}>
      <Title level={4} style={{ color: "#f05123", marginBottom: '20px' }}>
        Thông tin người liên hệ
      </Title>
      <div style={contactInfoStyle}>
        <Text style={contactItemStyle}>
          <EnvironmentOutlined style={iconStyle} />
          485B Nguyễn Đình Chiểu, P.2, Q.3, TP.HCM
        </Text>
        <Text style={contactItemStyle}>
          <MailOutlined style={iconStyle} />
          abc@abc.abc
        </Text>
        <Text style={contactItemStyle}>
          <PhoneOutlined style={iconStyle} />
          (028) 3820-0510
        </Text>
      </div>
    </Col>
  );
}

export default ContactInfo;
import React from 'react';
import { Col, Typography } from 'antd';
import FooterLink from './FooterLink';

const { Title } = Typography;

function LinkSection({ title, links }) {
  return (
    <Col md={8} sm={24}>
      <Title level={4} style={{ color: "#f05123", marginBottom: '20px' }}>
        {title}
      </Title>
      {links.map((link, index) => (
        <FooterLink key={index} href={link.href}>
          {link.text}
        </FooterLink>
      ))}
    </Col>
  );
}

export default LinkSection;
import React from 'react';
import { Row, Divider } from 'antd';
import ContactInfo from './ContactInfo';
import LinkSection from './LinkSection';
import Copyright from './Copyright';

const footerStyle = {
  backgroundColor: '#2C3E50',
  color: '#fff',
  padding: '60px 20px',
};

const dividerStyle = {
  borderColor: '#FFB400',
  margin: '30px 0',
  opacity: 0.5
};

const menuLinks = [
  { href: '#', text: 'Người tìm việc' },
  { href: '#', text: 'Tìm việc' },
  { href: '#', text: 'Nhà tuyển dụng' }
];

const quickLinks = [
  { href: '#', text: 'Tạo CV miễn phí' },
  { href: '#', text: 'Tìm việc IT' },
  { href: '#', text: 'Dịch vụ tuyển dụng' }
];

function FooterComponent() {
  return (
    <footer style={footerStyle}>
      <Row gutter={[32, 32]} justify="space-between">
        <ContactInfo />
        <LinkSection title="Menu" links={menuLinks} />
        <LinkSection title="Link" links={quickLinks} />
      </Row>

      <Divider style={dividerStyle} />
      <Copyright />
    </footer>
  );
}

export default FooterComponent;
import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const linkStyle = {
  display: 'block',
  marginBottom: '8px',
  color: '#fff',
  textDecoration: 'none',
  transition: 'color 0.3s ease',
  cursor: 'pointer'
};

function FooterLink({ href, children }) {
  return (
    <Text style={{ display: 'block', marginBottom: '8px' }}>
      <a
        href={href}
        style={linkStyle}
        onMouseOver={(e) => e.target.style.color = '#f05123'}
        onMouseOut={(e) => e.target.style.color = '#fff'}
      >
        {children}
      </a>
    </Text>
  );
}

export default FooterLink;
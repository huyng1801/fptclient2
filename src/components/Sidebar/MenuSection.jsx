import React from 'react';
import { Menu } from 'antd';

const sectionStyle = {
  marginTop: "24px",
  marginBottom: "8px",
};

function MenuSection({ children }) {
  return (
    <div style={sectionStyle}>
      {children}
    </div>
  );
}

export default MenuSection;
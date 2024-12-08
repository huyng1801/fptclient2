import React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

function MenuItem({ icon, path, children, itemKey }) {
  const location = useLocation();
  const isActive = location.pathname === path;

  const menuItemStyle = {
    margin: "4px 8px",
    paddingRight: "4px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    backgroundColor: isActive ? "rgba(255, 255, 255, 0.15)" : "transparent",
    ':hover': {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    }
  };

  const linkStyle = {
    textDecoration: "none",
    color: isActive ? "#fff" : "rgba(255, 255, 255, 0.65)",
    fontWeight: isActive ? "500" : "normal",
    transition: "all 0.3s ease",
  };

  const iconStyle = {
    marginRight: "12px",
    transition: "all 0.3s ease",
  };

  return (
    <Menu.Item
      key={itemKey}
      icon={React.cloneElement(icon, { style: iconStyle })}
      style={menuItemStyle}
    >
      <Link to={path} style={linkStyle}>
        {children}
      </Link>
    </Menu.Item>
  );
}

export default MenuItem;
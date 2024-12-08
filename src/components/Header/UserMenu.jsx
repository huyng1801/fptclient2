import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const menuLinkStyle = {
  color: '#007bff',
  textDecoration: 'none',
  display: 'block',
  width: '100%'
};

const UserMenu = () => (
  <Menu style={{ minWidth: '150px' }}>
    <Menu.Item>
      <Link to="/profile" style={menuLinkStyle}>
        Edit Profile
      </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/change-password" style={menuLinkStyle}>
        Change Password
      </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/logout" style={menuLinkStyle}>
        Log Out
      </Link>
    </Menu.Item>
  </Menu>
);

export default UserMenu;
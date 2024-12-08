import React from 'react';
import { Menu } from 'antd';

const menuItemStyle = {
  padding: '5px',
  color: '#007bff',
  cursor: 'pointer'
};

const NotificationMenu = () => (
  <Menu style={{ minWidth: '150px' }}>
    <Menu.Item style={menuItemStyle}>
      New notification 1
    </Menu.Item>
    <Menu.Item style={menuItemStyle}>
      New notification 2
    </Menu.Item>
  </Menu>
);

export default NotificationMenu;
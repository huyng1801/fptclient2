import React from 'react';
import { Dropdown, Badge } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import NotificationMenu from './NotificationMenu';
import UserMenu from './UserMenu';

const iconStyle = {
  fontSize: 24,
  cursor: 'pointer'
};

const IconsSection = ({ onNotificationToggle, onMenuToggle }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Dropdown
      overlay={<NotificationMenu />}
      trigger={['click']}
      onVisibleChange={onNotificationToggle}
    >
      <Badge
        count={2}
        overflowCount={99}
        style={{
          marginRight: 20,
          cursor: 'pointer'
        }}
      >
        <BellOutlined style={iconStyle} />
      </Badge>
    </Dropdown>

    <Dropdown 
      overlay={<UserMenu />} 
      trigger={['click']} 
      onVisibleChange={onMenuToggle}
    >
      <UserOutlined style={{
        ...iconStyle,
        margin: '0 15px'
      }} />
    </Dropdown>
  </div>
);

export default IconsSection;
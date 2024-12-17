import React from 'react';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons';

const styles = {
  menuItem: {
    color: '#001529',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    width: '100%',
    '&:hover': {
      color: '#1890ff',
    },
  },
  icon: {
    fontSize: '16px',
  },
  userInfo: {
    padding: '12px 16px',
    borderBottom: '1px solid #f0f0f0',
    color: '#001529',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  userName: {
    color: '#1890ff',
  },
};

const UserMenu = () => {
  const navigate = useNavigate();
  const userInfoString = sessionStorage.getItem('userInfo');
  console.log(userInfoString);
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const isLoggedIn = !!userInfo;

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userInfo');
    navigate('/login');
  };

  const handleMenuClick = (path) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    navigate(path);
  };

  const fullName = userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : 'Khách';

  return (
    <Menu style={{ minWidth: '200px' }}>
      <div style={styles.userInfo}>
        <UserOutlined style={styles.icon} />
        <span>Xin chào, <span style={styles.userName}>{fullName}</span></span>
      </div>
      
      <Menu.Item key="profile" onClick={() => handleMenuClick('/profile')}>
        <div style={styles.menuItem}>
          <UserOutlined style={styles.icon} />
          Thông tin cá nhân
        </div>
      </Menu.Item>
      
      <Menu.Item key="change-password" onClick={() => handleMenuClick('/change-password')}>
        <div style={styles.menuItem}>
          <LockOutlined style={styles.icon} />
          Đổi mật khẩu
        </div>
      </Menu.Item>
      
      <Menu.Divider />
      
      <Menu.Item key="logout" onClick={handleLogout}>
        <div style={styles.menuItem}>
          <LogoutOutlined style={styles.icon} />
          Đăng xuất
        </div>
      </Menu.Item>
    </Menu>
  );
};

export default UserMenu;
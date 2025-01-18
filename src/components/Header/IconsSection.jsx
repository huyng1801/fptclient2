import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const buttonStyle = {
  borderRadius: '4px',
  padding: '8px 16px',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 8px',
};

const IconsSection = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo')); // Get user info from localStorage

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken'); // Remove token
    sessionStorage.removeItem('userInfo'); // Remove user info
    navigate('/login'); // Redirect to login page
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {userInfo ? (
        <>
          <span style={{ marginRight: '16px', fontWeight: 'bold' }}>
            Xin chào, {userInfo.firstName} {userInfo.lastName}
          </span>
          <Button
            style={{
              ...buttonStyle,
              backgroundColor: '#f5222d',
              color: '#fff',
              border: 'none',
            }}
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </>
      ) : (
        <>
          <Button
            style={{
              ...buttonStyle,
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => navigate('/login')}
          >
            Đăng nhập
          </Button>
          <Button
            style={{
              ...buttonStyle,
              backgroundColor: '#52c41a',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => navigate('/register')}
          >
            Đăng ký
          </Button>
        </>
      )}
    </div>
  );
};

export default IconsSection;

import React, { useState } from 'react';
import { Layout } from 'antd';
import { useLocation } from 'react-router-dom';
import PageTitle from './PageTitle';
import IconsSection from './IconsSection';

const { Header } = Layout;

const headerStyle = {
  backgroundColor: '#fff',
  padding: '0 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  position: 'relative'
};

const HeaderComponent = () => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (showMenu) setShowMenu(false);
  };

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
    if (showNotifications) setShowNotifications(false);
  };



  const currentPage = location.pathname === '/' 
    ? 'Home' 
    : location.pathname.split('/').pop();

  return (
    <Header style={headerStyle}>
      <PageTitle title={currentPage} />

      <IconsSection
        onNotificationToggle={toggleNotifications}
        onMenuToggle={toggleMenu}
      />
    </Header>
  );
};

export default HeaderComponent;
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
  position: 'relative',
};

// Route to Vietnamese page name mapping
const routeToVietnamese = {
  '/': 'Trang Chủ',
  '/login': 'Đăng Nhập',
  '/profile': 'Hồ Sơ Cá Nhân',
  '/register': 'Đăng Ký',
  '/list-post': 'Danh Sách Bài Viết',
  '/list-event': 'Danh Sách Sự Kiện',
  '/my-event': 'Sự Kiện Của Tôi',
  '/mentor-dashboard': 'Danh Sách Mentor',
  '/alumni': 'Cựu Sinh Viên',
  '/schedule': 'Lịch Trình',
  '/rating': 'Đánh Giá Cố Vấn',
  '/create-post': 'Tạo Bài Viết',
  '/user-event': 'Sự Kiện',
  '/user-job-post': 'Công Việc',
  '/create-event': 'Tạo Sự Kiện',
  '/create-job-post': 'Tạo Công Việc',
  '/my-job-post': 'Công Việc Của Tôi',
  '/cv': 'Hồ Sơ',
  '/admin/dashboard': 'Bảng Điều Khiển Quản Trị',
  '/admin/user': 'Người Dùng',
  '/admin/post': 'Bài Viết',
  '/admin/mentor_ship_request': 'Yêu Cầu Cố Vấn',
  '/admin/major': 'Chuyên Ngành',
  '/admin/event': 'Sự Kiện',
  '/admin/jobposts': 'Công Việc',
};

const getDynamicTitle = (path) => {
  if (path.startsWith('/user/')) {
    const userId = path.split('/')[2];
    return `Thông Tin Người Dùng (${userId})`;
  }
  if (path.startsWith('/post/')) {
    const postId = path.split('/')[2];
    return `Chi Tiết Bài Viết (${postId})`;
  }
  if (path.startsWith('/event/')) {
    const eventId = path.split('/')[2];
    return `Chi Tiết Sự Kiện (${eventId})`;
  }
  if (path.startsWith('/user-job-post/')) {
    const eventId = path.split('/')[2];
    return `Chi Tiết Công Việc (${eventId})`;
  }
  if (path.startsWith('/job-applications/')) {
    const eventId = path.split('/')[2];
    return `Chi Tiết Ứng Viên (${eventId})`;
  }
 
  return routeToVietnamese[path] || 'Trang Không Tìm Thấy';
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

  const currentPage = getDynamicTitle(location.pathname);

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

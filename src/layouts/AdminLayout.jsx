import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  UserOutlined,
  FileTextOutlined,
  UserSwitchOutlined,
  AppstoreAddOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const AdminLayout = ({ children, headerName = 'Admin' }) => {
  const location = useLocation(); // Get the current location
  const siderStyle = {
    minHeight: '100vh',
    background: '#fff'
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '16px'
  };

  const logoImageStyle = {
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    marginRight: '10px'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#001529',
    color: 'white',
    padding: '0 16px'
  };

  const contentStyle = {
    margin: '0 16px'
  };

  const breadcrumbStyle = {
    margin: '16px 0'
  };

  const layoutContentStyle = {
    background: '#f0f2f5'
  };

  const linkStyle = {
    textDecoration: 'none', // Remove text decoration from links
  };

  // Determine the selected key based on the current path
  const getSelectedKey = (path) => {
    switch (path) {
      case '/admin/dashboard':
        return '1';
      case '/admin/user':
        return '2';
      case '/admin/post':
        return '3';
      case '/admin/mentor_ship_request':
        return '4';
      case '/admin/major':
        return '5';
      case '/admin/event':
        return '6';
      case '/admin/jobposts':
        return '7';
      default:
        return '1'; // Default to '1' if no match
    }
  };

  return (
    <Layout style={{ minHeight: '80vh' }}>
      <Sider width={250} style={siderStyle}>
        <div style={logoStyle}>
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/logo.png`}
            alt="Profile"
            style={logoImageStyle}
          />
          <span style={{ color: '#777' }}>Admin</span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey(location.pathname)]} // Set the selected menu item dynamically
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/admin/dashboard" style={linkStyle}>Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/admin/user" style={linkStyle}>Người dùng</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<FileTextOutlined />}>
            <Link to="/admin/post" style={linkStyle}>Bài viết</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<UserSwitchOutlined />}>
            <Link to="/admin/mentor_ship_request" style={linkStyle}>Yêu cầu hướng dẫn</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<AppstoreAddOutlined />}>
            <Link to="/admin/major" style={linkStyle}>Ngành học</Link>
          </Menu.Item>
          <Menu.Item key="6" icon={<CalendarOutlined />}>
            <Link to="/admin/event" style={linkStyle}>Sự kiện</Link>
          </Menu.Item>
          <Menu.Item key="7" icon={<AppstoreAddOutlined />}>
            <Link to="/admin/jobposts" style={linkStyle}>Việc làm</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={headerStyle}>
          <div>
            <span style={{ color: 'white' }}>{headerName}</span>
          </div>
        </Header>
        <Content style={contentStyle}>
          <Breadcrumb style={breadcrumbStyle}>
            <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
            <Breadcrumb.Item>{headerName}</Breadcrumb.Item>
          </Breadcrumb>
          <div style={layoutContentStyle}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

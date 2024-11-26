import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import {
  HomeOutlined,
  UserOutlined,       
  FileTextOutlined,   
  UserSwitchOutlined,
  AppstoreAddOutlined,
  CalendarOutlined 
} from '@ant-design/icons'; 
import './AdminLayout.css';
const { Header, Content, Sider } = Layout;

const AdminLayout = ({ children, headerName = 'Admin' }) => {
  return (
    <Layout style={{ minHeight: '80vh' }}>
      <Sider width={250} className="site-layout-background">
        <div className="logo">
        <img
          src={`${process.env.PUBLIC_URL}/assets/images/logo.png`}
          alt="Profile"
          style={{ borderRadius: '0' }} // Apply border radius
        />
          <span className="logo_name" style={{ color: '#777' }}>Admin</span>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/admin/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/admin/user">Người dùng</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<FileTextOutlined />}>
            <Link to="/admin/post">Bài viết</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<UserSwitchOutlined />}>
            <Link to="/admin/mentor_ship_request">Yêu cầu hướng dẫn</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<AppstoreAddOutlined />}>
            <Link to="/admin/major">Ngành học</Link>
          </Menu.Item>
          <Menu.Item key="6" icon={<CalendarOutlined />}>
            <Link to="/admin/event">Sự kiện</Link>
          </Menu.Item>
          <Menu.Item key="7" icon={<AppstoreAddOutlined />}>
            <Link to="/admin/jobposts">Việc làm</Link> 
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="header">
          <div className="logo">
            <span className="admin_name">{headerName}</span>
          </div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
            <Breadcrumb.Item>{headerName}</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-content">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

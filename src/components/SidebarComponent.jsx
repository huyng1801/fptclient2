import React from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  FileTextOutlined,
  CalendarOutlined,
  DashboardOutlined,
  UsergroupAddOutlined,
  ProfileOutlined,
  FormOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider } = Layout;

const SidebarComponent = ({ collapsed, setCollapsed }) => {
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        zIndex: 100,
      }}
    >
        <div
        style={{
            height: "64px", 
            margin: "16px",
            color: "#fff",
            display: "flex",
            justifyContent: "center",  
            alignItems: "center",     
        }}
        >
        <img
            src="/assets/images/logo.png"
            alt="Logo"
            style={{
            width: "64px",  
            height: "64px", 
            borderRadius: "8px",  
            }}
        />
        </div>
      <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to="/" style={{ textDecoration: "none", color: "#fff" }}>Trang chủ</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<FileTextOutlined />}>
          <Link to="/list-post" style={{ textDecoration: "none", color: "#fff" }}>Bài viết</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<CalendarOutlined />}>
          <Link to="/list-event" style={{ textDecoration: "none", color: "#fff" }}>Sự kiện</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<DashboardOutlined />}>
          <Link to="/mentor-dashboard" style={{ textDecoration: "none", color: "#fff" }}>Người hướng dẫn</Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<UsergroupAddOutlined />}>
          <Link to="/mentor-requests" style={{ textDecoration: "none", color: "#fff" }}>Yêu cầu hướng dẫn</Link>
        </Menu.Item>
        <Menu.Item key="6" icon={<FormOutlined />}>
          <Link to="/schedule" style={{ textDecoration: "none", color: "#fff" }}>Lịch trình</Link>
        </Menu.Item>
        <Menu.Item key="7" icon={<FileDoneOutlined />}>
          <Link to="/rating" style={{ textDecoration: "none", color: "#fff" }}>Đánh giá mentor</Link>
        </Menu.Item>
        <Menu.Item key="8" icon={<FileTextOutlined />}>
          <Link to="/user-job-post" style={{ textDecoration: "none", color: "#fff" }}>Công việc</Link>
        </Menu.Item>
        <Menu.Item key="9" icon={<ProfileOutlined />}>
          <Link to="/cv" style={{ textDecoration: "none", color: "#fff" }}>CV của tôi</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SidebarComponent;

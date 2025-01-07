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
import Logo from "./Logo";
import MenuItem from "./MenuItem";
import MenuSection from "./MenuSection";

const { Sider } = Layout;

const siderStyle = {
  position: "fixed",
  left: 0,
  top: 0,
  height: "100vh",
  zIndex: 100,
  boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)",
  background: "linear-gradient(180deg, #001529 0%, #003366 100%)",
  transition: "all 0.2s ease",
};

const menuStyle = {
  background: "transparent",
  border: "none",
  padding: "8px",
};

const SidebarComponent = ({ collapsed, setCollapsed }) => {
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
  const isRecruiter = userInfo?.roleName === 'Recruiter';
  const isStudent = userInfo?.roleName === 'Student';
  const isAlumni = userInfo?.roleName === 'Alumni';

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      style={siderStyle}
      width={260}
    >
      <Logo />
      
      <Menu
        theme="dark"
        mode="inline"
        style={menuStyle}
        defaultSelectedKeys={["1"]}
      >
        <MenuSection>
          <MenuItem icon={<HomeOutlined />} path="/" itemKey="1">
            Trang chủ
          </MenuItem>
          <MenuItem icon={<FileTextOutlined />} path="/list-post" itemKey="2">
            Bài viết
          </MenuItem>
          <MenuItem icon={<CalendarOutlined />} path="/list-event" itemKey="3">
            Sự kiện
          </MenuItem>
        </MenuSection>

        <MenuSection title="Mentor">
          <MenuItem icon={<DashboardOutlined />} path="/mentor-dashboard" itemKey="4">
            Người hướng dẫn
          </MenuItem>
          <MenuItem icon={<UsergroupAddOutlined />} path="/mentor-requests" itemKey="5">
            Yêu cầu hướng dẫn
          </MenuItem>
          <MenuItem icon={<FormOutlined />} path="/schedule" itemKey="6">
            Lịch trình
          </MenuItem>
          <MenuItem icon={<FileDoneOutlined />} path="/rating" itemKey="7">
            Đánh giá mentor
          </MenuItem>
          <MenuItem icon={<DashboardOutlined />} path="/alumni" itemKey="8">
            Cựu sinh viên
          </MenuItem>
        </MenuSection>

        <MenuSection title="Công việc">
          <MenuItem icon={<FileTextOutlined />} path="/user-job-post" itemKey="9">
            Công việc
          </MenuItem>
          {isRecruiter && (
            <MenuItem icon={<FileTextOutlined />} path="/my-job-post" itemKey="10">
              Công việc của tôi
            </MenuItem>
          )}
          {(isStudent || isAlumni || true) && (
            <MenuItem icon={<ProfileOutlined />} path="/cv" itemKey="11">
              CV của tôi
            </MenuItem>
          )}
        </MenuSection>
      </Menu>
    </Sider>
  );
};

export default SidebarComponent;
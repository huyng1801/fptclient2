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
          <MenuItem icon={<FileTextOutlined />} path="/my-post" itemKey="2">
            Bài viết của tôi
          </MenuItem>
          <MenuItem icon={<CalendarOutlined />} path="/list-event" itemKey="3">
            Sự kiện
          </MenuItem>
          <MenuItem icon={<CalendarOutlined />} path="/my-event" itemKey="3">
            Sự kiện của tôi
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
        </MenuSection>

        <MenuSection title="Công việc">
          <MenuItem icon={<FileTextOutlined />} path="/user-job-post" itemKey="8">
            Công việc
          </MenuItem>
          <MenuItem icon={<ProfileOutlined />} path="/cv" itemKey="9">
            CV của tôi
          </MenuItem>
        </MenuSection>
      </Menu>
    </Sider>
  );
};

export default SidebarComponent;
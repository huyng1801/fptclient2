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
        {isRecruiter ? (
          <MenuSection title="Công việc">
            <MenuItem icon={<FileTextOutlined />} path="/user-job-post" itemKey="10">
              Công việc
            </MenuItem>
            <MenuItem icon={<FileTextOutlined />} path="/my-job-post" itemKey="11">
              Công việc của tôi
            </MenuItem>
          </MenuSection>
        ) : (
          <>
            <MenuSection>
              <MenuItem icon={<HomeOutlined />} path="/" itemKey="1">
                Trang chủ
              </MenuItem>
              <MenuItem icon={<DashboardOutlined />} path="/alumni" itemKey="9">
                Cựu sinh viên
              </MenuItem>
              <MenuItem icon={<FileTextOutlined />} path="/list-post" itemKey="2">
                Bài viết
              </MenuItem>
              <MenuItem icon={<CalendarOutlined />} path="/list-event" itemKey="3">
                Sự kiện
              </MenuItem>
              <MenuItem icon={<CalendarOutlined />} path="/my-event" itemKey="4">
                Sự kiện của tôi
              </MenuItem>
            </MenuSection>

            <MenuSection title="Mentor">
              <MenuItem icon={<DashboardOutlined />} path="/mentor-dashboard" itemKey="5">
                Người hướng dẫn
              </MenuItem>
              <MenuItem icon={<UsergroupAddOutlined />} path="/mentor-requests" itemKey="6">
                Yêu cầu hướng dẫn
              </MenuItem>
              <MenuItem icon={<FormOutlined />} path="/schedule" itemKey="7">
                Lịch trình
              </MenuItem>
              {/* <MenuItem icon={<FileDoneOutlined />} path="/rating" itemKey="8">
                Đánh giá mentor
              </MenuItem> */}
        
            </MenuSection>

            <MenuSection title="Công việc">
            <MenuItem icon={<FileTextOutlined />} path="/user-job-post" itemKey="11">
              Công việc
            </MenuItem>
              {(isStudent || isAlumni || true) && (
                <MenuItem icon={<ProfileOutlined />} path="/cv" itemKey="12">
                  CV của tôi
                </MenuItem>
              )}
            </MenuSection>
          </>
        )}
      </Menu>
    </Sider>
  );
};

export default SidebarComponent;

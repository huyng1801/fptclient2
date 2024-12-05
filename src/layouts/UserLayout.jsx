import React, { useState } from "react";
import { Layout } from "antd";
import HeaderComponent from "../components/HeaderComponent"; // Assume path is correct
import FooterComponent from "../components/FooterComponent"; // Assume path is correct
import SidebarComponent from "../components/SidebarComponent"; // Adjust path as needed

const { Content } = Layout;

const UserLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        {/* Header */}
        <HeaderComponent />

        {/* Content */}
        <Content style={{ margin: "16px" }}>
          <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
            {children}
          </div>
        </Content>

        {/* Footer */}
        <FooterComponent />
      </Layout>
    </Layout>
  );
};

export default UserLayout;

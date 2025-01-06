import React, { useState } from "react";
import { Layout } from "antd";
import { useLocation } from "react-router-dom";
import SidebarComponent from "../components/Sidebar/SidebarComponent";
import Header from "../components/Header/Header";
import FooterComponent from "../components/Footer/FooterComponent";

const { Content } = Layout;

const styles = {
  mainLayout: {
    minHeight: "100vh",
    transition: "all 0.2s ease",
  },

  contentWrapper: (isSidebarHidden, collapsed) => ({
    marginLeft: isSidebarHidden ? "0" : collapsed ? "80px" : "260px",
    transition: "all 0.2s ease",
  }),

  contentContainer: {
    margin: "16px",
    transition: "all 0.2s ease",
  },

  content: {
    padding: "24px",
    minHeight: "360px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease",
  },
};

function UserLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const userInfo = sessionStorage.getItem("userInfo");
  const isLoggedIn = !!userInfo;

  // Sidebar should be hidden only on the home page if the user is not logged in
  const isSidebarHidden = !isLoggedIn && location.pathname === "/";

  return (
    <Layout style={styles.mainLayout}>
      {isLoggedIn && (
        <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
      )}

      <Layout style={styles.contentWrapper(isSidebarHidden, collapsed)}>
        <Header />

        <Content style={styles.contentContainer}>
          <div style={styles.content}>{children}</div>
        </Content>

        <FooterComponent />
      </Layout>
    </Layout>
  );
}

export default UserLayout;

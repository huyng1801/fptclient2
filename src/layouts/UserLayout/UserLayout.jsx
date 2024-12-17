import React, { useState } from "react";
import { Layout } from "antd";
import { useLocation } from "react-router-dom";
import SidebarComponent from "../../components/Sidebar/SidebarComponent";
import ContentWrapper from "./ContentWrapper";

const styles = {
  mainLayout: {
    minHeight: "100vh",
  },
};

function UserLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const userInfo = sessionStorage.getItem('userInfo');
  const isLoggedIn = !!userInfo;

  // Sidebar should be hidden only on the home page if the user is not logged in
  const isSidebarHidden = !isLoggedIn && location.pathname === "/";

  return (
    <Layout style={styles.mainLayout}>
      {isLoggedIn && (
        <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
      )}
      <ContentWrapper
        collapsed={collapsed}
        isSidebarHidden={isSidebarHidden}
      >
        {children}
      </ContentWrapper>
    </Layout>
  );
}

export default UserLayout;

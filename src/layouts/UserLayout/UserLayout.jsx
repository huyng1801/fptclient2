import React, { useState } from "react";
import { Layout } from "antd";
import SidebarComponent from "../../components/Sidebar/SidebarComponent";
import ContentWrapper from "./ContentWrapper";
import layoutStyles from './styles';

function UserLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={layoutStyles.mainLayout}>
      <SidebarComponent 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
      />
      
      <ContentWrapper collapsed={collapsed}>
        {children}
      </ContentWrapper>
    </Layout>
  );
}

export default UserLayout;
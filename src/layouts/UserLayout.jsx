import React from "react";
import { Layout, Menu, Breadcrumb, Input, Button, Badge } from "antd";
import { Link } from "react-router-dom";
import "./UserLayout.css"; // Custom styles

const { Header, Content, Footer } = Layout;

const UserLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
  <Header className="header">
        {/* Logo Section */}
        <div className="logo">
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} // Path to your logo image
            alt="FPT Alumni Connect Logo"
            style={{ height: "40px", marginRight: "16px" }} // Adjust size and margin as needed
          />
          <span style={{ color: "#fff", fontSize: "18px" }}>FPT Alumni Connect</span>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <Input.Search
            placeholder="Tìm kiếm diễn đàn..."
            onSearch={(value) => console.log(value)} // Implement search functionality here
            style={{ width: 300, marginRight: 16, borderRadius: "4px" }}
          />
        </div>
      </Header>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["1"]}
        className="menu"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Menu.Item key="1">
          <Link to="/">Diễn Đàn</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/user-event">Sự kiện</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/user-job-post">Tuyển dụng</Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to="/cv">CV</Link>
        </Menu.Item>
      </Menu>

      <Content style={{ padding: "0 50px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>
            <Link to="/">Trang Chủ</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Diễn Đàn</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">{children}</div>
      </Content>

      <Footer className="footer">EcoForum ©2024 Created by Your Name</Footer>
    </Layout>
  );
};

export default UserLayout;

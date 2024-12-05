import React, { useState } from "react";
import { Layout, Menu, Dropdown, Badge, Input } from "antd";
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Header } = Layout;

const HeaderComponent = () => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (showMenu) {
      setShowMenu(false);
    }
  };

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
    if (showNotifications) {
      setShowNotifications(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const currentPage =
    location.pathname === "/" ? "Home" : location.pathname.split("/").pop();

  const notificationMenu = (
    <Menu>
      <Menu.Item style={{ padding: "5px", color: "#007bff", cursor: "pointer" }}>
        New notification 1
      </Menu.Item>
      <Menu.Item style={{ padding: "5px", color: "#007bff", cursor: "pointer" }}>
        New notification 2
      </Menu.Item>
    </Menu>
  );

  const userMenu = (
    <Menu>
      <Menu.Item>
        <Link to="/profile" style={{ color: "#007bff", textDecoration: "none" }}>
          Edit Profile
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/change-password" style={{ color: "#007bff", textDecoration: "none" }}>
          Change Password
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/logout" style={{ color: "#007bff", textDecoration: "none" }}>
          Log Out
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        backgroundColor: "#fff",
        padding: "0 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        position: "relative", // For the absolute positioning of notifications
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          fontSize: "18px",
          textTransform: "capitalize",
          color: "#FFB400",
        }}
      >
        {currentPage}
      </div>

      {/* Centered Search Bar */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          padding: "0 20px",
        }}
      >
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
          style={{
            width: "60%",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Notification Icon with Badge */}
        <Dropdown
          overlay={notificationMenu}
          trigger={["click"]}
          onVisibleChange={toggleNotifications}
        >
          <Badge
            count={2}
            overflowCount={99}
            style={{
              marginRight: 20,
              cursor: "pointer", // Ensures it's clickable
            }}
          >
            <BellOutlined
              style={{
                fontSize: 24,
                cursor: "pointer", // Same cursor style for uniformity
              }}
            />
          </Badge>
        </Dropdown>

        {/* User Menu Icon */}
        <Dropdown overlay={userMenu} trigger={["click"]} onVisibleChange={toggleMenu}>
          <UserOutlined
            style={{
              fontSize: 24,
              cursor: "pointer",
              margin: "0 15px",
            }}
          />
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderComponent;

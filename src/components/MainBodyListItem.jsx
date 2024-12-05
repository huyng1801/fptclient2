import React, { useState, useEffect } from "react";
import { EyeOutlined, FieldTimeOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Typography, Button } from "antd";
import UserService from "../services/UserService";

const { Title, Text } = Typography;

// MainBodyListItem Component
export const MainBodyListItem = ({ item, onClick }) => {
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const fetchUser = async (authorId) => {
        try {
          const userData = await UserService.getUser(authorId);
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
  
      if (item.authorId) {
        fetchUser(item.authorId);
      }
    }, [item.authorId]);
  
    const styles = {
      card: {
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        marginBottom: "20px",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      },
      title: {
        cursor: "pointer",
        fontSize: "18px",
        fontWeight: "600",
        color: "#1890ff",
        transition: "color 0.3s ease",
      },
      content: {
        fontSize: "14px",
        marginBottom: "10px",
        color: "#555",
      },
      footerText: {
        fontSize: "12px",
        color: "#888",
      },
      footerItem: {
        display: "flex",
        alignItems: "center",
      },
      icon: {
        marginRight: "8px",
        fontSize: "16px",
        color: "#1890ff",
      },
      button: {
        width: "100%",
        marginTop: "20px",
        borderRadius: "8px",
        padding: "12px",
        backgroundColor: "#1890ff",
        color: "#fff",
        fontWeight: "600",
        textAlign: "center",
        transition: "background-color 0.3s ease",
      },
    };
  
    return (
        <Card
        style={styles.card}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        hoverable
      >
        <Title level={4} onClick={onClick} style={styles.title}>
          {item.title}
        </Title>
        <Text style={styles.content}>{item.content}</Text>
        <div className="d-flex justify-content-between" style={styles.footerText}>
          <span className="d-flex align-items-center" style={styles.footerItem}>
            <EyeOutlined style={styles.icon} /> {item.views}
          </span>
          <span className="d-flex align-items-center" style={styles.footerItem}>
            <FieldTimeOutlined style={styles.icon} /> {item.time}
          </span>
          <span className="d-flex align-items-center" style={styles.footerItem}>
            <UserOutlined style={styles.icon} />
            {user ? `${user.firstName} ${user.lastName}` : "Loading user..."}
          </span>
        </div>
      </Card>
      
    );
};


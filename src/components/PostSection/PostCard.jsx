import React, { useState, useEffect } from "react";
import { Card, Typography, Tag, Avatar, Space, Tooltip } from "antd";
import { 
  EyeOutlined, 
  FieldTimeOutlined, 
  UserOutlined,
  BookOutlined,
  LockOutlined,
  UnlockOutlined
} from "@ant-design/icons";
import { format } from 'date-fns';
import UserService from "../../services/UserService";

const { Title, Text, Paragraph } = Typography;

export const PostCard = ({ item, onClick }) => {
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
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      border: "1px solid #f0f0f0",
      transition: "all 0.3s ease",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      marginBottom: "20px",
    },
    cardBody: {
      padding: "24px",
    },
    header: {
      display: "flex",
      alignItems: "center",
      marginBottom: "16px",
      gap: "12px",
    },
    avatar: {
      flexShrink: 0,
    },
    userInfo: {
      flex: 1,
    },
    title: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#1a1a1a",
      marginBottom: "12px",
      cursor: "pointer",
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    },
    content: {
      fontSize: "14px",
      color: "#666",
      marginBottom: "16px",
    },
    footer: {
      marginTop: "auto",
      padding: "16px 24px",
      background: "#fafafa",
      borderTop: "1px solid #f0f0f0",
    },
    stats: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    statItem: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      color: "#666",
      fontSize: "13px",
    },
    icon: {
      fontSize: "16px",
      color: "#1890ff",
    },
    tags: {
      marginTop: "12px",
      display: "flex",
      gap: "8px",
    },
  };

  return (
    <Card
      style={styles.card}
      bodyStyle={styles.cardBody}
      hoverable
      onClick={onClick}
    >
      <div style={styles.header}>
        <Avatar 
          size={48} 
          icon={<UserOutlined />} 
          style={styles.avatar}
          src={user?.avatarUrl}
        >
          {user?.firstName?.charAt(0)}
        </Avatar>
        <div style={styles.userInfo}>
          <Text strong>
            {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {format(new Date(item.createdAt), 'dd MMM yyyy, HH:mm')}
          </Text>
        </div>
      </div>

      <Title level={4} style={styles.title}>
        {item.title}
      </Title>

      <Paragraph
        style={styles.content}
        ellipsis={{ rows: 3 }}
      >
        {item.content}
      </Paragraph>

      <div style={styles.tags}>
        <Tag color="blue">
          <BookOutlined /> Major {item.majorId}
        </Tag>
        <Tag color={item.status === 'Published' ? 'green' : 'orange'}>
          {item.status}
        </Tag>
        <Tooltip title={item.isPrivate ? "Private post" : "Public post"}>
          <Tag color={item.isPrivate ? 'red' : 'cyan'}>
            {item.isPrivate ? <LockOutlined /> : <UnlockOutlined />}
          </Tag>
        </Tooltip>
      </div>

      <div style={styles.footer}>
        <Space style={styles.stats}>
          <Tooltip title="Views">
            <span style={styles.statItem}>
              <EyeOutlined style={styles.icon} />
              {item.views}
            </span>
          </Tooltip>
          <Tooltip title="Posted">
            <span style={styles.statItem}>
              <FieldTimeOutlined style={styles.icon} />
              {format(new Date(item.createdAt), 'dd/MM/yyyy')}
            </span>
          </Tooltip>
        </Space>
      </div>
    </Card>
  );
};

export default PostCard;
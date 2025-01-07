import React, { useState, useEffect } from 'react';
import { Card, Typography, Tag, Space, Button, Tooltip, Avatar } from 'antd';
import {
  EnvironmentOutlined,
  ProfileOutlined,
  ReadOutlined,
  DollarCircleOutlined,
  SafetyOutlined,
  TeamOutlined,
  UserOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';
import UserService from '../../services/UserService';

const { Text, Paragraph, Title } = Typography;

function JobCard({ job, onClick }) {
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        if (job.userId) {
          const userData = await UserService.getUser(job.userId);
          setCreator(userData);
        }
      } catch (error) {
        console.error('Error fetching job creator:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [job.userId]);

  const styles = {
    card: {
      marginBottom: "20px",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      border: "1px solid #f0f0f0",
      transition: "all 0.3s ease",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },
    cardBody: {
      padding: "24px",
    },
    header: {
      marginBottom: "20px",
    },
    title: {
      fontSize: "22px",
      fontWeight: "600",
      color: "#1a1a1a",
      marginBottom: "12px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    },
    companyInfo: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#666",
      fontSize: "14px",
      marginBottom: "16px",
    },
    salary: {
      background: "linear-gradient(45deg, #f6ffed, #e6fffb)",
      border: "1px solid #b7eb8f",
      borderRadius: "8px",
      padding: "12px 16px",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    description: {
      fontSize: "14px",
      color: "#666",
      marginBottom: "20px",
    },
    infoSection: {
      background: "#fafafa",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "20px",
    },
    infoItem: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      marginBottom: "12px",
      color: "#595959",
      fontSize: "14px",
    },
    icon: {
      fontSize: "16px",
      marginTop: "4px",
    },
    footer: {
      marginTop: "auto",
      padding: "16px",
      borderTop: "1px solid #f0f0f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "#fff",
    },
    tags: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
      marginBottom: "16px",
    },
    viewButton: {
      borderRadius: "8px",
      height: "40px",
      padding: "0 24px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
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
        <Title level={4} style={styles.title}>
          {job.jobTitle}
        </Title>
        <div style={styles.companyInfo}>
        <div className="flex items-center gap-3 mb-4">
        <Avatar 
          size={48} 
          icon={<UserOutlined />}
          src={creator?.profilePicture}
        >
          {creator?.firstName?.charAt(0)}
        </Avatar>
        <div className="flex-1">
          <Text strong>
           Người đăng: {creator ? `${creator.firstName} ${creator.lastName}` : "Đang tải..."}
          </Text>
          <br />
          <Text type="secondary" className="text-sm">
          Ngày đăng: {format(new Date(job.createdAt), 'dd/MM/yyyy')}
          </Text>
        </div>
      
      </div>
        </div>
      </div>

      <div style={styles.salary}>
        <Text strong style={{ color: "#389e0d", fontSize: "16px" }}>
          <DollarCircleOutlined style={{ marginRight: "8px" }} />
          {job.minSalary} - {job.maxSalary} USD
        </Text>
        {job.isDeal && (
          <Tag color="success">Thương lượng</Tag>
        )}
      </div>

      <div style={styles.tags}>
        <Tag color="blue">Toàn thời gian</Tag>
        <Tag color="cyan">Làm việc từ xa</Tag>
        <Tag color="purple">Công nghệ</Tag>
      </div>

      <Paragraph
        ellipsis={{ rows: 2 }}
        style={styles.description}
      >
        {job.jobDescription}
      </Paragraph>

      <div style={styles.infoSection}>
        <div style={styles.infoItem}>
          <EnvironmentOutlined style={{ ...styles.icon, color: "#1890ff" }} />
          <Text>{job.location}</Text>
        </div>

        <div style={styles.infoItem}>
          <ReadOutlined style={{ ...styles.icon, color: "#722ed1" }} />
          <Text>{job.requirements}</Text>
        </div>

        <div style={styles.infoItem}>
          <SafetyOutlined style={{ ...styles.icon, color: "#52c41a" }} />
          <Text>{job.benefits}</Text>
        </div>
      </div>

      <div style={styles.footer}>
        <Button 
          type="primary"
          style={styles.viewButton}
          icon={<ArrowRightOutlined />}
        >
          Xem chi tiết
        </Button>
      </div>
    </Card>
  );
}

export default JobCard;
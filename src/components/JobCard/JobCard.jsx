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
    // ... keep existing styles ...
    statusTag: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      padding: '4px 12px',
      borderRadius: '4px',
      fontWeight: '500'
    }
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
          <Tag 
            color={job.status === 'Open' ? 'success' : 'error'} 
            style={styles.statusTag}
          >
            {job.status === 'Open' ? 'Đang tuyển' : 'Đã đóng'}
          </Tag>
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
          disabled={job.status !== 'Open'}
        >
          {job.status === 'Open' ? 'Xem chi tiết' : 'Đã đóng tuyển dụng'}
        </Button>
      </div>
    </Card>
  );
}

export default JobCard;
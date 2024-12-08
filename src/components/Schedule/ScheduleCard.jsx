import React from 'react';
import { Card, Typography, Button, Avatar, Space, Tag, Tooltip } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  MessageOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const ScheduleCard = ({ schedule }) => {
  const styles = {
    card: {
      marginBottom: '20px',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid #f0f0f0',
      overflow: 'hidden',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '20px 24px',
      borderBottom: '1px solid #f0f0f0',
      background: '#fafafa',
    },
    headerInfo: {
      flex: 1,
    },
    content: {
      padding: '24px',
    },
    infoSection: {
      marginBottom: '24px',
      background: '#fafafa',
      borderRadius: '8px',
      padding: '16px',
    },
    infoItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      marginBottom: '12px',
      '&:last-child': {
        marginBottom: 0,
      },
    },
    label: {
      fontWeight: '600',
      color: '#333',
      minWidth: '120px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    value: {
      flex: 1,
      color: '#666',
    },
    footer: {
      padding: '16px 24px',
      background: '#fafafa',
      borderTop: '1px solid #f0f0f0',
    },
    button: {
      width: '100%',
      height: '40px',
      borderRadius: '8px',
      fontWeight: '500',
    },
  };

  return (
    <Card style={styles.card}>
      <div style={styles.header}>
        <Avatar size={48} icon={<UserOutlined />}>
          {schedule.name?.charAt(0)}
        </Avatar>
        <div style={styles.headerInfo}>
          <Space align="center">
            <Text strong style={{ fontSize: '16px' }}>{schedule.name}</Text>
            <Tag color="blue" icon={<CheckCircleOutlined />}>Available</Tag>
          </Space>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.infoSection}>
          <div style={styles.infoItem}>
            <Text style={styles.label}>
              <MessageOutlined /> Chi tiết yêu cầu:
            </Text>
            <Paragraph style={styles.value} ellipsis={{ rows: 2 }}>
              {schedule.requestDetails}
            </Paragraph>
          </div>

          <div style={styles.infoItem}>
            <Text style={styles.label}>
              <CheckCircleOutlined /> Phản hồi:
            </Text>
            <Text style={styles.value}>{schedule.response}</Text>
          </div>

          <div style={styles.infoItem}>
            <Text style={styles.label}>
              <CalendarOutlined /> Thời gian:
            </Text>
            <Text style={styles.value}>{schedule.time}</Text>
          </div>

          <div style={styles.infoItem}>
            <Text style={styles.label}>
              <EnvironmentOutlined /> Địa điểm:
            </Text>
            <Text style={styles.value}>{schedule.location}</Text>
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <Tooltip title="Schedule an appointment with this mentor">
          <Button type="primary" style={styles.button}>
            Đặt Lịch Hẹn
          </Button>
        </Tooltip>
      </div>
    </Card>
  );
};

export default ScheduleCard;
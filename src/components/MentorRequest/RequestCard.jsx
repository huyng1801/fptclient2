import React from 'react';
import { Card, Typography, Button, Avatar, Space, Tag } from 'antd';
import { UserOutlined, MessageOutlined, RightOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const RequestCard = ({ request, onClick }) => {
  const styles = {
    card: {
      marginBottom: '20px',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid #f0f0f0',
      transition: 'all 0.3s ease',
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
      marginBottom: '12px',
      '&:last-child': {
        marginBottom: 0,
      },
    },
    label: {
      fontWeight: '600',
      color: '#333',
      marginBottom: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    value: {
      color: '#666',
    },
    footer: {
      padding: '16px 24px',
      background: '#fafafa',
      borderTop: '1px solid #f0f0f0',
      display: 'flex',
      justifyContent: 'flex-end',
    },
    button: {
      borderRadius: '8px',
      height: '40px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
  };

  return (
    <Card style={styles.card} hoverable>
      <div style={styles.header}>
        <Avatar size={48} icon={<UserOutlined />}>
          {request.name?.charAt(0)}
        </Avatar>
        <div style={styles.headerInfo}>
          <Space align="center">
            <Text strong style={{ fontSize: '16px' }}>{request.name}</Text>
            <Tag color="blue">New Request</Tag>
          </Space>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.infoSection}>
          <div style={styles.infoItem}>
            <Text style={styles.label}>
              <MessageOutlined /> Yêu cầu:
            </Text>
            <Paragraph style={styles.value} ellipsis={{ rows: 2 }}>
              {request.request}
            </Paragraph>
          </div>

          <div style={styles.infoItem}>
            <Text style={styles.label}>Phản hồi:</Text>
            <Text style={styles.value}>{request.comment}</Text>
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <Button 
          type="primary"
          onClick={onClick}
          style={styles.button}
          icon={<RightOutlined />}
        >
          Đặt lịch hẹn
        </Button>
      </div>
    </Card>
  );
};

export default RequestCard;
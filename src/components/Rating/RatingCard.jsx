import React from 'react';
import { Card, Typography, Button, Avatar, Space, Tooltip, Tag } from 'antd';
import { 
  StarFilled, 
  UserOutlined, 
  CheckCircleOutlined, 
  MessageOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined 
} from '@ant-design/icons';
import RatingStar from '../RatingStar';

const { Text, Title, Paragraph } = Typography;

const RatingCard = ({ rating, onRatingSubmit }) => {
  const styles = {
    card: {
      marginBottom: '20px',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid #f0f0f0',
      overflow: 'hidden',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)',
      },
    },
    header: {
      padding: '20px 24px',
      borderBottom: '1px solid #f0f0f0',
      background: '#fafafa',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    headerInfo: {
      flex: 1,
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1890ff',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
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
      marginBottom: '16px',
      fontSize: '14px',
      color: '#666',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
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
    },
    ratingSection: {
      marginTop: '24px',
      padding: '16px',
      background: '#fff8e6',
      borderRadius: '8px',
      border: '1px solid #ffd591',
    },
    ratingContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    existingRating: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#faad14',
      fontSize: '16px',
      fontWeight: '600',
    },
    button: {
      borderRadius: '8px',
      height: '40px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    statusTag: {
      marginLeft: 'auto',
    },
  };

  const getStatusTag = () => {
    if (rating.rating !== 0 && rating.rating !== "") {
      return (
        <Tag color="success" icon={<CheckCircleOutlined />}>
          Đã đánh giá
        </Tag>
      );
    }
    return (
      <Tag color="warning" icon={<ClockCircleOutlined />}>
        Chờ đánh giá
      </Tag>
    );
  };

  return (
    <Card style={styles.card} hoverable>
      <div style={styles.header}>
        <Avatar size={48} icon={<UserOutlined />}>
          {rating.name?.charAt(0)}
        </Avatar>
        <div style={styles.headerInfo}>
          <Title level={4} style={styles.title}>
            {rating.name}
            <Tooltip title="Mentor">
              <Tag color="blue">Mentor</Tag>
            </Tooltip>
          </Title>
          <Text type="secondary">
            <ClockCircleOutlined /> Ngày yêu cầu: {new Date().toLocaleDateString()}
          </Text>
        </div>
        <div style={styles.statusTag}>
          {getStatusTag()}
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.infoSection}>
          <div style={styles.infoItem}>
            <Text style={styles.label}>
              <QuestionCircleOutlined /> Chi tiết yêu cầu:
            </Text>
            <Paragraph style={styles.value} ellipsis={{ rows: 2 }}>
              {rating.requestDetails}
            </Paragraph>
          </div>

          <div style={styles.infoItem}>
            <Text style={styles.label}>
              <CheckCircleOutlined /> Phản hồi:
            </Text>
            <Text style={styles.value}>{rating.response}</Text>
          </div>

          <div style={styles.infoItem}>
            <Text style={styles.label}>
              <MessageOutlined /> Bình luận:
            </Text>
            <Text style={styles.value}>{rating.comment}</Text>
          </div>
        </div>

        <div style={styles.ratingSection}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Text strong>Đánh giá của bạn:</Text>
            {rating.rating !== 0 && rating.rating !== "" ? (
              <div style={styles.existingRating}>
                {rating.rating} <StarFilled />
              </div>
            ) : (
              <div style={styles.ratingContainer}>
                <RatingStar
                  totalStars={5}
                  rating={rating.currentRating}
                  onRating={rating.onRatingChange}
                />
                <Button 
                  type="primary" 
                  onClick={() => onRatingSubmit(rating.id)}
                  style={styles.button}
                  icon={<StarFilled />}
                >
                  Gửi đánh giá
                </Button>
              </div>
            )}
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default RatingCard;
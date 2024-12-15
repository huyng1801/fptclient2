import React from 'react';
import { Card, Row, Col, Typography, Avatar, Tag } from 'antd';
import { StarOutlined, UserOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const styles = {
  card: {
    marginBottom: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f0f0f0',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
  },
  cardBody: {
    padding: '24px',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: '50%',
    border: '2px solid #1890ff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  name: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1890ff',
    marginBottom: '4px',
  },
  role: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '4px',
  },
  major: {
    fontSize: '14px',
    color: '#666',
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px',
  },
  ratingIcon: {
    color: '#faad14',
    fontSize: '18px',
  },
  ratingText: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
  },
  tags: {
    marginTop: '12px',
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
};

const MentorCard = ({ mentor, onClick }) => {
  return (
    <Card 
      hoverable 
      style={styles.card}
      bodyStyle={styles.cardBody}
      onClick={() => onClick(mentor.userId)}
    >
      <Row gutter={24} align="middle">
        <Col xs={24} sm={8}>
          <div style={styles.imageContainer}>
            <Avatar
              size={120}
              icon={<UserOutlined />}
              src={mentor.profilePicture || "/assets/images/default-avatar.png"}
              style={styles.avatar}
            />
          </div>
        </Col>

        <Col xs={24} sm={16}>
          <div style={styles.infoContainer}>
            <Title level={4} style={styles.name}>
              {`${mentor.firstName} ${mentor.lastName}`}
            </Title>
            <Text style={styles.role}>Role ID: {mentor.roleId}</Text>
            <Text style={styles.major}>Major ID: {mentor.majorId || 'Not specified'}</Text>

            <div style={styles.tags}>
              <Tag color="blue">Mentor</Tag>
              <Tag color="green">Active</Tag>
              {mentor.rating >= 4.5 && (
                <Tag color="gold">Top Rated</Tag>
              )}
            </div>

            <div style={styles.ratingContainer}>
              <StarOutlined style={styles.ratingIcon} />
              <Text style={styles.ratingText}>{mentor.rating || '4.9'}</Text>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default MentorCard;
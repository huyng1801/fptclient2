import React from 'react';
import { Card, Row, Col, Typography, Avatar, Tag } from 'antd';
import { StarOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';

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
    gap: '12px',
  },
  name: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1890ff',
    marginBottom: '4px',
  },
  email: {
    fontSize: '14px',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#666',
    fontSize: '14px',
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
              src={mentor.profilePicture}
              style={styles.avatar}
            />
          </div>
        </Col>

        <Col xs={24} sm={16}>
          <div style={styles.infoContainer}>
            <Title level={3} style={styles.name}>
              {`${mentor.firstName} ${mentor.lastName}`}
            </Title>

            <Text style={styles.email}>
              <MailOutlined /> {mentor.email}
              {mentor.emailVerified && (
                <Tag color="success" style={{ marginLeft: '8px' }}>Verified</Tag>
              )}
            </Text>

            <div style={styles.tags}>
              <Tag color="blue">{mentor.roleName || 'Role not specified'}</Tag>
              {mentor.isMentor && <Tag color="purple">Mentor</Tag>}
            </div>

            <div style={styles.infoRow}>
              <StarOutlined style={{ color: '#faad14' }} />
              <Text strong>4.9</Text>
              <Text type="secondary">(Rating)</Text>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default MentorCard;
import React from 'react';
import { Card, Typography, Tag, Image, Button } from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { format } from 'date-fns';

const { Text, Paragraph } = Typography;

function EventCard({ event, organizer, onClick }) {
  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm');
  };

  const getDurationInHours = () => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    const diffInHours = (end - start) / (1000 * 60 * 60);
    return Math.round(diffInHours);
  };

  return (
    <Card
      hoverable
      cover={
        <div style={{
          height: '200px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <Image
            alt={event.eventName}
            src={'https://fptsoftware.com/-/media/project/fpt-software/fso/newsroom/event-calendar/fvn/new-update/lp-thumbnail-1200x628tv-2.jpg?modified=20231127100130'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            preview={false}
          />
          <Tag color="blue" style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            padding: '4px 8px',
            fontSize: '12px'
          }}>
            {getDurationInHours()}h Thời gian
          </Tag>
        </div>
      }
      style={{
        marginBottom: "20px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        border: "1px solid #f0f0f0",
        transition: "all 0.3s ease",
        overflow: "hidden",
      }}
      bodyStyle={{
        padding: "20px",
      }}
      onClick={onClick}
    >
      <Card.Meta
        title={
          <Text
            style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '12px',
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {event.eventName}
          </Text>
        }
        description={
          <Paragraph
            ellipsis={{ rows: 2 }}
            style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '16px'
            }}
          >
            {event.description}
          </Paragraph>
        }
      />

      <div style={{
        marginTop: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>
        <Text style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#595959',
          fontSize: '14px'
        }}>
          <CalendarOutlined style={{ color: '#1890ff' }} />
          Bắt đầu: {formatDate(event.startDate)}
        </Text>
        <Text style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#595959',
          fontSize: '14px'
        }}>
          <ClockCircleOutlined style={{ color: '#52c41a' }} />
          Kết thúc: {formatDate(event.endDate)}
        </Text>
        <Text style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#595959',
          fontSize: '14px'
        }}>
          <EnvironmentOutlined style={{ color: '#f5222d' }} />
          {event.location}
        </Text>
        <Text style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#595959',
          fontSize: '14px'
        }}>
          <UserOutlined style={{ color: '#722ed1' }} />
          {organizer ? `${organizer?.firstName} ${organizer?.lastName}` : "Đang tải..."}
        </Text>
      </div>

      <Button
        type="primary"
        block
        style={{
          marginTop: '20px',
          height: '40px',
          borderRadius: '8px',
          fontWeight: '500'
        }}
      >
        Xem chi tiết
      </Button>
    </Card>
  );
}

export default EventCard;

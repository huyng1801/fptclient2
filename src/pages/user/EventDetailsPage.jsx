import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, List, Descriptions, Button } from 'antd';
import UserLayout from '../../layouts/UserLayout';


const { Title } = Typography;

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [userJoinEvents, setUserJoinEvents] = useState([]);

  const mockEvent = {
    EventId: parseInt(eventId, 10),
    EventName: 'Hội thảo Công Nghệ 2024',
    Description: 'Hội thảo về xu hướng công nghệ mới trong năm 2024.',
    StartDate: '2024-11-20T09:00:00Z',
    EndDate: '2024-11-20T17:00:00Z',
    Location: 'Trung tâm Hội nghị Quốc gia',
    Organizer: { Name: 'Công ty Công nghệ XYZ' }
  };

  const mockUserJoinEvents = [
    {
      Id: 1,
      UserId: 101,
      EventId: parseInt(eventId, 10),
      Content: 'Buổi hội thảo rất bổ ích, tôi đã học được nhiều điều mới.',
      CreatedAt: '2024-11-20T12:00:00Z',
      Rating: 5,
      CreatedBy: 'user123',
      User: { UserName: 'Nguyen Van A' }
    },
    {
      Id: 2,
      UserId: 102,
      EventId: parseInt(eventId, 10),
      Content: 'Chương trình được tổ chức tốt và thông tin rất phong phú.',
      CreatedAt: '2024-11-20T13:00:00Z',
      Rating: 4,
      CreatedBy: 'user456',
      User: { UserName: 'Tran Thi B' }
    }
  ];

  useEffect(() => {
    setEventDetails(mockEvent);
    setUserJoinEvents(mockUserJoinEvents);
  }, [eventId]);

  return (
    <UserLayout>
      <div style={{ padding: '24px' }}>
        {eventDetails ? (
          <Card title={eventDetails.EventName} style={{ marginBottom: '24px' }}>
            <Descriptions bordered>
              <Descriptions.Item label="Mô Tả">{eventDetails.Description}</Descriptions.Item>
              <Descriptions.Item label="Ngày Bắt Đầu">{new Date(eventDetails.StartDate).toLocaleDateString()}</Descriptions.Item>
              <Descriptions.Item label="Ngày Kết Thúc">{new Date(eventDetails.EndDate).toLocaleDateString()}</Descriptions.Item>
              <Descriptions.Item label="Địa Điểm">{eventDetails.Location || 'Chưa xác định'}</Descriptions.Item>
              <Descriptions.Item label="Người Tổ Chức">{eventDetails.Organizer ? eventDetails.Organizer.Name : 'Chưa có'}</Descriptions.Item>
            </Descriptions>
          </Card>
        ) : (
          <Title level={4}>Đang tải chi tiết sự kiện...</Title>
        )}

        <Title level={4}>Phản hồi từ người tham gia</Title>
        <List
          dataSource={userJoinEvents}
          renderItem={(userJoinEvent) => (
            <List.Item key={userJoinEvent.Id} style={{ padding: '16px', border: '1px solid #f0f0f0', borderRadius: '8px', marginBottom: '16px' }}>
              <Card>
                <Descriptions>
                  <Descriptions.Item label="Người dùng">{userJoinEvent.User?.UserName || 'Ẩn danh'}</Descriptions.Item>
                  <Descriptions.Item label="Nội dung">{userJoinEvent.Content}</Descriptions.Item>
                  <Descriptions.Item label="Ngày tạo">{new Date(userJoinEvent.CreatedAt).toLocaleDateString()}</Descriptions.Item>
                  <Descriptions.Item label="Đánh giá">{userJoinEvent.Rating || 'Không có'}</Descriptions.Item>
                  <Descriptions.Item label="Tạo bởi">{userJoinEvent.CreatedBy || 'N/A'}</Descriptions.Item>
                </Descriptions>
              </Card>
            </List.Item>
          )}
        />
      </div>
    </UserLayout>
  );
};

export default EventDetailsPage;

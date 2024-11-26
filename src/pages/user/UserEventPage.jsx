import React, { useEffect, useState } from 'react';
import { List, Typography, Button, Modal, Card, Descriptions } from 'antd';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import UserLayout from '../../layouts/UserLayout'; // Adjust the import path as needed

const { Title, Text } = Typography;

const UserEventPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const navigate = useNavigate(); // Initialize the navigation hook

  // Example data for events
  const mockEvents = [
    {
      EventId: 1,
      EventName: 'Hội thảo Công Nghệ 2024',
      Description: 'Hội thảo về xu hướng công nghệ mới trong năm 2024, bao gồm AI, Blockchain và IoT.',
      StartDate: '2024-11-20T09:00:00Z',
      EndDate: '2024-11-20T17:00:00Z',
      Location: 'Trung tâm Hội nghị Quốc gia',
      Organizer: { Name: 'Công ty Công nghệ XYZ' }
    },
    {
      EventId: 2,
      EventName: 'Triển Lãm Nghệ Thuật Hiện Đại',
      Description: 'Triển lãm các tác phẩm nghệ thuật hiện đại từ nhiều nghệ sĩ nổi tiếng.',
      StartDate: '2024-12-01T10:00:00Z',
      EndDate: '2024-12-05T18:00:00Z',
      Location: 'Bảo tàng Mỹ thuật TP. Hồ Chí Minh',
      Organizer: { Name: 'Hiệp hội Nghệ thuật Việt Nam' }
    },
    {
      EventId: 3,
      EventName: 'Chương trình Âm nhạc Mùa Đông',
      Description: 'Buổi hòa nhạc mừng mùa đông với sự tham gia của các ban nhạc nổi tiếng.',
      StartDate: '2024-12-15T19:30:00Z',
      EndDate: '2024-12-15T22:00:00Z',
      Location: 'Nhà hát Lớn Hà Nội',
      Organizer: { Name: 'Nhà hát Quốc gia' }
    }
  ];

  // Use mock data as initial events
  useEffect(() => {
    setEvents(mockEvents);
  }, []);

  // Show event details in modal
  const showEventDetails = (event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedEvent(null);
  };

  // Navigate to Create Event Page
  const handleCreateEventClick = () => {
    navigate('/create-event'); // Navigate to the create event page
  };

  return (
    <UserLayout>
      <div style={{ padding: '24px' }}>
        <Title level={3}>Danh Sách Sự Kiện</Title>

        {/* Button to create new event */}
        <Button
          type="primary"
          onClick={handleCreateEventClick}
          style={{ marginBottom: '20px' }}
        >
          Tạo Sự Kiện Mới
        </Button>

        <List
          itemLayout="vertical"
          size="large"
          dataSource={events}
          renderItem={(event) => (
            <List.Item
              key={event.EventId}
              style={{ padding: '16px', border: '1px solid #f0f0f0', borderRadius: '8px', marginBottom: '16px' }}
              actions={[
                <Button type="link" onClick={() => showEventDetails(event)}>
                  Xem Chi Tiết
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={<Link to={`/event/${event.EventId}`} style={{ fontSize: '18px', color: '#1890ff' }}>{event.EventName}</Link>}
                description={<Text>{new Date(event.StartDate).toLocaleDateString()} - {new Date(event.EndDate).toLocaleDateString()}</Text>}
              />
            </List.Item>
          )}
        />

        {/* Modal for event details */}
        {selectedEvent && (
          <Modal
            title="Chi Tiết Sự Kiện"
            visible={isModalVisible}
            onCancel={handleModalClose}
            footer={[
              <Button key="close" onClick={handleModalClose}>
                Đóng
              </Button>,
            ]}
          >
            <Card>
              <Descriptions bordered>
                <Descriptions.Item label="Tên Sự Kiện">{selectedEvent.EventName}</Descriptions.Item>
                <Descriptions.Item label="Mô Tả">{selectedEvent.Description}</Descriptions.Item>
                <Descriptions.Item label="Ngày Bắt Đầu">{new Date(selectedEvent.StartDate).toLocaleDateString()}</Descriptions.Item>
                <Descriptions.Item label="Ngày Kết Thúc">{new Date(selectedEvent.EndDate).toLocaleDateString()}</Descriptions.Item>
                <Descriptions.Item label="Địa Điểm">{selectedEvent.Location || 'Chưa xác định'}</Descriptions.Item>
                <Descriptions.Item label="Người Tổ Chức">{selectedEvent.Organizer ? selectedEvent.Organizer.Name : 'Chưa có'}</Descriptions.Item>
              </Descriptions>
              <Button
                type="primary"
                style={{ marginTop: '16px' }}
                onClick={() => {
                  // Implement any action on the event, e.g., join the event
                  alert('Tham gia sự kiện!');
                }}
              >
                Tham Gia
              </Button>
            </Card>
          </Modal>
        )}
      </div>
    </UserLayout>
  );
};

export default UserEventPage;

import React, { useState } from "react";
import { Row, Col, Card, Pagination, Button } from "antd";
import { Typography } from "antd";
import { UserOutlined, CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { PagingListItem } from "../../components/PagingListItem";
import UserLayout from "../../layouts/UserLayout"; // Assuming the path to UserLayout

const { Title, Text } = Typography;

const SchedulePage = () => {
  const schedules = [
    {
      name: "Nguyen Van A",
      requestDetails: "Nguyen Van A cần giúp đỡ",
      response: "Đã giúp xong",
      time: "20/11/2024 17:00",
      location: "HCM",
    },
    {
      name: "Nguyen Van B",
      requestDetails: "Nguyen Van B cần giúp đỡ",
      response: "Đã giúp xong",
      time: "20/11/2024 17:00",
      location: "HCM",
    },
    {
      name: "Nguyen Van C",
      requestDetails: "Nguyen Van C cần giúp đỡ",
      response: "Đã giúp xong",
      time: "20/11/2024 17:00",
      location: "HCM",
    },
    {
      name: "Nguyen Van D",
      requestDetails: "Nguyen Van D cần giúp đỡ",
      response: "Đã giúp xong",
      time: "20/11/2024 17:00",
      location: "HCM",
    },
    {
      name: "Nguyen Van E",
      requestDetails: "Nguyen Van E cần giúp đỡ",
      response: "Đã giúp xong",
      time: "20/11/2024 17:00",
      location: "HCM",
    },
    {
      name: "Nguyen Van F",
      requestDetails: "Nguyen Van F cần giúp đỡ",
      response: "Đã giúp xong",
      time: "20/11/2024 17:00",
      location: "HCM",
    },
    {
      name: "Nguyen Van G",
      requestDetails: "Nguyen Van G cần giúp đỡ",
      response: "Đã giúp xong",
      time: "20/11/2024 17:00",
      location: "HCM",
    },
    {
      name: "Nguyen Van H",
      requestDetails: "Nguyen Van H cần giúp đỡ",
      response: "Đã giúp xong",
      time: "20/11/2024 17:00",
      location: "HCM",
    },
  ];
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(schedules.length / itemsPerPage);
  const currentItem = schedules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <UserLayout>
      <Row className="mb-4">
        <Col>
          <Title level={2} style={{ textAlign: 'center', color: '#FFB400' }}>
            Lịch Hẹn
          </Title>
        </Col>
      </Row>
      
      {currentItem.map((schedule, index) => (
        <Card
          key={index}
          className="mb-4 shadow-sm"
          style={{ borderRadius: '8px' }}
        >
          <Card.Meta
            avatar={<UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
            title={<Text strong>{schedule.name}</Text>}
            description={
              <div>
                <div style={{ marginBottom: '8px' }}>
                  <Text strong><CalendarOutlined /> Chi tiết yêu cầu:</Text>
                  <Text>{schedule.requestDetails}</Text>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <Text strong>Phản hồi:</Text>
                  <Text>{schedule.response}</Text>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <Text strong><CalendarOutlined /> Thời gian:</Text>
                  <Text>{schedule.time}</Text>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <Text strong><EnvironmentOutlined /> Địa điểm:</Text>
                  <Text>{schedule.location}</Text>
                </div>
                <Button type="primary" style={{ marginTop: '10px' }}>Đặt Lịch Hẹn</Button>
              </div>
            }
          />
        </Card>
      ))}

      <PagingListItem currentPage={currentPage} handlePageChange={handlePageChange} totalPages={totalPages} />
    </UserLayout>
  );
};

export default SchedulePage;

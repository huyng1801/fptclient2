import React, { useState } from "react";
import { Row, Col, Card, Pagination } from "react-bootstrap";
import { Typography } from "@mui/material";
import { Button } from "antd"; // Importing Ant Design Button
import { RightOutlined } from "@ant-design/icons"; // Importing Ant Design icons
import UserLayout from "../../layouts/UserLayout"; // Assuming the path to UserLayout
import { useNavigate } from "react-router-dom";

export const MainBodyListItem = ({ item, onClick }) => {
  return (
    <Card className="mb-3 shadow-sm" style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <Card.Body>
        <Row>
          <Col>
            <Card.Title className="text-primary" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              {item.name}
            </Card.Title>
            <Card.Text className="mb-4" style={{ color: "#555" }}>Yêu cầu: {item.request}</Card.Text>
            <Card.Text className="mb-1" style={{ color: "#888" }}>Phản hồi: {item.comment}</Card.Text>
          </Col>

          <Col md="auto" className="d-flex align-items-center">
            {/* Using Ant Design Button with an icon */}
            <Button
              type="primary"
              icon={<RightOutlined />}
              onClick={onClick}
              style={{
                borderRadius: "5px",
                padding: "6px 20px",
                backgroundColor: "#FFB400",
                borderColor: "#FFB400",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              Đặt lịch hẹn
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

function MentorRequestListPage() {
  const posts = [
    { name: "Tên 1", request: "Yêu cầu 1", comment: "Phản hồi 1" },
    { name: "Tên 2", request: "Yêu cầu 2", comment: "Phản hồi 2" },
    { name: "Tên 3", request: "Yêu cầu 3", comment: "Phản hồi 3" },
    { name: "Tên 4", request: "Yêu cầu 4", comment: "Phản hồi 4" },
    { name: "Tên 5", request: "Yêu cầu 5", comment: "Phản hồi 5" },
    { name: "Tên 6", request: "Yêu cầu 6", comment: "Phản hồi 6" },
    { name: "Tên 7", request: "Yêu cầu 7", comment: "Phản hồi 7" },
    { name: "Tên 8", request: "Yêu cầu 8", comment: "Phản hồi 8" },
    { name: "Tên 9", request: "Yêu cầu 9", comment: "Phản hồi 9" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const currentItem = posts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const navigate = useNavigate();
  const handleBookSchedule = () => {
    navigate("/request/1");
  };

  return (
    <UserLayout>
      <Typography
        variant="h4"
        align="center"
        className="mb-4"
        style={{ fontWeight: "bold", color: "#FFB400", textTransform: "uppercase" }}
      >
        Chi Tiết Yêu Cầu
      </Typography>
      <Row className="mb-4 justify-content-center">
        <Col md={8}>
          {currentItem.map((item, index) => (
            <MainBodyListItem
              key={index}
              onClick={handleBookSchedule}
              item={item}
            />
          ))}
          <Pagination
            className="mt-3 justify-content-end"
            current={currentPage}
            total={posts.length}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
            showSizeChanger={false}
            style={{ display: "flex", justifyContent: "center" }}
          />
        </Col>
      </Row>
    </UserLayout>
  );
}

export default MentorRequestListPage;

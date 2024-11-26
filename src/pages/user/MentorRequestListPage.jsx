import React, { useState } from "react";
import { Container, Row, Col, Card, Pagination } from "react-bootstrap";
import { Box, Typography } from "@mui/material";
import HeaderComponent from "../../components/common/HeaderComponent";
import FooterComponent from "../../components/common/FooterComponent";
import { useNavigate } from "react-router-dom";

export const MainBodyListItem = ({ item, onClick }) => {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Row>
          <Col>
            <Card.Title className="text-primary">{item.name}</Card.Title>
            <Card.Text className="mb-4">Yêu cầu: {item.request}</Card.Text>
            <Card.Text className="mb-1">Phản hồi: {item.comment}</Card.Text>
          </Col>

          <Col md="auto" className="d-flex align-items-center">
            <button onClick={onClick} className="btn btn-primary">
              Đặt lịch hẹn
            </button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

function MentorRequestListPage() {
  const posts = [
    {
      name: "Tên 1",
      request: "Yêu cầu 1",
      comment: "Phản hồi 1",
    },
    {
      name: "Tên 2",
      request: "Yêu cầu 2",
      comment: "Phản hồi 2",
    },
    {
      name: "Tên 3",
      request: "Yêu cầu 3",
      comment: "Phản hồi 3",
    },
    {
      name: "Tên 4",
      request: "Yêu cầu 4",
      comment: "Phản hồi 4",
    },
    {
      name: "Tên 5",
      request: "Yêu cầu 5",
      comment: "Phản hồi 5",
    },
    {
      name: "Tên 6",
      request: "Yêu cầu 6",
      comment: "Phản hồi 6",
    },
    {
      name: "Tên 7",
      request: "Yêu cầu 7",
      comment: "Phản hồi 7",
    },
    {
      name: "Tên 8",
      request: "Yêu cầu 8",
      comment: "Phản hồi 8",
    },
    {
      name: "Tên 9",
      request: "Yêu cầu 9",
      comment: "Phản hồi 9",
    },
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
    <div className="d-flex flex-column min-vh-100">
      <HeaderComponent />

      <Box sx={{ backgroundColor: "#F7F7F7", py: 4 }}>
        <Container>
          <Typography
            variant="h4"
            align="center"
            className="mb-4"
            style={{ fontWeight: "bold", color: "#FFB400" }}
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
              <Pagination className="mt-3 justify-content-end">
                {[...Array(totalPages).keys()].map((page) => (
                  <Pagination.Item
                    key={page + 1}
                    active={page + 1 === currentPage}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    {page + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </Col>
          </Row>
        </Container>
      </Box>

      <FooterComponent />
    </div>
  );
}

export default MentorRequestListPage;

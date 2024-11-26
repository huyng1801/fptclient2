import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Box, Typography } from "@mui/material";
import HeaderComponent from "../../components/common/HeaderComponent";
import FooterComponent from "../../components/common/FooterComponent";
import { PagingListItem } from "../../components/common/PagingListItem";

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
    <div className="d-flex flex-column min-vh-100">
      <HeaderComponent />
      <Box sx={{ paddingTop: "70px", backgroundColor: "#f9f9f9", py: 4 }}>
        <Container>
          <Row className="mb-4">
            <Col>
              <Typography
                variant="h4"
                align="center"
                className="mb-4"
                style={{ fontWeight: "bold", color: "#FFB400" }}
              >
                Lịch Hẹn
              </Typography>
            </Col>
          </Row>
          {currentItem.map((schedule) => (
            <Card className="mb-4 shadow-sm md-5">
              <Card.Body>
                <Typography variant="h6" className="mb-3 text-primary">
                  {schedule.name}
                </Typography>
                <div style={{ marginLeft: 100 }}>
                  <Typography variant="h6" className="mb-1">
                    Chi tiết yêu cầu:
                  </Typography>
                  <Typography variant="body1" className="mb-3">
                    {schedule.requestDetails}
                  </Typography>
                  <Typography variant="h6" className="mb-1">
                    Phản hồi:
                  </Typography>
                  <Typography variant="body1" className="mb-3">
                    {schedule.response}
                  </Typography>
                  <Typography variant="h6" className="mb-1">
                    Thời gian:
                  </Typography>
                  <Typography variant="body1" className="mb-3">
                    {schedule.time}
                  </Typography>
                  <Typography variant="h6" className="mb-1">
                    Địa điểm:
                  </Typography>
                  <Typography variant="body1" className="mb-3">
                    {schedule.location}
                  </Typography>
                </div>
              </Card.Body>
            </Card>
          ))}
          <PagingListItem currentPage={currentPage} handlePageChange={handlePageChange} totalPages={totalPages}/>
        </Container>
      </Box>
      <FooterComponent />
    </div>
  );
};

export default SchedulePage;

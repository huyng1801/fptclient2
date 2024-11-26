import React, { useState } from "react";
import { Container, Row, Col, Card, Pagination } from "react-bootstrap";
import { Box } from "@mui/material";
import HeaderComponent from "../../components/common/HeaderComponent";
import FooterComponent from "../../components/common/FooterComponent";
import { Visibility, AccessTime, Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const EventListItem = ({ item, onclick }) => {
  const styles = {
    title: {
      cursor: "pointer",
    },
  };
  return (
    <Card className="mb-3 shadow-sm">
      <Row className="g-0 align-items-center">
        <Col md={4}>
          <Card.Img
            src={item.img}
            alt="Card image"
            className="img-fluid rounded-start"
          />
        </Col>

        <Col md={8}>
          <Card.Body className="d-flex flex-column justify-content-around">
            <Card.Title
              className="text-primary"
              onClick={onclick}
              style={styles.title}
            >
              {item.title}
            </Card.Title>
            <Card.Text className="mb-1">{item.content}</Card.Text>
            <div className="d-flex justify-content-between text-muted">
              <span className="d-flex align-items-center">
                <Visibility fontSize="small" className="me-1" /> {item.views}
              </span>
              <span className="d-flex align-items-center">
                <AccessTime fontSize="small" className="me-1" /> {item.time}
              </span>
              <span className="d-flex align-items-center">
                <Person fontSize="small" className="me-1" /> {item.user}
              </span>
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

function ListEventPage() {
  const events = [
    {
      img: "/assets/images/logo.png",
      title: "Tiêu đề sự kiện 1",
      content: "Nội dung tóm tắt 1",
      views: "Số view 1",
      time: "Thời gian đăng 1",
      user: "Người đăng 1",
    },
    {
      img: "/assets/images/logo.png",
      title: "Tiêu đề sự kiện 2",
      content: "Nội dung tóm tắt 2",
      views: "Số view 2",
      time: "Thời gian đăng 2",
      user: "Người đăng 2",
    },
    {
      img: "/assets/images/logo.png",
      title: "Tiêu đề sự kiện 3",
      content: "Nội dung tóm tắt 3",
      views: "Số view 3",
      time: "Thời gian đăng 3",
      user: "Người đăng 3",
    },
    {
      img: "/assets/images/logo.png",
      title: "Tiêu đề sự kiện 4",
      content: "Nội dung tóm tắt 4",
      views: "Số view 4",
      time: "Thời gian đăng 4",
      user: "Người đăng 4",
    },
    {
      img: "/assets/images/logo.png",
      title: "Tiêu đề sự kiện 5",
      content: "Nội dung tóm tắt 5",
      views: "Số view 5",
      time: "Thời gian đăng 5",
      user: "Người đăng 5",
    },
    {
      img: "/assets/images/logo.png",
      title: "Tiêu đề sự kiện 6",
      content: "Nội dung tóm tắt 6",
      views: "Số view 6",
      time: "Thời gian đăng 6",
      user: "Người đăng 6",
    },
    {
      img: "/assets/images/logo.png",
      title: "Tiêu đề sự kiện 7",
      content: "Nội dung tóm tắt 7",
      views: "Số view 7",
      time: "Thời gian đăng 7",
      user: "Người đăng 7",
    },
    {
      img: "/assets/images/logo.png",
      title: "Tiêu đề sự kiện 8",
      content: "Nội dung tóm tắt 8",
      views: "Số view 8",
      time: "Thời gian đăng 8",
      user: "Người đăng 8",
    },
    {
      img: "/assets/images/logo.png",
      title: "Tiêu đề sự kiện 9",
      content: "Nội dung tóm tắt 9",
      views: "Số view 9",
      time: "Thời gian đăng 9",
      user: "Người đăng 9",
    },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(events.length / itemsPerPage);
  const currentItem = events.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const navigate = useNavigate();

  const showEventDetails = () => {
    navigate("/event/1");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderComponent />

      <Box sx={{ backgroundColor: "#F7F7F7", py: 4 }}>
        <Container>
          <Row className="mb-4 justify-content-center">
            <Col md={8}>
              {currentItem.map((item, index) => (
                <EventListItem
                  key={index}
                  onclick={showEventDetails}
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

export default ListEventPage;

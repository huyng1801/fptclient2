import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Box, Typography } from "@mui/material";
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import { PagingListItem } from "../../components/PagingListItem";
import RatingStar from "../../components/RatingStar";
import { Star } from "@mui/icons-material";

const MentorRatingPage = () => {
  const ratings = [
    {
      name: "Nguyen Van A",
      requestDetails: "Nguyen Van A cần giúp đỡ",
      response: "Đã giúp xong",
      comment: "Cảm ơn",
      rating: 0,
    },
    {
      name: "Nguyen Van B",
      requestDetails: "Nguyen Van B cần giúp đỡ",
      response: "Đã giúp xong",
      comment: "Cảm ơn",
      rating: 4,
    },
    {
      name: "Nguyen Van C",
      requestDetails: "Nguyen Van C cần giúp đỡ",
      response: "Đã giúp xong",
      comment: "Cảm ơn",
      rating: 3,
    },
    {
      name: "Nguyen Van D",
      requestDetails: "Nguyen Van D cần giúp đỡ",
      response: "Đã giúp xong",
      comment: "Cảm ơn",
      rating: 4,
    },
    {
      name: "Nguyen Van E",
      requestDetails: "Nguyen Van E cần giúp đỡ",
      response: "Đã giúp xong",
      comment: "Cảm ơn",
      rating: 4,
    },
    {
      name: "Nguyen Van F",
      requestDetails: "Nguyen Van F cần giúp đỡ",
      response: "Đã giúp xong",
      comment: "Cảm ơn",
      rating: 5,
    },
    {
      name: "Nguyen Van G",
      requestDetails: "Nguyen Van G cần giúp đỡ",
      response: "Đã giúp xong",
      comment: "Cảm ơn",
      rating: 5,
    },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(ratings.length / itemsPerPage);
  const currentItem = ratings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [rating, setRating] = useState(5);
  const handleRatingMentor = () =>{
    alert(`Đánh giá mentor này ${rating} sao thành công !`)
  }
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
                Đánh Giá Mentor
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
                    Bình luận:
                  </Typography>
                  <Typography variant="body1" className="mb-3">
                    {schedule.comment}
                  </Typography>
                  <Typography variant="h6" className="mb-1">
                    Đánh giá:
                  </Typography>
                  {schedule.rating !== 0 && schedule.rating !== "" ? (
                    <Typography variant="body1" className="mb-3">
                      {schedule.rating}
                      <Star
                        style={{ color: "orange", marginBottom: 2 }}
                        fontSize="small"
                        className="ms-1"
                      />
                    </Typography>
                  ) : (
                    <Typography variant="body1" className="d-flex gap-5 mb-3">
                      <RatingStar
                        totalStars={5}
                        rating={rating}
                        onRating={setRating}
                      />
                      <Button variant="success" onClick={handleRatingMentor}>
                        Đánh giá
                      </Button>
                    </Typography>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
          <PagingListItem
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            totalPages={totalPages}
          />
        </Container>
      </Box>
      <FooterComponent />
    </div>
  );
};

export default MentorRatingPage;

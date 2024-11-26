import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Card, Image } from "react-bootstrap";
import { Box, Typography } from "@mui/material";
import HeaderComponent from "../../components/common/HeaderComponent";
import FooterComponent from "../../components/common/FooterComponent";
import EventService from "../../services/EventService"; // Assuming the services are properly configured
import UserJoinEventService from "../../services/UserJoinEventService";
import "./EventDetailsPageV2.css";

function EventDetailsPageV2() {
  const [eventDetails, setEventDetails] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const eventId = 3; // Replace with dynamic ID if available

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const event = await EventService.getEventById(eventId);
        setEventDetails(event);
        const feedbackResponse = await UserJoinEventService.viewAllUserJoinEvents(
          { eventId }, // Filter object with EventId
          { page: 1, pageSize: 10 } // Optional pagination parameters
        );
        setFeedbacks(feedbackResponse.items);
        
      } catch (error) {
        console.error("Error fetching event details or feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!eventDetails) {
    return <div>No event details available.</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderComponent />
      <Box sx={{ backgroundColor: "#f9f9f9", py: 4 }}>
        <Container>
          <Row className="mb-4">
            <Col>
              <Typography variant="h5" className="mb-3">
                {eventDetails.title}
              </Typography>
              <Row>
                <Col md={3} className="d-flex align-items-center logo-container">
                  <Image
                    src={eventDetails.img || "/assets/images/default-event.png"} // Fallback for missing image
                    alt="Event"
                    className="event-image"
                  />
                </Col>
                <Col md={9}>
                  <Table bordered className="event-table">
                    <tbody>
                      <tr>
                        <th>Mô Tả</th>
                        <td>{eventDetails.description}</td>
                        <th>Ngày Bắt Đầu</th>
                        <td>{eventDetails.startDate}</td>
                      </tr>
                      <tr>
                        <th>Địa Điểm</th>
                        <td>{eventDetails.location}</td>
                        <th>Ngày Kết Thúc</th>
                        <td>{eventDetails.endDate}</td>
                      </tr>
                      <tr>
                        <th>Người Tổ Chức</th>
                        <td colSpan={3}>{eventDetails.organizer}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <Typography variant="h6" className="mb-3">
                Phản hồi từ người tham gia
              </Typography>
              {feedbacks.map((feedback, index) => (
                <Card className="mb-3 shadow-sm" key={index}>
                  <Card.Body>
                    <Row>
                      <Col md={3}>
                        <Typography className="fw-bold">Người dùng:</Typography>
                        <Typography>{feedback.user}</Typography>
                      </Col>
                      <Col md={6}>
                        <Typography className="fw-bold">Nội dung:</Typography>
                        <Typography>{feedback.content}</Typography>
                      </Col>
                      <Col md={3}>
                        <Typography className="fw-bold">Ngày tạo:</Typography>
                        <Typography>{feedback.createdAt}</Typography>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col md={3}>
                        <Typography className="fw-bold">Đánh giá:</Typography>
                        <Typography>{feedback.rating}</Typography>
                      </Col>
                      <Col md={3}>
                        <Typography className="fw-bold">Tạo bởi:</Typography>
                        <Typography>{feedback.createdBy}</Typography>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </Col>
          </Row>
        </Container>
      </Box>
      <FooterComponent />
    </div>
  );
}

export default EventDetailsPageV2;

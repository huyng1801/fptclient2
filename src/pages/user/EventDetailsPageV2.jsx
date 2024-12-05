import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Card, Image } from "react-bootstrap";
import { Box, Typography } from "@mui/material";
import { Layout, Spin, Button, Rate } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; // Ant Design Icon
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import EventService from "../../services/EventService";
import UserJoinEventService from "../../services/UserJoinEventService";
import UserLayout from "../../layouts/UserLayout"; // Assuming the path to UserLayout

const { Content } = Layout;

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
          { eventId },
          { page: 1, pageSize: 10 }
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
    return (
      <div style={{ textAlign: "center", marginTop: "20%" }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </div>
    );
  }

  if (!eventDetails) {
    return <div>No event details available.</div>;
  }

  return (
<UserLayout>
          <Row className="mb-4">
            <Col>
              <Typography variant="h5" style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}>
                {eventDetails.title}
              </Typography>
              <Row>
                <Col md={3} style={{ display: "flex", alignItems: "center" }}>
                  <Image
                    src={eventDetails.img || "/assets/images/default-event.png"}
                    alt="Event"
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                </Col>
                <Col md={9}>
                  <Table bordered style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
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
              <Typography variant="h6" style={{ marginBottom: "20px", fontSize: "20px", fontWeight: "600" }}>
                Phản hồi từ người tham gia
              </Typography>
              {feedbacks.map((feedback, index) => (
                <Card key={index} style={{ marginBottom: "20px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
                  <Card.Body>
                    <Row>
                      <Col md={3}>
                        <Typography style={{ fontWeight: "bold" }}>Người dùng:</Typography>
                        <Typography>{feedback.user}</Typography>
                      </Col>
                      <Col md={6}>
                        <Typography style={{ fontWeight: "bold" }}>Nội dung:</Typography>
                        <Typography>{feedback.content}</Typography>
                      </Col>
                      <Col md={3}>
                        <Typography style={{ fontWeight: "bold" }}>Ngày tạo:</Typography>
                        <Typography>{feedback.createdAt}</Typography>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                      <Col md={3}>
                        <Typography style={{ fontWeight: "bold" }}>Đánh giá:</Typography>
                        <Rate value={feedback.rating} disabled style={{ fontSize: "16px" }} />
                      </Col>
                      <Col md={3}>
                        <Typography style={{ fontWeight: "bold" }}>Tạo bởi:</Typography>
                        <Typography>{feedback.createdBy}</Typography>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </Col>
          </Row>
          </UserLayout>
  );
}

export default EventDetailsPageV2;

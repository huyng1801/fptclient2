import React, { useEffect, useState } from "react";
import { Layout, Spin, Card, Typography, Rate, Avatar, Tag, Image, Row, Col, Button, Tooltip } from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  TeamOutlined,
  StarOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";
import UserLayout from "../../layouts/UserLayout/UserLayout";
import EventService from "../../services/EventService";
import UserJoinEventService from "../../services/UserJoinEventService";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const styles = {
  mainCard: {
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    border: "1px solid #f0f0f0",
    overflow: "hidden",
    marginBottom: "24px",
  },
  header: {
    padding: "24px",
    borderBottom: "1px solid #f0f0f0",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "24px",
    lineHeight: 1.4,
  },
  imageContainer: {
    borderRadius: "12px",
    overflow: "hidden",
    marginBottom: "24px",
  },
  infoTable: {
    width: "100%",
    background: "#fafafa",
    borderRadius: "12px",
    padding: "20px",
  },
  infoRow: {
    display: "flex",
    alignItems: "flex-start",
    padding: "12px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  infoLabel: {
    width: "140px",
    fontWeight: "600",
    color: "#666",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  infoValue: {
    flex: 1,
    color: "#333",
  },
  feedbackSection: {
    marginTop: "32px",
  },
  feedbackCard: {
    borderRadius: "12px",
    marginBottom: "16px",
    border: "1px solid #f0f0f0",
    background: "#fff",
  },
  feedbackHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  feedbackContent: {
    fontSize: "14px",
    color: "#333",
    marginBottom: "16px",
  },
  feedbackMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#666",
    fontSize: "13px",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
  },
};

function EventDetailsPageV2() {
  const [eventDetails, setEventDetails] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const eventId = 3;

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
      <div style={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (!eventDetails) {
    return <div>Không có thông tin sự kiện.</div>;
  }

  return (
    <UserLayout>
        <Card style={styles.mainCard}>
          <div style={styles.header}>
            <Title level={1} style={styles.title}>
              {eventDetails.eventName}
            </Title>
            
            <div style={styles.imageContainer}>
              <Image
                src={ "https://fptsoftware.com/-/media/project/fpt-software/fso/newsroom/event-calendar/smart-expo.png?modified=20231127092420"}
                alt={eventDetails.eventName}
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
            </div>

            <div style={styles.infoTable}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>
                  <CalendarOutlined style={{ color: "#1890ff" }} /> Ngày bắt đầu
                </span>
                <span style={styles.infoValue}>
                  {format(new Date(eventDetails.startDate), "dd MMMM yyyy, HH:mm")}
                </span>
              </div>
              
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>
                  <ClockCircleOutlined style={{ color: "#52c41a" }} /> Ngày kết thúc
                </span>
                <span style={styles.infoValue}>
                  {format(new Date(eventDetails.endDate), "dd MMMM yyyy, HH:mm")}
                </span>
              </div>

              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>
                  <EnvironmentOutlined style={{ color: "#f5222d" }} /> Địa điểm
                </span>
                <span style={styles.infoValue}>{eventDetails.location}</span>
              </div>

              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>
                  <TeamOutlined style={{ color: "#722ed1" }} /> Tổ chức
                </span>
                <span style={styles.infoValue}>{eventDetails.organizer}</span>
              </div>

              <div style={{ ...styles.infoRow, border: "none" }}>
                <span style={styles.infoLabel}>
                  <MessageOutlined style={{ color: "#faad14" }} /> Mô tả
                </span>
                <Paragraph style={styles.infoValue}>
                  {eventDetails.description}
                </Paragraph>
              </div>
            </div>
          </div>
        </Card>

        <div style={styles.feedbackSection}>
          <Title level={3} style={{ marginBottom: "24px" }}>
            <StarOutlined style={{ marginRight: "8px", color: "#faad14" }} />
            Phản hồi từ người tham gia
          </Title>

          {feedbacks.map((feedback, index) => (
            <Card key={index} style={styles.feedbackCard}>
              <div style={styles.feedbackHeader}>
                <Avatar size={48} icon={<UserOutlined />}>
                  {feedback.user?.charAt(0)}
                </Avatar>
                <div>
                  <Text strong style={{ fontSize: "16px" }}>
                    {feedback.user}
                  </Text>
                  <br />
                  <Rate value={feedback.rating} disabled style={{ fontSize: "14px" }} />
                </div>
              </div>

              <Paragraph style={styles.feedbackContent}>
                {feedback.content}
              </Paragraph>

              <div style={styles.feedbackMeta}>
                <Text type="secondary">
                  <ClockCircleOutlined style={{ marginRight: "6px" }} />
                  {format(new Date(feedback.createdAt), "dd MMM yyyy, HH:mm")}
                </Text>
                <Text type="secondary">
                  <UserOutlined style={{ marginRight: "6px" }} />
                  Được đăng bởi {feedback.createdBy}
                </Text>
              </div>
            </Card>
          ))}
        </div>
    </UserLayout>
  );
}

export default EventDetailsPageV2;

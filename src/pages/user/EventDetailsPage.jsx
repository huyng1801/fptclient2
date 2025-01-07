import React, { useEffect, useState } from "react";
import { Layout, Spin, Card, Typography, Avatar, Button, message, Rate, Input, List, Form } from "antd";
import { useParams } from "react-router-dom";
import {
  UserOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  TeamOutlined,
  MessageOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";
import UserLayout from "../../layouts/UserLayout";
import EventService from "../../services/EventService";
import UserJoinEventService from "../../services/UserJoinEventService";
import UserService from "../../services/UserService";
import moment from 'moment';
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

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
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#333",
  },
  joinButton: {
    marginTop: "24px",
    width: "100%",
    height: "48px",
    fontSize: "16px",
  },
  ratingSection: {
    marginTop: "24px",
    padding: "20px",
    background: "#f9f9f9",
    borderRadius: "8px",
  },
  participantsList: {
    marginTop: "24px",
  },
  participantCard: {
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "16px",
    background: "#fff",
    border: "1px solid #f0f0f0",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
  },
};

function EventDetailsPage() {
  const { id } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [organizerDetails, setOrganizerDetails] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [participantDetails, setParticipantDetails] = useState({});
  const [userJoinEvent, setUserJoinEvent] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [form] = Form.useForm();
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
  const [canJoin, setCanJoin] = useState(true);
  const [canRate, setCanRate] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const [event, participantsResponse] = await Promise.all([
          EventService.getEventById(id),
          UserJoinEventService.viewAllUserJoinEvents({ eventId: id })
        ]);

        setEventDetails(event);
        setParticipants(participantsResponse.items);

        // Fetch organizer details
        if (event.organizerId) {
          const organizer = await UserService.getUser(event.organizerId);
          setOrganizerDetails(organizer);
        }
      
        // Fetch participant details
        const participantDetailsPromises = participantsResponse.items.map(async (participant) => {
          try {
            const userDetails = await UserService.getUser(participant.userId);
            return { userId: participant.userId, details: userDetails };
          } catch (error) {
            console.error(`Error fetching user ${participant.userId} details:`, error);
            return { userId: participant.userId, details: null };
          }
        });

        const participantDetailsResults = await Promise.all(participantDetailsPromises);
        const participantDetailsMap = {};
        participantDetailsResults.forEach(({ userId, details }) => {
          participantDetailsMap[userId] = details;
        });
        setParticipantDetails(participantDetailsMap);

        // Check if current user has joined
        if (userInfo?.userId) {
          const userJoinResponse = await UserJoinEventService.viewAllUserJoinEvents({
            eventId: id,
            userId: userInfo.userId
          });
          
          if (userJoinResponse.items.length > 0) {
            setUserJoinEvent(userJoinResponse.items[0]);
            form.setFieldsValue({
              rating: userJoinResponse.items[0].rating,
              content: userJoinResponse.items[0].content
            });
          }
        }
        const currentDate = moment().format("YYYY-MM-DDTHH:mm:ss");
        const eventEndDate = moment(eventDetails?.endDate).format("YYYY-MM-DDTHH:mm:ss");
        
        // Check if the event is over (past the end date)
        if (moment(currentDate).isAfter(eventEndDate)) {
          setCanJoin(false);
        }
        
        // Check if the event has ended for more than 7 days
        const ratingDeadline = moment(eventEndDate).add(7, 'days').format("YYYY-MM-DDTHH:mm:ss");
        if (moment(currentDate).isAfter(ratingDeadline)) {
          setCanRate(false);
        }
 
      } catch (error) {
        console.error("Error fetching event data:", error);
        // message.error("Không thể tải thông tin sự kiện");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id, userInfo?.userId]);

  const handleJoinEvent = async () => {
    if (!userInfo?.userId) {
      message.error("Vui lòng đăng nhập để tham gia sự kiện");
      return;
    }

    try {
      setJoining(true);
      const response = await UserJoinEventService.createUserJoinEvent({
        userId: userInfo.userId,
        eventId: parseInt(id)
      });
      
      message.success("Đăng ký tham gia sự kiện thành công!");
      setUserJoinEvent(response);
    } catch (error) {
      console.error("Error joining event:", error);
      message.error("Không thể đăng ký tham gia sự kiện");
    } finally {
      setJoining(false);
    }
  };

  const handleRatingSubmit = async (values) => {
    try {
      await UserJoinEventService.updateUserJoinEvent(userJoinEvent.id, {
        ...userJoinEvent,
        ...values
      });
      
      message.success("Cập nhật đánh giá thành công!");
      setUserJoinEvent(prev => ({ ...prev, ...values }));
    } catch (error) {
      console.error("Error updating rating:", error);
      message.error("Không thể cập nhật đánh giá");
    }
  };

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

          {eventDetails.img && (
            <div style={styles.imageContainer}>
              <img
                src={eventDetails.img}
                alt={eventDetails.eventName}
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
            </div>
          )}

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
              <span style={styles.infoValue}>
                {organizerDetails ? (
                  <>
                    <Avatar src={organizerDetails.profilePicture} icon={<UserOutlined />} />
                    <Text strong>{`${organizerDetails.firstName} ${organizerDetails.lastName}`}</Text>
                    <Text type="secondary">({organizerDetails.email})</Text>
                  </>
                ) : (
                  "Đang tải thông tin tổ chức..."
                )}
              </span>
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

          {userJoinEvent ? (
            <div style={styles.ratingSection}>
              <Title level={4}>Đánh giá sự kiện</Title>
              <Form
                form={form}
                onFinish={handleRatingSubmit}
                initialValues={{
                  rating: userJoinEvent.rating,
                  content: userJoinEvent.content
                }}
              >
                <Form.Item name="rating" label="Đánh giá">
                  <Rate />
                </Form.Item>
                <Form.Item name="content" label="Nhận xét">
                  <TextArea rows={4} placeholder="Chia sẻ cảm nhận của bạn về sự kiện..." />
                </Form.Item>
                <Button type="primary" htmlType="submit" disabled={!canRate}>
                  Cập nhật đánh giá
                </Button>
              </Form>
            </div>
          ) : (
            <Button
              type="primary"
              size="large"
              style={styles.joinButton}
              onClick={handleJoinEvent}
              loading={joining}
              disabled={userInfo?.userId === eventDetails.organizerId || !canJoin}
            >
              {userInfo?.userId ? "Tham gia sự kiện" : "Đăng nhập để tham gia"}
            </Button>
          )}
        </div>

        <div style={styles.participantsList}>
          <Title level={3}>
            <TeamOutlined /> Người tham gia ({participants.length})
          </Title>
          <List
            dataSource={participants}
            renderItem={participant => (
              <Card style={styles.participantCard}>
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={<UserOutlined />} 
                        src={participantDetails[participant.userId]?.profilePicture}
                      />
                    }
                    title={
                      participantDetails[participant.userId] 
                        ? `${participantDetails[participant.userId].firstName} ${participantDetails[participant.userId].lastName}`
                        : "Loading..."
                    }
                    description={
                      <>
                        {participant.rating && (
                          <div>
                            <Rate disabled defaultValue={participant.rating} />
                          </div>
                        )}
                        {participant.content && (
                          <div style={{ marginTop: 8 }}>
                            {participant.content}
                          </div>
                        )}
                      </>
                    }
                  />
                </List.Item>
              </Card>
            )}
          />
        </div>
      </Card>
    </UserLayout>
  );
}

export default EventDetailsPage;
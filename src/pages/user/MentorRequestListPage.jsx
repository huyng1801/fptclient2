import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Space,
  Button,
  notification,
  Spin,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Row,
  Col,
  Empty,
  Avatar,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  PlusOutlined,
  BookOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import UserLayout from "../../layouts/UserLayout";
import MentorshipService from "../../services/MentorshipService";
import UserService from "../../services/UserService";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  title: {
    margin: 0,
  },
  subtitle: {
    color: "#666",
    marginTop: "8px",
  },
  createButton: {
    height: "40px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  card: {
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
  },
  cardMeta: {
    marginBottom: "16px",
  },
  tag: {
    borderRadius: "6px",
    padding: "4px 12px",
    marginRight: "8px",
  },
  message: {
    background: "#f9f9f9",
    padding: "16px",
    borderRadius: "8px",
    marginTop: "16px",
  },
  viewButton: {
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
  },
  emptyState: {
    padding: "48px",
    textAlign: "center",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
};

const getTypeColor = (type) => {
  switch (type) {
    case "ACADEMIC":
      return "blue";
    case "CAREER":
      return "green";
    case "PERSONAL":
      return "purple";
    default:
      return "default";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "PENDING":
      return "warning";
    case "Completed":
      return "default";
    default:
      return "default";
  }
};

function MentorRequestListPage() {
  const [mentorships, setMentorships] = useState([]);
  const [mentorshipUsers, setMentorshipUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");

  useEffect(() => {
    fetchMentorships();
  }, []);

  const fetchMentorships = async () => {
    try {
      setLoading(true);
      const response = await MentorshipService.getAllMentorships(
        { alumniId: userInfo.userId },
        { page: 1, size: 50 }
      );

      // Fetch user information for each mentorship
      const userPromises = response.items.map(async (mentorship) => {
        if (mentorship.aumniId) {
          try {
            const userData = await UserService.getUser(mentorship.aumniId);
            return { id: mentorship.aumniId, user: userData };
          } catch (error) {
            console.error(`Error fetching user ${mentorship.aumniId}:`, error);
            return { id: mentorship.aumniId, user: null };
          }
        }
        return null;
      });

      const users = await Promise.all(userPromises);
      const usersMap = {};
      users.forEach((item) => {
        if (item) {
          usersMap[item.id] = item.user;
        }
      });

      setMentorshipUsers(usersMap);
      setMentorships(response.items);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách yêu cầu mentorship",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (values) => {
    try {
      await MentorshipService.createMentorship({
        aumniId: userInfo.userId,
        ...values,
      });
      notification.success({
        message: "Thành công",
        description: "Tạo yêu cầu mentorship thành công",
      });
      setModalVisible(false);
      form.resetFields();
      fetchMentorships();
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể tạo yêu cầu mentorship",
      });
    }
  };

  const handleViewDetails = (mentorshipId) => {
    navigate(`/create-schedule/${mentorshipId}`);
  };

  if (loading) {
    return (
      <UserLayout>
        <div style={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      </UserLayout>
    );
  }
  return (
    <UserLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <Title level={2} style={styles.title}>
              Yêu cầu Mentorship
            </Title>
            <Text style={styles.subtitle}>
              Quản lý các yêu cầu mentorship của bạn
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
            style={styles.createButton}
          >
            Tạo yêu cầu mới
          </Button>
        </div>

        {mentorships.length === 0 ? (
          <div style={styles.emptyState}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Text>
                  Bạn chưa có yêu cầu mentorship nào. Hãy tạo yêu cầu mới để bắt
                  đầu!
                </Text>
              }
            >
              {userInfo.roleName === "Alumni" && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setModalVisible(true)}
                >
                  Tạo yêu cầu mới
                </Button>
              )}
            </Empty>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {mentorships.map((mentorship) => (
              <Col xs={24} sm={24} md={12} lg={8} key={mentorship.id}>
                <Card style={styles.card} hoverable>
                  <div style={styles.cardMeta}>
                    <Space
                      direction="vertical"
                      size="small"
                      style={{ width: "100%" }}
                    >
                      <Space>
                        <Tag
                          icon={<BookOutlined />}
                          color={getTypeColor(mentorship.type)}
                          style={styles.tag}
                        >
                          {mentorship.type}
                        </Tag>
                        <Tag
                          icon={<ClockCircleOutlined />}
                          color={getStatusColor(mentorship.status)}
                          style={styles.tag}
                        >
                          {mentorship.status}
                        </Tag>
                      </Space>

                      {mentorship.aumniId &&
                        mentorshipUsers[mentorship.aumniId] && (
                          <Space align="center">
                            <Avatar
                              size={32}
                              icon={<UserOutlined />}
                              src={
                                mentorshipUsers[mentorship.aumniId]
                                  .profilePicture
                              }
                            >
                              {mentorshipUsers[
                                mentorship.aumniId
                              ].firstName?.charAt(0)}
                            </Avatar>
                            <div>
                              <Text strong>
                                {`${
                                  mentorshipUsers[mentorship.aumniId].firstName
                                } ${
                                  mentorshipUsers[mentorship.aumniId].lastName
                                }`}
                              </Text>
                              <br />
                              <Text
                                type="secondary"
                                style={{ fontSize: "12px" }}
                              >
                                {mentorshipUsers[mentorship.aumniId].email}
                              </Text>
                            </div>
                          </Space>
                        )}
                    </Space>
                  </div>

                  <div style={styles.message}>
                    <Text type="secondary">
                      <MessageOutlined style={{ marginRight: 8 }} />
                      Yêu cầu:
                    </Text>
                    <Paragraph ellipsis={{ rows: 2 }} style={{ marginTop: 8 }}>
                      {mentorship.requestMessage}
                    </Paragraph>
                  </div>

                  <Button
                    type="primary"
                    style={{ ...styles.viewButton, marginTop: 16 }}
                    onClick={() => handleViewDetails(mentorship.id)}
                    block
                    hidden={!userInfo.isMentor} // Only show the button if the user is a mentor
                  >
                    Chấp nhận và đặt lịch
                    <RightOutlined />
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <Modal
          title="Tạo yêu cầu Mentorship mới"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateRequest}>
            <Form.Item
              name="type"
              label="Loại mentorship"
              rules={[
                { required: true, message: "Vui lòng chọn loại mentorship" },
              ]}
            >
              <Select size="large">
                <Option value="ACADEMIC">Học thuật</Option>
                <Option value="CAREER">Nghề nghiệp</Option>
                <Option value="PERSONAL">Cá nhân</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="requestMessage"
              label="Nội dung yêu cầu"
              rules={[
                { required: true, message: "Vui lòng nhập nội dung yêu cầu" },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Mô tả chi tiết yêu cầu của bạn..."
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Space>
                <Button onClick={() => setModalVisible(false)}>Hủy</Button>
                <Button type="primary" htmlType="submit">
                  Gửi yêu cầu
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </UserLayout>
  );
}

export default MentorRequestListPage;

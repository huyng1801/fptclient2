import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Avatar,
  Tag,
  Spin,
  Button,
  Row,
  Col,
  Statistic,
  message,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  StarOutlined,
  BookOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import UserLayout from "../../layouts/UserLayout";
import UserService from "../../services/UserService";

const { Title, Text, Paragraph } = Typography;

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  card: {
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    border: "1px solid #f0f0f0",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    padding: "24px",
    borderBottom: "1px solid #f0f0f0",
  },
  avatar: {
    width: 120,
    height: 120,
    border: "2px solid #1890ff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  info: {
    flex: 1,
  },
  name: {
    margin: "0 0 8px 0",
    color: "#1890ff",
  },
  email: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
  },
  tags: {
    marginTop: "16px",
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  stats: {
    padding: "24px",
    background: "#fafafa",
    borderRadius: "8px",
    marginTop: "24px",
  },
  content: {
    padding: "24px",
  },
  section: {
    marginBottom: "24px",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
  },
};

function MentorDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        const userInfo = sessionStorage.getItem("userInfo");
        if (!userInfo) {
          message.warning("Vui lòng đăng nhập để xem thông tin chi tiết");
          navigate("/login");
          return;
        }

        setLoading(true);
        const data = await UserService.getUser(id);
        setMentor(data);
        setError(null);
      } catch (err) {
        setError("Không thể tải thông tin mentor. Vui lòng thử lại sau.");
        message.error("Không thể tải thông tin mentor");
      } finally {
        setLoading(false);
      }
    };

    fetchMentorDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <UserLayout>
        <div style={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <div style={styles.container}>
          <Card style={styles.card}>
            <div style={styles.content}>
              <Text type="danger">{error}</Text>
            </div>
          </Card>
        </div>
      </UserLayout>
    );
  }

  if (!mentor) {
    return (
      <UserLayout>
        <div style={styles.container}>
          <Card style={styles.card}>
            <div style={styles.content}>
              <Text>Không tìm thấy thông tin mentor</Text>
            </div>
          </Card>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div style={styles.container}>
        <Card style={styles.card}>
          <div style={styles.header}>
            <Avatar
              size={120}
              icon={<UserOutlined />}
              src={mentor.profilePicture}
              style={styles.avatar}
            />
            <div style={styles.info}>
              <Title level={2} style={styles.name}>
                {`${mentor.firstName} ${mentor.lastName}`}
              </Title>

              <div style={styles.email}>
                <MailOutlined />
                <Text>{mentor.email}</Text>
                {mentor.emailVerified && <Tag color="success">Verified</Tag>}
              </div>

              <div style={styles.tags}>
                <Tag color="blue" icon={<TeamOutlined />}>
                  {mentor.roleName || "Role not specified"}
                </Tag>
                {mentor.isMentor && (
                  <Tag color="purple" icon={<StarOutlined />}>
                    Mentor
                  </Tag>
                )}
                {mentor.majorId && (
                  <Tag color="cyan" icon={<BookOutlined />}>
                    Major ID: {mentor.majorId}
                  </Tag>
                )}
              </div>
            </div>
          </div>

          <div style={styles.content}>
            <div style={styles.stats}>
              <Row gutter={24}>
                <Col span={8}>
                  <Statistic
                    title="Đánh giá"
                    value={4.9}
                    prefix={<StarOutlined />}
                    precision={1}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Học viên"
                    value={150}
                    prefix={<TeamOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Khóa học"
                    value={12}
                    prefix={<BookOutlined />}
                  />
                </Col>
              </Row>
            </div>

            {mentor.isMentor && (
              <div style={styles.section}>
                <Title level={3}>Giới thiệu</Title>
                <Paragraph>
                  Mentor với nhiều năm kinh nghiệm trong lĩnh vực công nghệ
                  thông tin. Chuyên môn sâu về phát triển phần mềm và hướng dẫn
                  sinh viên.
                </Paragraph>
                <Button type="primary" size="large" block>
                  Gửi yêu cầu kết nối
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </UserLayout>
  );
}

export default MentorDetailsPage;

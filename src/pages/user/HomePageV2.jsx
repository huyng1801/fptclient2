import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Typography, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import {
  EnvironmentOutlined,
  ProfileOutlined,
  ReadOutlined,
  DollarCircleOutlined,
  SafetyOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import UserLayout from "../../layouts/UserLayout"; // Assuming the path to UserLayout
import PostService from "../../services/PostService";
import EventService from "../../services/EventService";
import JobPostService from "../../services/JobPostService";
import UserService from "../../services/UserService";
import {MainBodyListItem} from "../../components/MainBodyListItem";


const { Title, Text } = Typography;
const { Option } = Select;

function HomePageV2() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [organizers, setOrganizers] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortOption, setSortOption] = useState("latest");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedPosts = await PostService.getAllPosts();
        setPosts(fetchedPosts.items);
        setFilteredPosts(fetchedPosts.items);

        const fetchedEvents = await EventService.getAllEvents();
        setEvents(fetchedEvents.items);

        const fetchedJobs = await JobPostService.getAllJobPosts();
        setJobs(fetchedJobs.items);

        const userPromises = fetchedEvents.items.map((event) => {
          if (event.organizerId) {
            return UserService.getUser(event.organizerId)
              .then((user) => ({ organizerId: event.organizerId, user }))
              .catch((error) => {
                console.error(`Error fetching user with ID ${event.organizerId}:`, error);
                return { organizerId: event.organizerId, user: null };
              });
          }
          return Promise.resolve({ organizerId: event.organizerId, user: null });
        });

        const users = await Promise.all(userPromises);
        const organizersData = {};
        users.forEach(({ organizerId, user }) => {
          if (user) {
            organizersData[organizerId] = user;
          }
        });

        setOrganizers(organizersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query)
    );
    setFilteredPosts(filtered);
  };

  const handleCategoryChange = (value) => {
    setFilterCategory(value);
    // Add filter logic based on category if required
  };

  const handleSortChange = (value) => {
    setSortOption(value);
    // Implement sorting logic based on selected option
    const sortedPosts = [...filteredPosts].sort((a, b) => {
      if (value === "latest") {
        return new Date(b.time) - new Date(a.time);
      } else if (value === "oldest") {
        return new Date(a.time) - new Date(b.time);
      }
      return 0;
    });
    setFilteredPosts(sortedPosts);
  };

  return (
    <UserLayout>
      <Row gutter={[16, 16]}>
        {/* Post Section */}
        <Col span={12}>
          <Title level={3} style={{ marginBottom: "20px", fontWeight: "600" }}>Diễn đàn</Title>

          <Row gutter={[16, 16]}>
            {/* Search and Order Section */}
            <Col span={12}>
              <Select
                defaultValue="latest"
                style={{ width: "100%", marginBottom: 15 }}
                onChange={handleSortChange}
              >
                <Option value="latest">Mới nhất</Option>
                <Option value="oldest">Cũ nhất</Option>
              </Select>
            </Col>
            <Col span={12}>
              <Input
                placeholder="Tìm kiếm bài viết"
                value={searchQuery}
                onChange={handleSearch}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
                }}
              />
            </Col>
          </Row>

          {filteredPosts.slice(0, 5).map((post) => (
            <MainBodyListItem
              key={post.postId}
              onClick={() => navigate(`/post/${post.postId}`)}
              item={post}
            />
          ))}
          <Button
            type="primary"
            onClick={() => navigate("/list-post")}
            style={{
              width: "100%",
              marginTop: "10px",
              borderRadius: "8px",
              padding: "12px",
              backgroundColor: "#1890ff",
              color: "#fff",
              fontWeight: "600"
            }}
          >
            Xem thêm
          </Button>
        </Col>
        {/* Event and Job Sections */}
        <Col span={12}>
          <Row gutter={[16, 16]}>
            {/* Event Section */}
            <Col span={12}>
              <Title level={3} style={{ marginBottom: "20px", fontWeight: "600" }}>Sự kiện</Title>
              {events.slice(0, 3).map((event) => (
                <Card
                  key={event.eventId}
                  hoverable
                  style={{
                    marginBottom: "20px",
                    borderRadius: "12px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={() => navigate(`/event/${event.eventId}`)}
                >
                  <Card.Meta
                    title={<a>{event.eventName}</a>}
                    description={event.description}
                  />
                  <div style={{ marginTop: "10px", fontSize: "14px" }}>
                    <Text>
                      <ClockCircleOutlined /> Thời gian: {event.time}
                    </Text>
                    <br />
                    <Text>
                      <EnvironmentOutlined /> Địa điểm: {event.location}
                    </Text>
                    <br />
                    <Text>
                      <UserOutlined /> Người tổ chức:{" "}
                      {organizers[event.organizerId]
                        ? `${organizers[event.organizerId]?.firstName} ${organizers[event.organizerId]?.lastName}`
                        : "Loading..."}
                    </Text>
                  </div>
                </Card>
              ))}
              <Button
                type="primary"
                onClick={() => navigate("/list-event")}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  borderRadius: "8px",
                  padding: "12px",
                  backgroundColor: "#1890ff",
                  color: "#fff",
                  fontWeight: "600"
                }}
              >
                Xem thêm
              </Button>
            </Col>

            {/* Job Post Section */}
            <Col span={12}>
              <Title level={3} style={{ marginBottom: "20px", fontWeight: "600" }}>Tuyển dụng</Title>
              {jobs.slice(0, 2).map((job) => (
                <Card
                  key={job.jobPostId}
                  hoverable
                  style={{
                    marginBottom: "20px",
                    borderRadius: "12px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={() => navigate(`/user-job-post/${job.jobPostId}`)}
                >
                  <Card.Meta
                    title={<a>{job.jobTitle}</a>}
                    description={job.jobDescription}
                  />
                  <div style={{ marginTop: "10px", fontSize: "14px" }}>
                    <Text>
                      <EnvironmentOutlined /> Địa điểm: {job.location}
                    </Text>
                    <br />
                    <Text>
                      <ProfileOutlined /> Mô tả: {job.jobDescription}
                    </Text>
                    <br />
                    <Text>
                      <ReadOutlined /> Yêu cầu: {job.requirements}
                    </Text>
                    <br />
                    <Text>
                      <DollarCircleOutlined /> Lương:{" "}
                      {job.isDeal
                        ? `${job.minSalary} - ${job.maxSalary} USD (Có thể thương lượng)`
                        : `${job.minSalary} - ${job.maxSalary} USD`}
                    </Text>
                    <br />
                    <Text>
                      <SafetyOutlined /> Quyền lợi: {job.benefits}
                    </Text>
                    <br />
                  </div>
                </Card>
              ))}
              <Button
                type="primary"
                onClick={() => navigate("/list-job")}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  borderRadius: "8px",
                  padding: "12px",
                  backgroundColor: "#1890ff",
                  color: "#fff",
                  fontWeight: "600"
                }}
              >
                Xem thêm
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </UserLayout>
  );
}

export default HomePageV2;

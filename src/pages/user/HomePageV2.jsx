import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Box } from "@mui/material";
import HeaderComponent from "../../components/common/HeaderComponent";
import FooterComponent from "../../components/common/FooterComponent";
import { MainBodyListItem } from "./ListPostPage";
import { useNavigate } from "react-router-dom";
import PostService from "../../services/PostService"; // Import the PostService
import EventService from "../../services/EventService"; // Import the EventService
import JobPostService from "../../services/JobPostService"; // Import the JobService
import UserService from "../../services/UserService";
import { LocationOn, Description, School, AttachMoney, VerifiedUser, Event, Visibility, AccessTime, Person } from "@mui/icons-material";
function HomePageV2() {
  const [posts, setPosts] = useState([]); // State to store posts
  const [events, setEvents] = useState([]); // State to store events
  const [jobs, setJobs] = useState([]); // State to store jobs
  const [organizers, setOrganizers] = useState({});

  const navigate = useNavigate();

  // Fetch posts, events, and jobs when the component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedPosts = await PostService.getAllPosts();
        setPosts(fetchedPosts.items);

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
                return { organizerId: event.organizerId, user: null }; // Return null if user fetch fails
              });
          }
          return Promise.resolve({ organizerId: event.organizerId, user: null });
        });

        // Wait for all user fetch requests to complete
        const users = await Promise.all(userPromises);
        
        // Organize the user data into an object by organizerId
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
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderComponent />

      <Box sx={{ backgroundColor: "#F7F7F7", py: 4 }}>
        <Container>
          <Row className="mb-4">
            {/* Posts Section */}
            <Col md={4}>
              <h4 className="mb-3">Diễn đàn</h4>
              {posts.map((post) => (
                <MainBodyListItem
                  key={post.postId} // Ensure each item has a unique key, assuming `id` is available
                  onClick={() => navigate(`/post/${post.postId}`)} // Dynamically navigate to the post detail page
                  item={post}
                />
              ))}
              <Button
                onClick={() => navigate("/list-post")}
                variant="warning"
                className="mt-2"
              >
                Xem thêm
              </Button>
            </Col>

            {/* Events Section */}
            <Col md={4}>
              <h4 className="mb-3">Sự kiện</h4>
              {events.map((event) => (
                <Card className="mb-3 shadow-sm" key={event.eventId}>
                  <Card.Body>
                    {/* Make the title clickable */}
                    <Card.Title
                      className="text-primary"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/event/${event.eventId}`)}
                    >
                      {event.eventName}
                    </Card.Title>
                    <Card.Text>{event.description}</Card.Text>
                    <div className="text-muted">
                      <p className="mb-1 d-flex align-items-center">
                        <AccessTime fontSize="small" className="me-2" />
                        Thời gian: {event.time}
                      </p>
                      <p className="mb-1 d-flex align-items-center">
                        <Visibility fontSize="small" className="me-2" />
                        Địa điểm: {event.location}
                      </p>
                      <p className="mb-1 d-flex align-items-center">
                        <Person fontSize="small" className="me-2" />
                        Người tổ chức: {organizers[event.organizerId] ? `${organizers[event.organizerId]?.firstName} ${organizers[event.organizerId]?.lastName}` : "Loading user..."}
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              ))}
              <Button
                onClick={() => navigate("/list-event")}
                variant="warning"
                className="mt-2"
              >
                Xem thêm
              </Button>
            </Col>

            {/* Jobs Section */}
            <Col md={4}>
                <h4 className="mb-3">Tuyển dụng</h4>
                {jobs.map((job) => (
                  <Card className="mb-3 shadow-sm" key={job.jobPostId}>
                    <Card.Body>
                      {/* Job Title */}
                      <Card.Title className="text-primary" style={{ cursor: 'pointer' }} onClick={() => navigate(`/user-job-post/${job.jobPostId}`)}>
                        {job.jobTitle}
                      </Card.Title>
                      
                      {/* Location */}
                      <Card.Text className="mb-2 d-flex align-items-center">
                        <LocationOn fontSize="small" className="me-2" />
                        Địa điểm: {job.location}
                      </Card.Text>

                      {/* Job Description */}
                      <Card.Text className="mb-2 d-flex align-items-center">
                        <Description fontSize="small" className="me-2" />
                        Mô tả: {job.jobDescription}
                      </Card.Text>

                      {/* Requirements */}
                      <Card.Text className="mb-2 d-flex align-items-center">
                        <School fontSize="small" className="me-2" />
                        Yêu cầu: {job.requirements}
                      </Card.Text>

                      {/* Salary */}
                      <Card.Text className="mb-2 d-flex align-items-center">
                        <AttachMoney fontSize="small" className="me-2" />
                        Lương:{" "}
                        {job.isDeal
                          ? `${job.minSalary} - ${job.maxSalary} USD (Có thể thương lượng)`
                          : `${job.minSalary} - ${job.maxSalary} USD`}
                      </Card.Text>

                      {/* VerifiedUser */}
                      <Card.Text className="mb-2 d-flex align-items-center">
                        <VerifiedUser fontSize="small" className="me-2" />
                        Quyền lợi: {job.benefits}
                      </Card.Text>

                      {/* Post Date */}
                      <Card.Text className="text-muted d-flex align-items-center">
                        <Event fontSize="small" className="me-2" />
                        Ngày đăng:{" "}
                        {new Date(job.time).toLocaleDateString("vi-VN")}
                      </Card.Text>

                    </Card.Body>
                  </Card>
                ))}
              <Button
                onClick={() => navigate("/list-job")}
                variant="warning"
                className="mt-2"
              >
                Xem thêm
              </Button>
            </Col>

          </Row>
        </Container>
      </Box>

      <FooterComponent />
    </div>
  );
}

export default HomePageV2;

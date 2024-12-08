import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../layouts/UserLayout/UserLayout";
import PostService from "../../services/PostService";
import EventService from "../../services/EventService";
import JobPostService from "../../services/JobPostService";
import UserService from "../../services/UserService";
import PostSection from "../../components/PostSection/PostSection";
import EventCard from "../../components/EventCard/EventCard";
import JobCard from "../../components/JobCard/JobCard";
import SectionList from "../../components/SectionList/SectionList";
import useFetchData from "../../hooks/useFetchData";

function HomePage() {
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [organizers, setOrganizers] = useState({});
  const navigate = useNavigate();

  const { data: posts } = useFetchData(PostService.getAllPosts);
  const { data: events } = useFetchData(EventService.getAllEvents);
  const { data: jobs } = useFetchData(JobPostService.getAllJobPosts);

  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  useEffect(() => {
    async function fetchOrganizers() {
      const userPromises = events.map((event) => {
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
    }

    if (events.length > 0) {
      fetchOrganizers();
    }
  }, [events]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query)
    );
    setFilteredPosts(filtered);
  };

  const handleSortChange = (value) => {
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
        <PostSection
          posts={filteredPosts}
          searchQuery={searchQuery}
          onSearch={handleSearch}
          onSortChange={handleSortChange}
        />
        
        <Col span={12}>
          <Row gutter={[16, 16]}>
            <SectionList
              title="Sự kiện"
              items={events.slice(0, 3)}
              renderItem={(event) => (
                <EventCard
                  key={event.eventId}
                  event={event}
                  organizer={organizers[event.organizerId]}
                  onClick={() => navigate(`/event/${event.eventId}`)}
                />
              )}
              viewAllPath="/list-event"
            />

            <SectionList
              title="Tuyển dụng"
              items={jobs.slice(0, 2)}
              renderItem={(job) => (
                <JobCard
                  key={job.jobPostId}
                  job={job}
                  onClick={() => navigate(`/user-job-post/${job.jobPostId}`)}
                />
              )}
              viewAllPath="/list-job"
            />
          </Row>
        </Col>
      </Row>
    </UserLayout>
  );
}

export default HomePage;
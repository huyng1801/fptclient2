import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Typography, Input } from "antd";
import { useNavigate } from "react-router-dom";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import UserLayout from "../../layouts/UserLayout"; // Assuming the path to UserLayout
import EventService from "../../services/EventService";
import UserService from "../../services/UserService";

const { Title, Text } = Typography;

function ListEventPage() {
  const [events, setEvents] = useState([]);
  const [organizers, setOrganizers] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedEvents = await EventService.getAllEvents();
        setEvents(fetchedEvents.items);

        // Fetch organizers for events
        const userPromises = fetchedEvents.items.map((event) => {
          if (event.organizerId) {
            return UserService.getUser(event.organizerId)
              .then((user) => ({ organizerId: event.organizerId, user }))
              .catch((error) => {
                console.error(
                  `Error fetching user with ID ${event.organizerId}:`,
                  error
                );
                return { organizerId: event.organizerId, user: null };
              });
          }
          return Promise.resolve({
            organizerId: event.organizerId,
            user: null,
          });
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
  };

  const filteredEvents = events.filter((event) =>
    event.eventName.toLowerCase().includes(searchQuery)
  );

  return (
    <UserLayout>
      <Row gutter={[16, 16]}>
        {/* Event Search Section */}
        <Col span={24}>
          <Input
            placeholder="Tìm kiếm sự kiện"
            value={searchQuery}
            onChange={handleSearch}
            style={{
              width: "100%",
              borderRadius: "8px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              marginBottom: "20px",
            }}
          />
        </Col>

        {/* Event List Section */}
        <Col span={24}>
          <Row gutter={[16, 16]}>
            {filteredEvents.map((event) => (
              <Col span={12}>
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
                          ? `${organizers[event.organizerId]?.firstName} ${
                              organizers[event.organizerId]?.lastName
                            }`
                          : "Loading..."}
                      </Text>
                    </div>
                  </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </UserLayout>
  );
}

export default ListEventPage;

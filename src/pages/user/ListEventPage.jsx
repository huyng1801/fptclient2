import React, { useState, useEffect } from "react";
import { Row, Col, Input, Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../layouts/UserLayout";
import EventService from "../../services/EventService";
import UserService from "../../services/UserService";
import EventCard from "../../components/EventCard/EventCard";

const { Title, Text } = Typography;

const styles = {
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
  },
  searchInput: {
    width: '100%',
    borderRadius: '8px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '32px',
    height: '48px',
    fontSize: '16px',
  },
  createButton: {
    marginTop: '32px',
  }
};

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
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredEvents = events.filter((event) =>
    event.eventName.toLowerCase().includes(searchQuery)
  );

  return (
    <UserLayout>
        <div style={styles.header}>
          <Title level={2} style={styles.title}>
            Khám phá sự kiện
          </Title>
          <Text style={styles.subtitle}>
            Tìm kiếm và tham gia các sự kiện thú vị
          </Text>
        </div>

        <Input
          placeholder="Tìm kiếm sự kiện"
          value={searchQuery}
          onChange={handleSearch}
          style={styles.searchInput}
        />
      {/* Create Event Button */}
      <Button 
          type="primary" 
          onClick={() => navigate("/create-event")} 
          style={styles.createButton}
        >
          Tạo sự kiện mới
        </Button>
        <Row gutter={[24, 24]}>
          {filteredEvents.map((event) => (
            <Col key={event.eventId} xs={24} sm={24} md={12} lg={12} xl={8}>
              <EventCard
                event={event}
                organizer={organizers[event.organizerId]}
                onClick={() => navigate(`/event/${event.eventId}`)}
              />
            </Col>
          ))}
        </Row>
    </UserLayout>
  );
}

export default ListEventPage;
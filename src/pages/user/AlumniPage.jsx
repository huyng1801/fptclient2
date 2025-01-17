import React, { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Button,
  Typography,
  notification,
  Spin,
  Input,
} from "antd";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../layouts/UserLayout";
import MentorCard from "../../components/MentorDashboard/MentorCard";
import RequestForm from "../../components/MentorDashboard/RequestForm";
import { PagingListItem } from "../../components/PagingListItem";
import UserService from "../../services/UserService";

const { Title } = Typography;

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  filterContainer: {
    marginBottom: "24px",
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  content: {
    marginBottom: "32px",
    minHeight: "400px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  pagination: {
    textAlign: "center",
    marginTop: "32px",
  },
};

function MentorDashboardPage() {
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]); // State for filtered mentors
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ title: "", content: "" });
  const navigate = useNavigate();
  const itemsPerPage = 6;

  useEffect(() => {
    fetchMentors();
  }, [currentPage]);

  useEffect(() => {
    // Filter mentors based on search term
    const filtered = mentors.filter((mentor) => {
      const fullName = `${mentor.firstName} ${mentor.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
    setFilteredMentors(filtered);
  }, [mentors, searchTerm]);
  

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const filter = {
        roleId: 2,
      };

      const response = await UserService.getAllUsers(filter, {
        page: currentPage,
        size: itemsPerPage,
      });

      setMentors(response.items);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      setError(err.message);
      notification.error({
        message: "Error",
        description: "Failed to load mentors. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update search term
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = () => {
    notification.success({
      message: "Success",
      description: "Your request has been sent successfully!",
    });
    setIsFormModalOpen(false);
    setFormValues({ title: "", content: "" });
  };

  const showMentorDashboardDetails = (mentorId) => {
    // navigate(`/user/${mentorId}`);
  };

  if (error) {
    return (
      <UserLayout>
        <div style={styles.container}>
          <Title level={4} style={{ color: "red" }}>
            Error loading mentors: {error}
          </Title>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div>
        <div style={styles.header}>
          <Title level={2}>Người dùng</Title>
          <Input
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ width: "300px" }}
          />
        </div>

        <div style={styles.content}>
          {loading ? (
            <Spin size="large" />
          ) : (
            <Row gutter={[24, 24]}>
              {filteredMentors.map((mentor, index) => (
                <Col
                  xs={24}
                  md={filteredMentors.length <= 2 ? 24 : 12} // Full-width for 1-2 items, half-width otherwise
                  key={mentor.userId || index} // Added index as a fallback key
                >
                  <MentorCard
                    mentor={mentor}
                    onClick={showMentorDashboardDetails}
                  />
                </Col>
              ))}
            </Row>
          )}
        </div>

        {!loading && totalPages > 1 && (
          <div style={styles.pagination}>
            <PagingListItem
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </div>
        )}

        <RequestForm
          visible={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          formValues={formValues}
          onChange={handleFormChange}
        />
      </div>
    </UserLayout>
  );
}

export default MentorDashboardPage;

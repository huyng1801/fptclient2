import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Button, Typography, notification, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../layouts/UserLayout";
import MentorCard from "../../components/MentorDashboard/MentorCard";
import RequestForm from "../../components/MentorDashboard/RequestForm";
import { PagingListItem } from "../../components/PagingListItem";
import UserService from "../../services/UserService";

const { Title } = Typography;

const styles = {

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  title: {
    margin: 0,
    color: '#1890ff',
  },
  button: {
    height: '40px',
    borderRadius: '8px',
    fontWeight: '500',
  },
  content: {
    marginBottom: '32px',
    minHeight: '400px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    textAlign: 'center',
    marginTop: '32px',
  },
};

function MentorDashboardPage() {
  const [mentors, setMentors] = useState([]);
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

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const filter = { isMentor: true };
      const response = await UserService.getAllUsers(filter, { 
        page: currentPage, 
        size: itemsPerPage 
      });
      
      setMentors(response.items);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      setError(err.message);
      notification.error({
        message: 'Error',
        description: 'Failed to load mentors. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = () => {
    notification.success({
      message: 'Success',
      description: 'Your request has been sent successfully!',
    });
    setIsFormModalOpen(false);
    setFormValues({ title: "", content: "" });
  };

  const showMentorDashboardDetails = (mentorId) => {
    navigate(`/mentorDashboard/${mentorId}`);
  };

  if (error) {
    return (
      <UserLayout>
        <div style={styles.container}>
          <Title level={4} style={{ color: 'red' }}>
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
          <Button 
            type="primary" 
            onClick={() => setIsFormModalOpen(true)}
            style={styles.button}
          >
            Gửi Yêu Cầu
          </Button>
        </div>

        <div style={styles.content}>
          {loading ? (
            <Spin size="large" />
          ) : (
            <Row gutter={[24, 24]}>
              {mentors.map((mentor) => (
                <Col xs={24} md={12} key={mentor.userId}>
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
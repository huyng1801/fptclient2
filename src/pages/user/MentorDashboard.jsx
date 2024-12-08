import React, { useState } from "react";
import { Layout, Row, Col, Button, Typography, notification } from "antd";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../layouts/UserLayout/UserLayout";
import MentorCard from "../../components/MentorDashboard/MentorCard";
import RequestForm from "../../components/MentorDashboard/RequestForm";
import { PagingListItem } from "../../components/PagingListItem";

const { Title } = Typography;

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
  },
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
  },
  pagination: {
    textAlign: 'center',
    marginTop: '32px',
  },
};

function MentorDashboardPage() {
  const mentors = [
    {
      img: "/assets/images/logo.png",
      name: "Tên mentor 1",
      role: "Role mentor 1",
      major: "Chuyên ngành mentor 1",
      rating: "4.9",
    },
    // ... rest of the mentors data
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ title: "", content: "" });
  const navigate = useNavigate();
  const itemsPerPage = 6;

  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return mentors.slice(startIndex, startIndex + itemsPerPage);
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

  const showMentorDashboardDetails = () => {
    navigate("/mentorDashboard/1");
  };

  return (
    <UserLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <Title level={2} style={styles.title}>
            Danh Sách Mentor
          </Title>
          <Button 
            type="primary" 
            onClick={() => setIsFormModalOpen(true)}
            style={styles.button}
          >
            Gửi Yêu Cầu
          </Button>
        </div>

        <div style={styles.content}>
          <Row gutter={[24, 24]}>
            {getCurrentItems().map((mentor, index) => (
              <Col xs={24} md={12} key={index}>
                <MentorCard
                  mentor={mentor}
                  onClick={showMentorDashboardDetails}
                />
              </Col>
            ))}
          </Row>
        </div>

        <div style={styles.pagination}>
          <PagingListItem
            currentPage={currentPage}
            totalPages={Math.ceil(mentors.length / itemsPerPage)}
            handlePageChange={handlePageChange}
          />
        </div>

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
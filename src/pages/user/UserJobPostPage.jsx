import React, { useState } from 'react';
import { Layout, Typography, Button, Row, Col, Spin, notification, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../../layouts/UserLayout/UserLayout';
import JobCard from '../../components/JobCard/JobCard';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

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
  },
  searchBar: {
    marginBottom: '24px',
  },
  searchInput: {
    borderRadius: '8px',
    height: '40px',
  },
  createButton: {
    height: '40px',
    borderRadius: '8px',
    fontWeight: '500',
  },
};

const UserJobPostPage = () => {
  const [jobPosts] = useState([
    {
      jobPostId: 1,
      jobTitle: 'Lập Trình Viên Frontend',
      location: 'Hà Nội, Việt Nam',
      createdAt: '2024-10-15',
      minSalary: 10000000,
      maxSalary: 15000000,
    },
    {
      jobPostId: 2,
      jobTitle: 'Lập Trình Viên Backend',
      location: 'Thành phố Hồ Chí Minh, Việt Nam',
      createdAt: '2024-10-10',
      minSalary: 12000000,
      maxSalary: 17000000,
    },
    {
      jobPostId: 3,
      jobTitle: 'Thiết Kế UI/UX',
      location: 'Đà Nẵng, Việt Nam',
      createdAt: '2024-10-12',
      minSalary: 8000000,
      maxSalary: 12000000,
    },
  ]);

  const [loading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleViewDetails = (jobId) => {
    navigate(`/user-job-post/${jobId}`);
  };

  const handleApply = (jobId) => {
    notification.success({
      message: 'Đăng Ký Thành Công',
      description: 'Đơn đăng ký của bạn đã được gửi thành công!',
    });
  };

  const filteredJobs = jobPosts.filter(job =>
    job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <UserLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <Title level={2} style={styles.title}>Danh Sách Việc Làm</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/create-job-post')}
            style={styles.createButton}
          >
            Tạo Việc Làm Mới
          </Button>
        </div>

        <div style={styles.searchBar}>
          <Input
            placeholder="Tìm kiếm việc làm..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={handleSearch}
            style={styles.searchInput}
          />
        </div>

        <Row gutter={[24, 24]}>
          {filteredJobs.map(job => (
            <Col xs={24} sm={24} md={12} lg={8} key={job.jobPostId}>
              <JobCard
                job={job}
                onViewDetails={handleViewDetails}
                onApply={handleApply}
              />
            </Col>
          ))}
        </Row>
      </div>
    </UserLayout>
  );
};

export default UserJobPostPage;
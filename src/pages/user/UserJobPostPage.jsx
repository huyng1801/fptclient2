import React, { useState } from 'react';
import { Layout, Typography, Button, Row, Col, Spin, notification, Input, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import UserLayout from '../../layouts/UserLayout';
import JobCard from '../../components/JobCard/JobCard';
import JobPostService from '../../services/JobPostService';
import useFetchData from '../../hooks/useFetchData';

const { Title } = Typography;

const styles = {
  container: {
    margin: '0 auto',
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
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  searchInput: {
    borderRadius: '8px',
    height: '40px',
    flex: 1,
  },
  createButton: {
    height: '40px',
    borderRadius: '8px',
    fontWeight: '500',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  noResults: {
    textAlign: 'center',
    padding: '48px',
    color: '#666',
    fontSize: '16px',
  },
};

const UserJobPostPage = () => {
  const { data: jobPosts, loading, error } = useFetchData(JobPostService.getAllJobPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMyJobs, setShowMyJobs] = useState(false);
  const navigate = useNavigate();
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
  const isRecruiter = userInfo?.roleName === 'Recruiter';

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

  const handleCreateJob = () => {
    navigate('/create-job-post');
  };

  const getFilteredJobs = () => {
    if (!jobPosts) return [];
    
    return jobPosts.filter(job => {
      const matchesSearch = 
        job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesUser = !showMyJobs || job.userId === userInfo.userId;
      
      return matchesSearch && matchesUser;
    });
  };

  if (error) {
    notification.error({
      message: 'Lỗi',
      description: 'Không thể tải danh sách việc làm. Vui lòng thử lại sau.',
    });
  }

  if (loading) {
    return (
      <UserLayout>
        <div style={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      </UserLayout>
    );
  }

  const filteredJobs = getFilteredJobs();

  return (
    <UserLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <Title level={2} style={styles.title}>Danh Sách Việc Làm</Title>
          {isRecruiter && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateJob}
              style={styles.createButton}
            >
              Tạo Việc Làm Mới
            </Button>
          )}
        </div>

        <div style={styles.searchBar}>
          <Input
            placeholder="Tìm kiếm việc làm..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={handleSearch}
            style={styles.searchInput}
            allowClear
          />
          {isRecruiter && (
            <Checkbox
              checked={showMyJobs}
              onChange={(e) => setShowMyJobs(e.target.checked)}
            >
              Công việc của tôi
            </Checkbox>
          )}
        </div>

        {filteredJobs.length > 0 ? (
          <Row gutter={[24, 24]}>
            {filteredJobs.map(job => (
              <Col xs={24} sm={24} md={12} lg={8} key={job.jobPostId}>
                <JobCard
                  job={job}
                  onClick={() => handleViewDetails(job.jobPostId)}
                  onApply={() => handleApply(job.jobPostId)}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <div style={styles.noResults}>
            {searchQuery || showMyJobs
              ? 'Không tìm thấy việc làm phù hợp với tìm kiếm của bạn'
              : 'Chưa có việc làm nào được đăng tải'}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserJobPostPage;
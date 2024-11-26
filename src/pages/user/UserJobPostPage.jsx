import React, { useState } from 'react';
import { Layout, Typography, Button, Card, Row, Col, Spin, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import UserLayout from '../../layouts/UserLayout'; // Make sure this layout exists

const { Title, Text } = Typography;

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

  const navigate = useNavigate(); // Initialize the navigation hook

  if (loading) {
    return <Spin size="large" style={{ margin: '50px auto', display: 'block' }} />;
  }

  // Navigate to Create Job Post Page
  const handleCreateJobPostClick = () => {
    navigate('/create-job-post'); // Navigate to the create job post page
  };

  return (
    <UserLayout>
      <Layout style={{ padding: '0 50px' }}>
        <Title level={2}>Danh Sách Việc Làm</Title>

        {/* Button to create new job post */}
        <Button
          type="primary"
          onClick={handleCreateJobPostClick}
          style={{ 
            marginBottom: '20px', 
            width: '200px', // Limit the width of the button
            textOverflow: 'ellipsis', // To handle text overflow if needed
            overflow: 'hidden'
          }}
        >
          Tạo Việc Làm Mới
        </Button>


        <Row gutter={[16, 16]}>
          {jobPosts.length === 0 ? (
            <Text type="danger">Không có việc làm nào!</Text>
          ) : (
            jobPosts.map(job => (
              <Col span={8} key={job.jobPostId}>
                <Card
                  title={job.jobTitle}
                  extra={<Link to={`/user-job-post/${job.jobPostId}`}>Xem Chi Tiết</Link>}
                  style={{ marginBottom: '20px' }}
                >
                  <Text>{job.location}</Text>
                  <br />
                  <Text type="secondary">{new Date(job.createdAt).toLocaleDateString()}</Text>
                  <br />
                  <Text strong>{job.minSalary} - {job.maxSalary} VND</Text>
                  <br />
                  <Button
                    type="primary"
                    style={{ marginTop: '10px' }}
                    onClick={() => {
                      notification.success({
                        message: 'Đăng Ký Thành Công',
                        description: 'Đơn đăng ký của bạn đã được gửi thành công!',
                      });
                    }}
                  >
                    Nộp Đơn
                  </Button>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Layout>
    </UserLayout>
  );
};

export default UserJobPostPage;

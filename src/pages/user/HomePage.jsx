import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Input, Card, Avatar, Tag, Button, Space } from 'antd';
import { SearchOutlined, UserOutlined, CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import UserLayout from '../../layouts/UserLayout';
import PostService from '../../services/PostService';
import EventService from '../../services/EventService';
import JobPostService from '../../services/JobPostService';
import UserService from '../../services/UserService';
import EmailVerificationStatus from '../../components/EmailVerificationStatus/EmailVerificationStatus';

const { Title, Text, Paragraph } = Typography;

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
  },
  banner: {
    position: 'relative',
    height: '400px',
    backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuOrDCo0T-MGKTujDOmjvFQUrPtjHuBI95QA&s)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: '40px',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    padding: '20px',
  },
  searchSection: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  searchInput: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  section: {
    marginBottom: '48px',
  },
  leaderboardSection: {
    backgroundColor: '#f0f2f5',
    padding: '24px',
    borderRadius: '8px',
    marginBottom: '48px',
  },
  eventCard: {
    marginBottom: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
  jobCard: {
    marginBottom: '16px',
  },
  networkSection: {
    display: 'flex',
    gap: '24px',
    marginBottom: '48px',
  },
  networkCard: {
    flex: 1,
    textAlign: 'center',
    padding: '24px',
  },
};

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [originalPosts, setOriginalPosts] = useState([]);
  const [originalEvents, setOriginalEvents] = useState([]);
  const [originalJobs, setOriginalJobs] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, eventsData, jobsData] = await Promise.all([
          PostService.getAllPosts(),
          EventService.getAllEvents(),
          JobPostService.getAllJobPosts(),
        ]);
        const storedUserInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
        if (storedUserInfo.userId) {
          const userData = await UserService.getUser(storedUserInfo.userId);
          setUserInfo(userData);
          sessionStorage.setItem('userInfo', JSON.stringify(userData));
        }
        setOriginalPosts(postsData.items);
        setOriginalEvents(eventsData.items);
        setOriginalJobs(jobsData.items);
        setFilteredPosts(postsData.items);
        setFilteredEvents(eventsData.items);
        setFilteredJobs(jobsData.items);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    setFilteredPosts(
      originalPosts.filter((post) =>
        post.title.toLowerCase().includes(lowerCaseQuery) ||
        post.content.toLowerCase().includes(lowerCaseQuery)
      )
    );

    setFilteredEvents(
      originalEvents.filter((event) =>
        event.eventName.toLowerCase().includes(lowerCaseQuery) ||
        event.description.toLowerCase().includes(lowerCaseQuery) ||
        event.location.toLowerCase().includes(lowerCaseQuery)
      )
    );

    setFilteredJobs(
      originalJobs.filter((job) =>
        job.jobTitle.toLowerCase().includes(lowerCaseQuery) ||
        job.location.toLowerCase().includes(lowerCaseQuery) ||
        `${job.minSalary}-${job.maxSalary}`.includes(lowerCaseQuery)
      )
    );
  }, [searchQuery, originalPosts, originalEvents, originalJobs]);

  return (
    <UserLayout>
       {userInfo && !userInfo.emailVerified && (
        <EmailVerificationStatus emailVerified={userInfo.emailVerified} />
      )}
      <div style={styles.banner}>
        <div style={styles.bannerOverlay}>
       
          <Title level={1} style={{ color: 'white', marginBottom: '24px' }}>
            Kết nối Cựu sinh viên FPT
          </Title>
          <Text style={{ color: 'white', fontSize: '20px' }}>
            +50,000 cựu sinh viên • 15 năm thành công
          </Text>
        </div>
      </div>

      <div style={styles.container}>
      <div style={styles.searchSection}>
          <Title level={2}>Bạn đang tìm gì?</Title>
          <Input
            size="large"
            placeholder="Tìm kiếm cựu sinh viên, sự kiện, công việc..."
            prefix={<SearchOutlined />}
            style={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={styles.leaderboardSection}>
          <Title level={3}>Cựu sinh viên xuất sắc</Title>
          <Row gutter={24}>
            {[1, 2, 3].map((item) => (
              <Col span={8} key={item}>
                <Card style={{ textAlign: 'center' }}>
                  <Avatar size={80} icon={<UserOutlined />} />
                  <Title level={4} style={{ marginTop: '16px' }}>Tên Cựu Sinh Viên</Title>
                  <Text type="secondary">Chức vụ</Text>
                  <br />
                  <Text type="secondary">Công ty</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <Row gutter={24}>
          <Col span={16}>
            <div style={styles.section}>
              <Title level={3}>Sự kiện mới nhất</Title>
              {filteredEvents.slice(0, 3).map((event) => (
                <Card key={event.eventId} style={styles.eventCard}>
                  <Title level={4}>{event.title}</Title>
                  <Space>
                    <CalendarOutlined /> {new Date(event.time).toLocaleDateString()}
                    <EnvironmentOutlined /> {event.location}
                  </Space>
                  <Paragraph ellipsis={{ rows: 2 }}>{event.description}</Paragraph>
                </Card>
              ))}
              <Button type="primary">Xem tất cả sự kiện</Button>
            </div>

            <div style={styles.section}>
              <Title level={3}>Cơ hội việc làm</Title>
              {filteredJobs.slice(0, 2).map((job) => (
                <Card key={job.jobPostId} style={styles.jobCard}>
                  <Title level={4}>{job.jobTitle}</Title>
                  <Tag color="blue">{job.location}</Tag>
                  <Tag color="green">{`${job.minSalary} - ${job.maxSalary} USD`}</Tag>
                  <Paragraph ellipsis={{ rows: 2 }}>{job.jobDescription}</Paragraph>
                </Card>
              ))}
              <Button type="primary">Xem tất cả công việc</Button>
            </div>
          </Col>

          <Col span={8}>
            <div style={styles.section}>
              <Title level={3}>Bài viết mới nhất</Title>
              {filteredPosts.slice(0, 5).map((post) => (
                <Card key={post.postId} style={{ marginBottom: '16px' }}>
                  <Title level={4}>{post.title}</Title>
                  <Paragraph ellipsis={{ rows: 2 }}>{post.content}</Paragraph>
                </Card>
              ))}
              <Button type="primary">Xem tất cả bài viết</Button>
            </div>
          </Col>
        </Row>

        <div style={styles.networkSection}>
          <Card style={styles.networkCard}>
            <Title level={3}>Kết nối với cựu sinh viên</Title>
            <Paragraph>
              Tìm và kết nối với các cựu sinh viên FPT trong các ngành và địa điểm khác nhau.
            </Paragraph>
            <Button type="primary">Tìm kiếm cựu sinh viên</Button>
          </Card>

          <Card style={styles.networkCard}>
            <Title level={3}>Đóng góp</Title>
            <Paragraph>
              Góp phần vào cộng đồng FPT qua việc cố vấn, diễn thuyết, hoặc tuyển dụng.
            </Paragraph>
            <Button type="primary">Tham gia</Button>
          </Card>
        </div>
      </div>
    </UserLayout>
  );
}

export default HomePage;

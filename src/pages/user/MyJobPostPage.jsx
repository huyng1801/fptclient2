import React, { useState, useEffect } from 'react';
import { Typography, Table, Card, Input, Select, Tag, Space, Button, notification } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../../layouts/UserLayout';
import JobPostService from '../../services/JobPostService';

const { Title } = Typography;
const { Option } = Select;

const MyJobPostPage = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const navigate = useNavigate();
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    fetchMyJobPosts();
  }, []);

  const fetchMyJobPosts = async () => {
    try {
      const response = await JobPostService.getAllJobPosts();
      const myPosts = response.items.filter(post => post.userId === userInfo.userId);
      setJobPosts(myPosts);
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải danh sách việc làm',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
      sorter: (a, b) => a.jobTitle.localeCompare(b.jobTitle),
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Mức lương',
      key: 'salary',
      render: (_, record) => (
        <span>{`$${record.minSalary} - $${record.maxSalary}`}</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Open' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Chuyên ngành',
      dataIndex: 'majorName',
      key: 'majorName',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            onClick={() => navigate(`/user-job-post/${record.jobPostId}`)}
          >
            Chi tiết
          </Button>
          <Button 
            onClick={() => navigate(`/job-applications/${record.jobPostId}`)}
          >
            Xem ứng viên
          </Button>
        </Space>
      ),
    },
  ];

  const filteredJobs = jobPosts.filter(job => {
    const matchesSearch = 
      job.jobTitle.toLowerCase().includes(searchText.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <UserLayout>
      <div style={{ padding: '24px' }}>
        <Title level={2}>Việc làm của tôi</Title>

        <Card style={{ marginBottom: '24px' }}>
          <Space style={{ marginBottom: '16px' }}>
            <Input
              placeholder="Tìm kiếm theo tiêu đề hoặc địa điểm"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
            >
              <Option value="ALL">Tất cả trạng thái</Option>
              <Option value="Open">Đang mở</Option>
              <Option value="Closed">Đã đóng</Option>
            </Select>
            <Button 
              type="primary" 
              onClick={() => navigate('/create-job-post')}
            >
              Đăng tuyển mới
            </Button>
          </Space>

          <Table
            columns={columns}
            dataSource={filteredJobs}
            rowKey="jobPostId"
            loading={loading}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} việc làm`,
            }}
          />
        </Card>
      </div>
    </UserLayout>
  );
};

export default MyJobPostPage;
import React, { useState, useEffect } from 'react';
import { Typography, Table, Card, Input, Select, Tag, Space, Button, notification, Modal, Form } from 'antd';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../../layouts/UserLayout';
import JobPostService from '../../services/JobPostService';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const MyJobPostPage = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [form] = Form.useForm();
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

  const handleEdit = (job) => {
    setEditingJob(job);
    form.setFieldsValue({
      jobTitle: job.jobTitle,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits,
      location: job.location,
      minSalary: job.minSalary,
      maxSalary: job.maxSalary,
      status: job.status
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      await JobPostService.updateJobPost(editingJob.jobPostId, {
        ...editingJob,
        ...values
      });
      notification.success({
        message: 'Thành công',
        description: 'Cập nhật việc làm thành công',
      });
      setEditModalVisible(false);
      fetchMyJobPosts();
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể cập nhật việc làm',
      });
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
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
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

        <Modal
          title="Chỉnh sửa việc làm"
          open={editModalVisible}
          onOk={handleEditSubmit}
          onCancel={() => setEditModalVisible(false)}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item
              name="jobTitle"
              label="Tiêu đề công việc"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề công việc' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả công việc"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả công việc' }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item
              name="requirements"
              label="Yêu cầu"
              rules={[{ required: true, message: 'Vui lòng nhập yêu cầu công việc' }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item
              name="benefits"
              label="Quyền lợi"
              rules={[{ required: true, message: 'Vui lòng nhập quyền lợi' }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item
              name="location"
              label="Địa điểm"
              rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
            >
              <Input />
            </Form.Item>

            <Space size="large">
              <Form.Item
                name="minSalary"
                label="Lương tối thiểu"
                rules={[{ required: true, message: 'Vui lòng nhập lương tối thiểu' }]}
              >
                <Input type="number" prefix="$" />
              </Form.Item>

              <Form.Item
                name="maxSalary"
                label="Lương tối đa"
                rules={[{ required: true, message: 'Vui lòng nhập lương tối đa' }]}
              >
                <Input type="number" prefix="$" />
              </Form.Item>
            </Space>

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select>
                <Option value="Open">Đang mở</Option>
                <Option value="Closed">Đã đóng</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </UserLayout>
  );
};

export default MyJobPostPage;
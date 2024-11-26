import React, { useState } from 'react';
import { Layout, Menu, Table, Button, Modal, Form, Input, DatePicker, message } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';
import AdminLayout from '../../layouts/AdminLayout';
const { Header, Content, Sider } = Layout;

const JobPostPage = () => {
  // Dữ liệu bài đăng công việc ví dụ
  const initialJobPosts = [
    {
      JobPostId: 1,
      JobTitle: 'Kỹ Sư Phần Mềm',
      Location: 'Hà Nội, Việt Nam',
      MinSalary: 5000,
      MaxSalary: 7000,
      Time: '2024-11-01T10:00:00Z',
    },
    {
      JobPostId: 2,
      JobTitle: 'Quản Lý Dự Án',
      Location: 'Thành phố Hồ Chí Minh, Việt Nam',
      MinSalary: 7000,
      MaxSalary: 10000,
      Time: '2024-11-05T14:30:00Z',
    },
    {
      JobPostId: 3,
      JobTitle: 'Nhà Thiết Kế UI/UX',
      Location: 'Đà Nẵng, Việt Nam',
      MinSalary: 4000,
      MaxSalary: 6000,
      Time: '2024-10-30T09:00:00Z',
    },
  ];

  const [jobPosts, setJobPosts] = useState(initialJobPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJobPost, setEditingJobPost] = useState(null);
  const [form] = Form.useForm();

  // Mở modal để thêm hoặc chỉnh sửa
  const openModal = (jobPost = null) => {
    setEditingJobPost(jobPost);
    if (jobPost) {
      form.setFieldsValue({
        ...jobPost,
        Time: jobPost.Time ? moment(jobPost.Time) : null,
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Xử lý lưu (thêm hoặc chỉnh sửa)
  const handleSaveJobPost = async () => {
    try {
      const values = await form.validateFields();
      const jobPostData = { ...values, Time: values.Time ? values.Time.toISOString() : null };

      if (editingJobPost) {
        // Cập nhật bài đăng công việc
        setJobPosts(
          jobPosts.map((post) =>
            post.JobPostId === editingJobPost.JobPostId ? { ...post, ...jobPostData } : post
          )
        );
        message.success('Cập nhật bài đăng công việc thành công');
      } else {
        // Tạo bài đăng công việc mới
        const newJobPost = { ...jobPostData, JobPostId: jobPosts.length + 1 }; // Tạo ID mới cho bài đăng
        setJobPosts([...jobPosts, newJobPost]);
        message.success('Thêm bài đăng công việc thành công');
      }

      setIsModalOpen(false);
      setEditingJobPost(null);
    } catch (error) {
      message.error('Lưu bài đăng công việc thất bại');
    }
  };

  // Xử lý xóa bài đăng công việc
  const handleDeleteJobPost = (JobPostId) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa bài đăng công việc này?',
      onOk: () => {
        setJobPosts(jobPosts.filter((post) => post.JobPostId !== JobPostId));
        message.success('Bài đăng công việc đã bị xóa');
      },
    });
  };

  // Cột trong bảng bài đăng công việc
  const columns = [
    { title: 'Chức Danh Công Việc', dataIndex: 'JobTitle', key: 'JobTitle' },
    { title: 'Địa Điểm', dataIndex: 'Location', key: 'Location' },
    { title: 'Khoảng Lương', dataIndex: 'MinSalary', key: 'Salary', render: (minSalary, record) => `${minSalary} - ${record.MaxSalary}` },
    { title: 'Thời Gian Đăng', dataIndex: 'Time', key: 'Time', render: (time) => moment(time).format('YYYY-MM-DD HH:mm') },
    { title: 'Hành Động', key: 'actions', render: (_, record) => (
      <>
        <Button icon={<EditOutlined />} onClick={() => openModal(record)} style={{ marginRight: 8 }} />
        <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteJobPost(record.JobPostId)} />
        <Link to={`/admin/jobapplications/${record.JobPostId}`} style={{ marginLeft: 8 }}>
          <Button icon={<SearchOutlined />} type="link">
          </Button>
        </Link>
      </>
    ) },
  ];

  return (
    <AdminLayout headerName="Sự Kiện">
      <Layout.Content style={{ padding: '24px' }}>
          <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 16 }}>
            Thêm Bài Đăng Công Việc
          </Button>

          <Table
            columns={columns}
            dataSource={jobPosts}
            rowKey="JobPostId"
            pagination={false}
          />

          {/* Modal để thêm/sửa bài đăng công việc */}
          <Modal
            title={editingJobPost ? 'Chỉnh Sửa Bài Đăng Công Việc' : 'Thêm Bài Đăng Công Việc'}
            visible={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={handleSaveJobPost}
            okText={editingJobPost ? 'Cập Nhật' : 'Thêm'}
            destroyOnClose
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="JobTitle"
                label="Chức Danh Công Việc"
                rules={[{ required: true, message: 'Vui lòng nhập chức danh công việc' }]} >
                <Input />
              </Form.Item>
              <Form.Item
                name="Location"
                label="Địa Điểm"
                rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]} >
                <Input />
              </Form.Item>
              <Form.Item
                name="MinSalary"
                label="Lương Tối Thiểu">
                <Input type="number" />
              </Form.Item>
              <Form.Item
                name="MaxSalary"
                label="Lương Tối Đa">
                <Input type="number" />
              </Form.Item>
              <Form.Item
                name="Time"
                label="Thời Gian Đăng"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian đăng' }]} >
                <DatePicker showTime />
              </Form.Item>
            </Form>
          </Modal>
          </Layout.Content>
          </AdminLayout>
  );
};

export default JobPostPage;

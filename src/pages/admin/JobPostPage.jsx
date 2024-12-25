import React, { useState, useEffect } from 'react';
import { Layout, Button, Modal, Form, Input, DatePicker, message, Table } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';
import AdminLayout from '../../layouts/AdminLayout';
import JobPostService from '../../services/JobPostService';

const { Content } = Layout;

const JobPostPage = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJobPost, setEditingJobPost] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  });

  const fetchJobPosts = async () => {
    try {
      setLoading(true);
      const response = await JobPostService.getAllJobPosts({}, pagination);
      setJobPosts(response.items || []);
      setPagination(prev => ({ ...prev, total: response.total }));
    } catch (error) {
      message.error('Không thể tải danh sách bài đăng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobPosts();
  }, [pagination.page, pagination.pageSize]);

  const openModal = (jobPost = null) => {
    setEditingJobPost(jobPost);
    if (jobPost) {
      form.setFieldsValue({
        ...jobPost,
        time: moment(jobPost.time)
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSaveJobPost = async () => {
    try {
      const values = await form.validateFields();
      const jobPostData = {
        ...values,
        time: values.time.toISOString(),
        status: 'ACTIVE',
        email: 'example@email.com', // Replace with actual user email
        userId: 1 // Replace with actual user ID
      };

      if (editingJobPost) {
        await JobPostService.updateJobPost(editingJobPost.jobPostId, jobPostData);
        message.success('Cập nhật bài đăng thành công');
      } else {
        await JobPostService.createJobPost(jobPostData);
        message.success('Thêm bài đăng thành công');
      }

      setIsModalOpen(false);
      setEditingJobPost(null);
      form.resetFields();
      fetchJobPosts();
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại');
    }
  };

  const handleTableChange = (pagination) => {
    setPagination({
      page: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total
    });
  };
  const handleDeleteJobPost = (jobPostId) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa bài đăng này?',
      content: 'Hành động này không thể hoàn tác',
      onOk: async () => {
        try {
          await JobPostService.deleteJobPost(jobPostId);
          message.success('Xóa bài đăng thành công');
          fetchJobPosts();
        } catch (error) {
          message.error('Không thể xóa bài đăng');
        }
      }
    });
  };
  const columns = [
    { title: 'Chức Danh', dataIndex: 'jobTitle', key: 'jobTitle' },
    { title: 'Địa Điểm', dataIndex: 'location', key: 'location' },
    { 
      title: 'Khoảng Lương', 
      key: 'salary',
      render: (_, record) => `${record.minSalary || 0} - ${record.maxSalary || 0}`
    },
    { 
      title: 'Thời Gian', 
      dataIndex: 'time', 
      key: 'time',
      render: time => moment(time).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="default"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            type="default"
            shape="circle"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteJobPost(record.jobPostId)}
          />
          <Link to={`/admin/jobapplications/${record.jobPostId}`}>
            <Button type="link">Xem ứng viên</Button>
          </Link>
        </>
      ),
    },
  ];

  return (
    <AdminLayout headerName="Bài đăng tuyển dụng">
      <Content style={{ padding: '24px' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => openModal()}
          style={{ marginBottom: 16 }}
        >
          Thêm Bài Đăng
        </Button>

        <Table
          columns={columns}
          dataSource={jobPosts}
          rowKey="jobPostId"
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total
          }}
        />

        <Modal
          title={editingJobPost ? 'Chỉnh sửa Bài Đăng' : 'Thêm Bài Đăng'}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={handleSaveJobPost}
          okText={editingJobPost ? 'Cập nhật' : 'Thêm'}
          width={800}
          destroyOnClose
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="jobTitle"
              label="Chức Danh"
              rules={[{ required: true, message: 'Vui lòng nhập chức danh' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="jobDescription"
              label="Mô tả Công việc"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả công việc' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="location"
              label="Địa Điểm"
              rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="minSalary" label="Lương Tối Thiểu">
              <Input type="number" />
            </Form.Item>
            <Form.Item name="maxSalary" label="Lương Tối Đa">
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="requirements"
              label="Yêu Cầu"
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="benefits"
              label="Quyền Lợi"
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="time"
              label="Thời Gian Đăng"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian đăng' }]}
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </AdminLayout>
  );
};

export default JobPostPage;
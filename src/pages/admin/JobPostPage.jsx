import React, { useState, useEffect } from 'react';
import { Layout, Button, Modal, Form, Input, message, Table, Select, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';
import AdminLayout from '../../layouts/AdminLayout';
import JobPostService from '../../services/JobPostService';
import MajorCodeService from '../../services/MajorCodeService';

const { Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;

const JobPostPage = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJobPost, setEditingJobPost] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');

  const fetchJobPosts = async (page = pagination.current, pageSize = pagination.pageSize) => {
    try {
      setLoading(true);
      const response = await JobPostService.getAllJobPosts(
        {}, // filter
        { page, size: pageSize }
      );
      setJobPosts(response.items || []);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: response.total || 0
      });
    } catch (error) {
      message.error('Không thể tải danh sách việc làm');
    } finally {
      setLoading(false);
    }
  };

  const fetchMajors = async () => {
    try {
      const response = await MajorCodeService.getAllMajorCodes();
      setMajors(response.items || []);
    } catch (error) {
      message.error('Không thể tải danh sách ngành học');
    }
  };

  useEffect(() => {
    fetchJobPosts();
    fetchMajors();
  }, []);

  const handleTableChange = (newPagination) => {
    fetchJobPosts(newPagination.current, newPagination.pageSize);
  };

  const openModal = (jobPost = null) => {
    setEditingJobPost(jobPost);
    if (jobPost) {
      form.setFieldsValue({
        ...jobPost,
        majorId: jobPost.majorId?.toString()
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSaveJobPost = async () => {
    try {
      const values = await form.validateFields();
      
      if (values.minSalary > values.maxSalary) {
        message.error('Lương tối thiểu không được lớn hơn lương tối đa');
        return;
      }

      const jobPostData = {
        ...values,
        userId: userInfo.userId,
        status: 'Open',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
      };

      if (editingJobPost) {
        await JobPostService.updateJobPost(editingJobPost.jobPostId, jobPostData);
        message.success('Cập nhật việc làm thành công');
      } else {
        await JobPostService.createJobPost(jobPostData);
        message.success('Thêm việc làm thành công');
      }

      setIsModalOpen(false);
      setEditingJobPost(null);
      form.resetFields();
      fetchJobPosts(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại');
    }
  };

  const handleDeleteJobPost = (jobPostId) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa việc làm này?',
      content: 'Hành động này không thể hoàn tác',
      onOk: async () => {
        try {
          await JobPostService.deleteJobPost(jobPostId);
          message.success('Xóa việc làm thành công');
          fetchJobPosts(pagination.current, pagination.pageSize);
        } catch (error) {
          message.error('Không thể xóa việc làm');
        }
      }
    });
  };

  const columns = [
    { 
      title: 'Chức Danh', 
      dataIndex: 'jobTitle', 
      key: 'jobTitle',
      ellipsis: true,
      sorter: (a, b) => a.jobTitle.localeCompare(b.jobTitle)
    },
    { 
      title: 'Địa Điểm', 
      dataIndex: 'location', 
      key: 'location',
      ellipsis: true
    },
    { 
      title: 'Khoảng Lương', 
      key: 'salary',
      render: (_, record) => (
        <span>{record.minSalary}đ - {record.maxSalary}đ</span>
      ),
      sorter: (a, b) => a.minSalary - b.minSalary
    },
    {
      title: 'Ngành',
      dataIndex: 'majorName',
      key: 'majorName',
      ellipsis: true
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ 
          color: status === 'Open' ? '#52c41a' : '#f5222d',
          fontWeight: 500
        }}>
          {status}
        </span>
      )
    },
    { 
      title: 'Ngày Tạo', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      render: date => moment(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix()
    },
    {
      title: 'Hành Động',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
            type="primary"
            size="small"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteJobPost(record.jobPostId)}
            type="primary"
            danger
            size="small"
          />
          <Link to={`/admin/jobapplications/${record.jobPostId}`}>
            <Button 
              icon={<EyeOutlined />}
              type="default"
              size="small"
            >
              Ứng viên
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout headerName="Việc làm">
      <Content style={{ padding: '24px' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => openModal()}
          style={{ marginBottom: 16 }}
        >
          Thêm Việc Làm
        </Button>

        <Table
          columns={columns}
          dataSource={jobPosts}
          rowKey="jobPostId"
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} việc làm`,
            pageSizeOptions: ['10', '20', '50']
          }}
          scroll={{ x: 1200 }}
        />

        <Modal
          title={editingJobPost ? 'Chỉnh sửa Việc Làm' : 'Thêm Việc Làm'}
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingJobPost(null);
            form.resetFields();
          }}
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
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item
              name="location"
              label="Địa Điểm"
              rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
            >
              <Input />
            </Form.Item>

            <Space size="large" style={{ display: 'flex' }}>
              <Form.Item
                name="minSalary"
                label="Lương Tối Thiểu"
                rules={[{ required: true, message: 'Vui lòng nhập lương tối thiểu' }]}
                style={{ flex: 1 }}
              >
                <Input type="number" suffix="đ" min={0} />
              </Form.Item>

              <Form.Item
                name="maxSalary"
                label="Lương Tối Đa"
                rules={[{ required: true, message: 'Vui lòng nhập lương tối đa' }]}
                style={{ flex: 1 }}
              >
                <Input type="number" suffix="đ" min={0} />
              </Form.Item>
            </Space>

            <Form.Item
              name="majorId"
              label="Ngành"
              rules={[{ required: true, message: 'Vui lòng chọn ngành' }]}
            >
              <Select>
                {majors.map(major => (
                  <Option key={major.majorId} value={major.majorId.toString()}>
                    {major.majorName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="requirements"
              label="Yêu Cầu"
              rules={[{ required: true, message: 'Vui lòng nhập yêu cầu công việc' }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item
              name="benefits"
              label="Quyền Lợi"
              rules={[{ required: true, message: 'Vui lòng nhập quyền lợi' }]}
            >
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </AdminLayout>
  );
};

export default JobPostPage;
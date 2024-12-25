import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, Button, Select, message, Table, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import MentorshipService from '../../services/MentorshipService';

const { TextArea } = Input;
const { Option } = Select;

const MentorshipRequestPage = () => {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [editingRequest, setEditingRequest] = useState(null);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  });

  const fetchMentorships = async () => {
    try {
      setLoading(true);
      const response = await MentorshipService.getAllMentorships({}, pagination);
      setRequests(response.items || []);
      setPagination(prev => ({ ...prev, total: response.total }));
    } catch (error) {
      message.error('Không thể tải danh sách yêu cầu hướng dẫn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorships();
  }, [pagination.page, pagination.pageSize]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const mentorshipData = {
        ...values,
        alumniId: 1, // Replace with actual logged-in alumni ID
        status: editingRequest ? values.status : 'PENDING'
      };

      if (editingRequest) {
        await MentorshipService.updateMentorship(editingRequest.id, mentorshipData);
        message.success('Cập nhật yêu cầu hướng dẫn thành công');
      } else {
        await MentorshipService.createMentorship(mentorshipData);
        message.success('Tạo yêu cầu hướng dẫn thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingRequest(null);
      fetchMentorships();
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
    form.setFieldsValue({
      requestMessage: request.requestMessage,
      type: request.type,
      status: request.status
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa yêu cầu này?',
      onOk: async () => {
        try {
          await MentorshipService.deleteMentorship(id);
          message.success('Xóa yêu cầu thành công');
          fetchMentorships();
        } catch (error) {
          message.error('Không thể xóa yêu cầu');
        }
      }
    });
  };

  const handleTableChange = (pagination) => {
    setPagination({
      page: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total
    });
  };

  const columns = [
    { 
      title: 'Tin nhắn yêu cầu', 
      dataIndex: 'requestMessage', 
      key: 'requestMessage',
      ellipsis: true 
    },
    { 
      title: 'Loại', 
      dataIndex: 'type', 
      key: 'type',
      width: 150,
      render: (type) => {
        const typeMap = {
          'CAREER': 'Hướng nghiệp',
          'ACADEMIC': 'Học thuật',
          'NETWORKING': 'Kết nối'
        };
        return typeMap[type] || type;
      }
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      width: 150,
      render: (status) => {
        const statusMap = {
          'PENDING': 'Đang chờ',
          'APPROVED': 'Đã phê duyệt',
          'REJECTED': 'Đã từ chối'
        };
        return statusMap[status] || status;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
            type="default"
            shape="circle"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            type="default"
            shape="circle"
            danger
          />
        </>
      ),
    },
  ];

  return (
    <AdminLayout headerName="Yêu cầu hướng dẫn">
      <Layout.Content style={{ padding: '24px' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          Tạo yêu cầu
        </Button>

        <Table 
          columns={columns} 
          dataSource={requests} 
          rowKey="id" 
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total
          }}
        />

        <Modal
          title={editingRequest ? "Chỉnh sửa yêu cầu" : "Tạo yêu cầu mới"}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setEditingRequest(null);
          }}
          footer={null}
          destroyOnClose
        >
          <Form 
            form={form} 
            layout="vertical" 
            onFinish={handleSubmit}
          >
            <Form.Item
              name="requestMessage"
              label="Tin nhắn yêu cầu"
              rules={[{ required: true, message: 'Vui lòng nhập tin nhắn yêu cầu' }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item
              name="type"
              label="Loại"
              rules={[{ required: true, message: 'Vui lòng chọn loại hướng dẫn' }]}
            >
              <Select>
                <Option value="CAREER">Hướng nghiệp</Option>
                <Option value="ACADEMIC">Học thuật</Option>
                <Option value="NETWORKING">Kết nối</Option>
              </Select>
            </Form.Item>

            {editingRequest && (
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
              >
                <Select>
                  <Option value="PENDING">Đang chờ</Option>
                  <Option value="APPROVED">Đã phê duyệt</Option>
                  <Option value="REJECTED">Đã từ chối</Option>
                </Select>
              </Form.Item>
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingRequest ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Layout.Content>
    </AdminLayout>
  );
};

export default MentorshipRequestPage;
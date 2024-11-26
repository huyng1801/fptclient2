import React, { useState } from 'react';
import { Layout, Form, Input, Button, Select, message, Table, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';

const { TextArea } = Input;
const { Option } = Select;

const MentorshipRequestPage = () => {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([
    { id: 1, requestMessage: 'Cần hỗ trợ hướng nghiệp', type: 'Hướng nghiệp', status: 'Đang chờ' },
    { id: 2, requestMessage: 'Giúp đỡ về môn học', type: 'Giúp đỡ học thuật', status: 'Đã phê duyệt' },
  ]);
  const [editingRequest, setEditingRequest] = useState(null);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (editingRequest) {
        // Update existing request
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === editingRequest.id ? { ...request, ...values } : request
          )
        );
        message.success("Cập nhật yêu cầu hướng dẫn thành công!");
      } else {
        // Add new request
        const newRequest = {
          ...values,
          id: requests.length + 1, // This can be replaced with a more robust ID generation method
        };
        setRequests((prevRequests) => [...prevRequests, newRequest]);
        message.success("Yêu cầu hướng dẫn đã được gửi thành công!");
      }
    } catch (error) {
      message.error("Gửi yêu cầu hướng dẫn thất bại.");
    } finally {
      setLoading(false);
      form.resetFields();
      setEditingRequest(null);
      setIsModalVisible(false); // Close modal after submit
    }
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
    form.setFieldsValue(request);
    setIsModalVisible(true); // Show modal for editing
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa yêu cầu này?',
      onOk: () => {
        setRequests(requests.filter((request) => request.id !== id));
        message.success('Yêu cầu đã được xóa thành công!');
      },
    });
  };

  const columns = [
    { title: 'Tin nhắn yêu cầu', dataIndex: 'requestMessage', key: 'requestMessage' },
    { title: 'Loại', dataIndex: 'type', key: 'type' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, request) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(request)}
            style={{ marginRight: 8 }}
            type="default"
            shape="circle"
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(request.id)}
            type="default"
            shape="circle"
          />
        </>
      ),
    },
  ];

  return (
    <AdminLayout headerName="Yêu cầu hướng dẫn">
      <Layout.Content style={{ padding: '24px' }}>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Gửi Yêu cầu
        </Button>

        <Table columns={columns} dataSource={requests} rowKey="id" style={{ marginTop: 24 }} />

        <Modal
          title={editingRequest ? "Chỉnh sửa Yêu cầu" : "Tạo Yêu cầu"}
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setEditingRequest(null);
          }}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Tin nhắn yêu cầu"
              name="requestMessage"
              rules={[{ required: true, message: 'Vui lòng nhập tin nhắn yêu cầu' }]}
            >
              <TextArea rows={4} placeholder="Mô tả yêu cầu hướng dẫn của bạn ở đây..." />
            </Form.Item>

            <Form.Item
              label="Loại"
              name="type"
              rules={[{ required: true, message: 'Vui lòng chọn loại hướng dẫn' }]}
            >
              <Select placeholder="Chọn loại hướng dẫn">
                <Option value="Hướng nghiệp">Hướng nghiệp</Option>
                <Option value="Giúp đỡ học thuật">Giúp đỡ học thuật</Option>
                <Option value="Kết nối">Kết nối</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select placeholder="Chọn trạng thái yêu cầu">
                <Option value="Đang chờ">Đang chờ</Option>
                <Option value="Đã phê duyệt">Đã phê duyệt</Option>
                <Option value="Đã từ chối">Đã từ chối</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingRequest ? 'Cập nhật Yêu cầu' : 'Gửi Yêu cầu'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Layout.Content>
    </AdminLayout>
  );
};

export default MentorshipRequestPage;

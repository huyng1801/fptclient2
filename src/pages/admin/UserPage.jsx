import React, { useState, useEffect } from 'react';
import {
  Layout,
  Form,
  Input,
  Button,
  Table,
  Modal,
  Select,
  Upload,
  message,
  Switch,
  Row,
  Col
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined
} from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import UserService from '../../services/UserService';
import MajorCodeService from '../../services/MajorCodeService';

const { Content } = Layout;
const { Option } = Select;

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserService.getAllUsers({}, pagination);
      setUsers(response.items);
    } catch (error) {
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const fetchMajors = async () => {
    try {
      const response = await MajorCodeService.getAllMajorCodes();
      setMajors(response.items);
    } catch (error) {
      message.error('Không thể tải danh sách ngành');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchMajors();
  }, [pagination]);

  const openModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        emailVerified: user.emailVerified,
        roleId: user.roleId,
        majorId: user.majorId,
        isMentor: user.isMentor
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUser) {
        await UserService.updateUserInfo(editingUser.userId, values);
        message.success('Cập nhật người dùng thành công');
      } else {
        await UserService.createUser(values);
        message.success('Thêm người dùng thành công');
      }
      
      setIsModalOpen(false);
      setEditingUser(null);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại');
    }
  };

  const handleDeleteUser = (userId) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa người dùng này?',
      onOk: async () => {
        try {
          await UserService.deleteUser(userId);
          message.success('Xóa người dùng thành công');
          fetchUsers();
        } catch (error) {
          message.error('Không thể xóa người dùng');
        }
      }
    });
  };

  const handleTableChange = (pagination) => {
    setPagination({
      page: pagination.current,
      pageSize: pagination.pageSize
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'userId', key: 'userId' },
    { title: 'Tên', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Họ', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Vai trò',
      dataIndex: 'roleId',
      key: 'roleId',
      render: (roleId) => (roleId === 1 ? 'Quản trị' : 'Người dùng')
    },
    {
      title: 'Ngành',
      dataIndex: 'majorId',
      key: 'majorId',
      render: (majorId) => {
        const major = majors.find(m => m.id === majorId);
        return major ? major.name : 'N/A';
      }
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, user) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => openModal(user)}
            type="default"
            shape="circle"
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            type="default"
            shape="circle"
            onClick={() => handleDeleteUser(user.userId)}
          />
        </>
      )
    }
  ];

  return (
    <AdminLayout headerName="Người dùng">
      <Content style={{ padding: '24px' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
          Thêm người dùng
        </Button>
        
        <Table
          columns={columns}
          dataSource={users}
          rowKey="userId"
          style={{ marginTop: 16 }}
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: users.length
          }}
        />

        <Modal
          title={editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={handleSaveUser}
          okText={editingUser ? 'Cập nhật' : 'Thêm'}
          width={800}
          destroyOnClose
        >
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="Tên"
                  rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="lastName"
                  label="Họ"
                  rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email' },
                    { type: 'email', message: 'Email không hợp lệ' }
                  ]}
                >
                  <Input type="email" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="roleId"
                  label="Vai trò"
                  rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                >
                  <Select placeholder="Chọn vai trò">
                    <Option value={1}>Quản trị</Option>
                    <Option value={2}>Người dùng</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name="majorId"
                  label="Ngành"
                  rules={[{ required: true, message: 'Vui lòng chọn ngành' }]}
                >
                  <Select placeholder="Chọn ngành">
                    {majors.map(major => (
                      <Option key={major.majorId} value={major.majorId}>
                        {major.majorName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="isMentor"
                  label="Là người hướng dẫn"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Có" unCheckedChildren="Không" />
                </Form.Item>

                <Form.Item
                  name="profilePicture"
                  label="Ảnh đại diện"
                >
                  <Upload
                    listType="picture"
                    maxCount={1}
                    beforeUpload={() => false}
                  >
                    <Button icon={<UploadOutlined />}>Tải lên</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Content>
    </AdminLayout>
  );
};

export default UserPage;
import React, { useState } from 'react';
import {
  Layout,
  Form,
  Input,
  Button,
  Table,
  Modal,
  Select,
  DatePicker,
  Upload,
  message,
  Checkbox,
  Row,
  Col,
  Switch
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined
} from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import moment from 'moment';

const { Content } = Layout;
const { Option } = Select;

const UserPage = () => {
  const [users, setUsers] = useState([
    {
      userId: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      emailVerified: true,
      roleId: 1,
      majorId: 1,
      googleId: '1234567890',
      isMentor: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-02-01',
      profilePicture: null,
      createdBy: 'Admin',
      updatedBy: 'Admin'
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // Open modal for adding or editing a user
  const openModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      form.setFieldsValue({
        ...user,
        createdAt: user.createdAt ? moment(user.createdAt) : null,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ createdAt: moment() });
    }
    setIsModalOpen(true);
  };

  // Handle adding or updating user
  const handleSaveUser = () => {
    form
      .validateFields()
      .then((values) => {
        // Handle file upload separately if needed
        if (values.profilePicture && values.profilePicture.fileList.length > 0) {
          values.profilePicture = values.profilePicture.fileList[0].originFileObj;
        } else {
          values.profilePicture = null;
        }

        if (editingUser) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.userId === editingUser.userId ? { ...user, ...values, updatedAt: new Date().toISOString() } : user
            )
          );
        } else {
          setUsers((prevUsers) => [
            ...prevUsers,
            {
              ...values,
              userId: prevUsers.length + 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              profilePicture: null, // Handle as needed
              createdBy: 'Admin', // Replace with actual user
              updatedBy: 'Admin'  // Replace with actual user
            }
          ]);
        }
        setIsModalOpen(false);
        setEditingUser(null);
        form.resetFields();
        message.success(`Người dùng đã được ${editingUser ? 'cập nhật' : 'thêm'} thành công`);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  // Confirm deletion of a user
  const handleDeleteUser = (userId) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa người dùng này?',
      onOk: () => {
        setUsers(users.filter((user) => user.userId !== userId));
        message.success('Xóa người dùng thành công');
      }
    });
  };

  // Table columns configuration
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
        />

        {/* Add/Edit User Modal */}
        <Modal
          title={editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
          visible={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={handleSaveUser}
          okText={editingUser ? 'Cập nhật' : 'Thêm'}
          width={800} // Increase modal size
          destroyOnClose
        >
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              {/* Left Column */}
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
                <Form.Item
                  name="emailVerified"
                  label="Xác thực email"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Đã xác thực" unCheckedChildren="Chưa xác thực" />
                </Form.Item>


              </Col>

              {/* Right Column */}
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
                  rules={[{ required: true, message: 'Vui lòng chọn mã ngành' }]}
                >
                  <Select placeholder="Chọn ngành">
                    <Option value="1">Ngành 1</Option>
                    <Option value="2">Ngành 2</Option>
                    <Option value="3">Ngành 3</Option>
                    {/* Add more options as needed */}
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

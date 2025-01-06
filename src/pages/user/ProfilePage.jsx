import React, { useState, useEffect } from 'react';
import { Card, Typography, Avatar, Form, Input, Button, message, Modal, Upload } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import UserLayout from '../../layouts/UserLayout';
import UserService from '../../services/UserService';

const { Title, Text } = Typography;

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');

  const fetchUserProfile = async () => {
    try {
      if (userInfo?.userId) {
        const userData = await UserService.getUser(userInfo.userId);
        setUser(userData);
      }
    } catch (error) {
      message.error('Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async (values) => {
    try {
      await UserService.updateUser(userInfo.userId, {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        isMentor: user.isMentor // Preserve existing mentor status
      });
      
      message.success('Cập nhật thông tin thành công');
      setEditModalVisible(false);
      fetchUserProfile(); // Refresh user data
    } catch (error) {
      message.error('Không thể cập nhật thông tin');
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleEditClick = () => {
    form.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
    setEditModalVisible(true);
  };

  if (loading) {
    return (
      <UserLayout>
        <Card loading={true} />
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <Card>
        <div className="text-center mb-6">
          <Avatar 
            size={120} 
            icon={<UserOutlined />} 
            src={user?.profilePicture}
            className="mb-4"
          />
          <Title level={2} className="mb-1">
            {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
          </Title>
          <Text type="secondary">{user?.email}</Text>
          {user?.isMentor && (
            <Text className="block mt-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Mentor</span>
            </Text>
          )}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="grid gap-4">
            <div>
              <Text strong>Email:</Text>
              <div>{user?.email}</div>
            </div>
            <div>
              <Text strong>Họ và tên:</Text>
              <div>{user?.firstName} {user?.lastName}</div>
            </div>
            <div>
              <Text strong>Chuyên ngành:</Text>
              <div>{user?.majorId ? `ID: ${user.majorId}` : 'Chưa cập nhật'}</div>
            </div>
            <div>
              <Text strong>Vai trò:</Text>
              <div>{user?.roleName || 'Chưa cập nhật'}</div>
            </div>
            <div>
              <Text strong>Trạng thái email:</Text>
              <div>{user?.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}</div>
            </div>
          </div>
        </div>

        <Button type="primary" onClick={handleEditClick} block>
          Chỉnh sửa thông tin
        </Button>

        <Modal
          title="Chỉnh sửa thông tin cá nhân"
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateProfile}
          >
            <Form.Item
              name="profilePicture"
              label="Ảnh đại diện"
            >
              <Upload
                maxCount={1}
                beforeUpload={async (file) => {
                  try {
                    const base64 = await getBase64(file);
                    form.setFieldsValue({ profilePicture: base64 });
                  } catch (error) {
                    message.error('Không thể tải ảnh lên');
                  }
                  return false;
                }}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="firstName"
              label="Họ"
              rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Tên"
              rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
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
              <Input disabled />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Cập nhật thông tin
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </UserLayout>
  );
}

export default ProfilePage;
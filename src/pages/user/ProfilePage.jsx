import React, { useState, useEffect } from 'react';
import { Card, Typography, Avatar, Form, Input, Button, message, Modal, Upload } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import UserLayout from '../../layouts/UserLayout';
import UserService from '../../services/UserService';

const { Title, Text } = Typography;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

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

  const handleFileSelect = async (file) => {
    try {
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        message.error('Chỉ chấp nhận file JPG, PNG hoặc GIF');
        return false;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        message.error('Kích thước file không được vượt quá 5MB');
        return false;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        form.setFieldsValue({ profilePicture: reader.result });
      };
      reader.onerror = () => {
        message.error('Lỗi khi đọc file');
      };

      return false; // Prevent upload
    } catch (error) {
      message.error('Có lỗi xảy ra khi xử lý file');
      return false;
    }
  };

  const handleUpdateProfile = async (values) => {
    try {
      const updatedData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        isMentor: user.isMentor,
        profilePicture: values.profilePicture || user.profilePicture
      };
  
      await UserService.updateUserInfo(userInfo.userId, updatedData);
      
      // Get fresh user data after update
      const updatedUserData = await UserService.getUser(userInfo.userId);
      
      // Update session storage with new user data
      sessionStorage.setItem('userInfo', JSON.stringify(updatedUserData));
      
      message.success('Cập nhật thông tin thành công');
      setEditModalVisible(false);
      fetchUserProfile();
    } catch (error) {
      message.error('Không thể cập nhật thông tin');
    }
  };
  const handleEditClick = () => {
    form.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicture: user.profilePicture
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
              <div>{user?.majorName ? `${user.majorName}` : 'Chưa cập nhật'}</div>
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
            initialValues={{
              firstName: user?.firstName,
              lastName: user?.lastName,
              email: user?.email,
              profilePicture: user?.profilePicture
            }}
          >
            <Form.Item
              name="profilePicture"
              label="Ảnh đại diện"
            >
              <Upload
                accept=".jpg,.jpeg,.png,.gif"
                maxCount={1}
                showUploadList={false}
                beforeUpload={handleFileSelect}
              >
                <div style={{ marginBottom: '10px' }}>
                  <Avatar 
                    size={100}
                    src={form.getFieldValue('profilePicture')}
                    icon={<UserOutlined />}
                  />
                </div>
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
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
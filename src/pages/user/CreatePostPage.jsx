import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Switch, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../../layouts/UserLayout';
import PostService from '../../services/PostService';
import MajorCodeService from '../../services/MajorCodeService';

const { Title } = Typography;
const { TextArea } = Input;

const CreatePostPage = () => {
  const [form] = Form.useForm();
  const [isPrivate, setIsPrivate] = useState(false);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    if (!userInfo?.userId) {
      message.warning('Vui lòng đăng nhập để tạo bài viết');
      navigate('/login');
      return;
    }

    const fetchMajors = async () => {
      try {
        const response = await MajorCodeService.getAllMajorCodes();
        setMajors(response.items);
      } catch (error) {
        message.error('Có lỗi xảy ra khi tải danh sách chuyên ngành.');
        console.error('Error loading majors:', error);
      }
    };

    fetchMajors();
  }, [navigate, userInfo]);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      const postData = {
        ...values,
        isPrivate,
        authorId: userInfo.userId,
        status: 'Published'
      };

      await PostService.createPost(postData);
      message.success('Bài viết đã được tạo thành công!');
      navigate('/list-post');
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo bài viết. Vui lòng thử lại.');
      console.error('Error during post creation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
        <Title level={2}>Tạo Bài Viết Mới</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item
            name="title"
            label="Tiêu Đề Bài Viết"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết!' }]}
          >
            <Input placeholder="Nhập tiêu đề bài viết" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội Dung Bài Viết"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung bài viết!' }]}
          >
            <TextArea rows={6} placeholder="Nhập nội dung bài viết" />
          </Form.Item>

          <Form.Item
            name="majorId"
            label="Chuyên Ngành"
            rules={[{ required: true, message: 'Vui lòng chọn chuyên ngành!' }]}
          >
            <Select placeholder="Chọn chuyên ngành">
              {majors.map((major) => (
                <Select.Option key={major.majorId} value={major.majorId}>
                  {major.majorName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Riêng Tư">
            <Switch 
              checked={isPrivate} 
              onChange={setIsPrivate}
              checkedChildren="Có"
              unCheckedChildren="Không"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
            >
              Tạo Bài Viết
            </Button>
          </Form.Item>
        </Form>
      </div>
    </UserLayout>
  );
};

export default CreatePostPage;
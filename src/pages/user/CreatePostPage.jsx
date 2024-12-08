import React, { useState } from 'react';
import { Form, Input, Button, Select, Switch, Typography, message } from 'antd';
import { Container } from "react-bootstrap";
import UserLayout from '../../layouts/UserLayout/UserLayout';
import PostService from '../../services/PostService'; // Import the PostService
const { Title } = Typography;
const { TextArea } = Input;

const CreatePostPage = () => {
  const [form] = Form.useForm();
  const [isPrivate, setIsPrivate] = useState(false);

  const handleFinish = async (values) => {
    try {
      const postData = {
        ...values,
        isPrivate, // Add `isPrivate` to the payload
      };
      const response = await PostService.createPost(postData);
      message.success('Bài viết đã được tạo thành công!');
      console.log('Tạo bài viết thành công:', response);
      // You can redirect or reset the form if needed
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo bài viết. Vui lòng thử lại.');
      console.error('Error during post creation:', error);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">

      <Container>
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
            <TextArea rows={4} placeholder="Nhập nội dung bài viết" />
          </Form.Item>

          <Form.Item
            name="majorId"
            label="Chuyên Ngành"
            rules={[{ required: true, message: 'Vui lòng chọn chuyên ngành!' }]}
          >
            <Select placeholder="Chọn chuyên ngành">
              <Select.Option value="1">Khoa Học Máy Tính</Select.Option>
              <Select.Option value="2">Quản Trị Kinh Doanh</Select.Option>
              <Select.Option value="3">Kỹ Thuật</Select.Option>
              <Select.Option value="4">Khoa Học Sức Khỏe</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Riêng Tư">
            <Switch checked={isPrivate} onChange={setIsPrivate} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tạo Bài Viết
            </Button>
          </Form.Item>
        </Form>
        </Container>
  
    </div>
  );
};

export default CreatePostPage;

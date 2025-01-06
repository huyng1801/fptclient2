import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Switch, Typography, message } from 'antd';
import { Container } from "react-bootstrap";
import UserLayout from '../../layouts/UserLayout';
import PostService from '../../services/PostService'; // Import the PostService
import MajorCodeService from '../../services/MajorCodeService'; // Import MajorCodeService

const { Title } = Typography;
const { TextArea } = Input;

const CreatePostPage = () => {
  const [form] = Form.useForm();
  const [isPrivate, setIsPrivate] = useState(false);
  const [majors, setMajors] = useState([]); // State to store majors

  useEffect(() => {
    // Fetch the majors from the MajorCodeService when the component mounts
    const fetchMajors = async () => {
      try {
        const response = await MajorCodeService.getAllMajorCodes();
        setMajors(response.items); // Assuming the response contains an array of majors
      } catch (error) {
        message.error('Có lỗi xảy ra khi tải danh sách chuyên ngành.');
        console.error('Error loading majors:', error);
      }
    };

    fetchMajors();
  }, []); // Run only once when the component mounts

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
    <UserLayout>
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
            {/* Render major options dynamically */}
            {majors.map((major) => (
              <Select.Option key={major.majorId} value={major.majorId}>
                {major.majorName}
              </Select.Option>
            ))}
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
    </UserLayout>
  );
};

export default CreatePostPage;

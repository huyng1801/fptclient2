import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Switch, Typography, message, InputNumber } from 'antd';
import UserLayout from '../../layouts/UserLayout';
import PostService from '../../services/PostService'; // Import PostService
import MajorCodeService from '../../services/MajorCodeService'; // Import MajorCodeService

const { Title } = Typography;
const { TextArea } = Input;

const CreatePostPage = () => {
  const [form] = Form.useForm();
  const [isPrivate, setIsPrivate] = useState(false);
  const [majors, setMajors] = useState([]); // State to store the list of majors
  const [status, setStatus] = useState('Draft'); // Default status

  // Fetch list of majors when the component mounts
  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await MajorCodeService.getAllMajorCodes(); // Fetch majors from the service
        console.log(response);
        setMajors(response.items); // Assuming 'items' contains the list of majors
      } catch (error) {
        message.error('Lỗi khi tải danh sách chuyên ngành!');
        console.error('Error fetching majors:', error);
      }
    };

    fetchMajors();
  }, []);

  const handleFinish = async (values) => {
    console.log('Giá trị nhận được: ', values);

    // Prepare the data to send to the API based on the PostInfo model
    const postData = {
      title: values.title,
      content: values.content,
      majorId: values.majorId, // Use the selected majorId from the form
      isPrivate,
      status, // Add status information
      views: values.views || 0, // Default views to 0
      authorId: 1, // Assuming you have the authorId (replace with actual logic)
    };

    try {
      // Call the PostService to create a new post
      const response = await PostService.createPost(postData);
      message.success('Bài viết đã được tạo thành công!');
      console.log('Post created successfully:', response);
      // Optionally, you can reset the form or navigate to another page after creating the post
      form.resetFields();
    } catch (error) {
      message.error('Lỗi khi tạo bài viết!');
      console.error('Error creating post:', error);
    }
  };

  return (
    <UserLayout>
      <div style={{ padding: '24px' }}>
        <Title level={2}>Tạo Bài Viết Mới</Title>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
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
              {/* Dynamically populate the select options from the majors state */}
              {majors.map((major) => (
                <Select.Option key={major.majorId} value={major.majorId}>
                  {major.majorName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="views"
            label="Lượt Xem"
            rules={[{ type: 'number', min: 0, message: 'Lượt xem phải là số không âm!' }]}
          >
            <InputNumber min={0} placeholder="Nhập lượt xem" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Riêng Tư">
            <Switch checked={isPrivate} onChange={setIsPrivate} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng Thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái bài viết!' }]}
          >
            <Select defaultValue="Draft" onChange={(value) => setStatus(value)}>
              <Select.Option value="Draft">Nháp</Select.Option>
              <Select.Option value="Published">Đã Xuất Bản</Select.Option>
              <Select.Option value="Archived">Lưu Trữ</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tạo Bài Viết
            </Button>
          </Form.Item>
        </Form>
      </div>
    </UserLayout>
  );
};

export default CreatePostPage;

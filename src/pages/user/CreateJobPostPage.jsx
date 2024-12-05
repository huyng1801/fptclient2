import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Switch, Typography, message, InputNumber } from 'antd';
import JobPostService from '../../services/JobPostService'; // Import JobPostService
import MajorCodeService from '../../services/MajorCodeService'; // Import MajorCodeService
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import { Container } from "react-bootstrap";

const { Title } = Typography;
const { TextArea } = Input;

const CreateJobPostPage = () => {
  const [form] = Form.useForm();
  const [majors, setMajors] = useState([]);
  const [status, setStatus] = useState('Draft');

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await MajorCodeService.getAllMajorCodes();
        setMajors(response.items || []); // Safeguard for undefined `items`
      } catch (error) {
        message.error('Lỗi khi tải danh sách chuyên ngành!');
        console.error('Error fetching majors:', error);
      }
    };
    fetchMajors();
  }, []);

  const handleFinish = async (values) => {
    const jobPostData = {
      jobTitle: values.title,
      jobDescription: values.description,
      minSalary: values.minSalary,
      maxSalary: values.maxSalary,
      location: values.location,
      requirements: values.requirements,
      benefits: values.benefits,
      time: new Date(), // Current time or pick from form
      status: status,
      email: values.email,
      userId: JSON.parse(sessionStorage.getItem('userInfo'))?.userId || 0, // Replace with dynamic user ID logic if available
      majorId: values.majorId,
    };

    try {
      const response = await JobPostService.createJobPost(jobPostData);
      message.success('Công việc đã được tạo thành công!');
      form.resetFields();
      console.log('Job post created:', response);
    } catch (error) {
      message.error('Lỗi khi tạo công việc!');
      console.error('Error creating job post:', error);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderComponent />
      <Container>
        <Title level={2}>Tạo Công Việc Mới</Title>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="title"
            label="Tiêu Đề Công Việc"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input placeholder="Nhập tiêu đề công việc" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô Tả Công Việc"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả công việc" />
          </Form.Item>

          <Form.Item
            name="minSalary"
            label="Mức Lương Thấp Nhất"
            rules={[{ type: 'number', min: 0, message: 'Mức lương phải lớn hơn hoặc bằng 0!' }]}
          >
            <InputNumber min={0} placeholder="Nhập mức lương tối thiểu" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="maxSalary"
            label="Mức Lương Cao Nhất"
            rules={[{ type: 'number', min: 0, message: 'Mức lương phải lớn hơn hoặc bằng 0!' }]}
          >
            <InputNumber min={0} placeholder="Nhập mức lương tối đa" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="location"
            label="Địa Điểm"
            rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}
          >
            <Input placeholder="Nhập địa điểm" />
          </Form.Item>

          <Form.Item
            name="requirements"
            label="Yêu Cầu"
          >
            <TextArea rows={3} placeholder="Nhập các yêu cầu công việc" />
          </Form.Item>

          <Form.Item
            name="benefits"
            label="Quyền Lợi"
          >
            <TextArea rows={3} placeholder="Nhập các quyền lợi công việc" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Liên Hệ"
            rules={[{ type: 'email', required: true, message: 'Vui lòng nhập email hợp lệ!' }]}
          >
            <Input placeholder="Nhập email liên hệ" />
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

          <Form.Item
            name="status"
            label="Trạng Thái"
          >
            <Select defaultValue="Draft" onChange={(value) => setStatus(value)}>
              <Select.Option value="Draft">Nháp</Select.Option>
              <Select.Option value="Open">Đang Mở</Select.Option>
              <Select.Option value="Closed">Đã Đóng</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tạo Công Việc
            </Button>
          </Form.Item>
        </Form>
      </Container>
      <FooterComponent />
    </div>
  );
};

export default CreateJobPostPage;

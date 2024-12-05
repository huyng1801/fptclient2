import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Typography, Button, Spin, notification, Form, Input } from 'antd';
import { Container } from "react-bootstrap";
import { Box } from "@mui/material";
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import JobPostService from '../../services/JobPostService'; // Service to interact with API

const { Title, Text, Paragraph } = Typography;

const UserJobPostDetailsPage = () => {
  const { id } = useParams(); // Access job post ID from the URL params
  const [jobPost, setJobPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch job post details from the API
  useEffect(() => {
    const fetchJobPost = async () => {
      try {
        const data = await JobPostService.getJobPostById(id);
        setJobPost(data);
      } catch (error) {
        console.error('Error fetching job post:', error);
        notification.error({
          message: 'Lỗi tải dữ liệu',
          description: 'Không thể tải thông tin tuyển dụng!',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchJobPost();
  }, [id]);

  // Handle job application submission
  const handleApply = async (values) => {
    try {
      await JobPostService.applyToJobPost(id, values);
      notification.success({
        message: 'Ứng tuyển thành công',
        description: 'Đơn ứng tuyển của bạn đã được gửi thành công!',
      });
    } catch (error) {
      console.error('Error applying for job:', error);
      notification.error({
        message: 'Lỗi ứng tuyển',
        description: 'Không thể gửi đơn ứng tuyển của bạn!',
      });
    }
  };

  if (loading) {
    return <Spin size="large" style={{ margin: '50px auto', display: 'block' }} />;
  }

  if (!jobPost) {
    return <Text type="danger">Không tìm thấy tin tuyển dụng!</Text>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderComponent />

      <Box sx={{ backgroundColor: "#f9f9f9", py: 4 }}>
        <Container>
          <Title level={2}>{jobPost.jobTitle}</Title>
          <Text type="secondary">{jobPost.location}</Text>
          <br />
          <Text type="secondary">Đăng ngày: {new Date(jobPost.createdAt).toLocaleDateString()}</Text>
          <br /><br />
          <Paragraph>{jobPost.jobDescription}</Paragraph>

          <Title level={4}>Yêu cầu</Title>
          <Paragraph>{jobPost.requirements || 'Không có yêu cầu.'}</Paragraph>

          <Title level={4}>Phúc lợi</Title>
          <Paragraph>{jobPost.benefits || 'Không có phúc lợi.'}</Paragraph>

          <Title level={4}>Mức lương</Title>
          <Paragraph>{jobPost.minSalary} - {jobPost.maxSalary} VND</Paragraph>

          <Form
            name="applyForm"
            layout="vertical"
            style={{ marginTop: '20px' }}
            onFinish={handleApply}
          >
            <Form.Item
              label="Thư xin việc"
              name="coverLetter"
              rules={[{ required: true, message: 'Vui lòng nhập thư xin việc của bạn!' }]}
            >
              <Input.TextArea rows={4} placeholder="Viết thư xin việc của bạn ở đây..." />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Gửi đơn ứng tuyển
            </Button>
          </Form>
        </Container>
      </Box>

      <FooterComponent />
    </div>
  );
};

export default UserJobPostDetailsPage;

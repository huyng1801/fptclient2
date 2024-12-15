import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Spin, notification, Space, Tag, Descriptions, Form, Input, Button } from 'antd';
import { 
  EnvironmentOutlined, 
  ClockCircleOutlined, 
  MailOutlined,
  DollarOutlined,
  UserOutlined,
  TagOutlined
} from '@ant-design/icons';
import UserLayout from '../../layouts/UserLayout/UserLayout';
import JobPostService from '../../services/JobPostService';

const { Title, Text, Paragraph } = Typography;

const styles = {

  content: {
    backgroundColor: '#fff',
    padding: '32px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
  },
  header: {
    marginBottom: '24px',
  },
  metadata: {
    display: 'flex',
    gap: '16px',
    marginTop: '8px',
    flexWrap: 'wrap',
  },
  section: {
    marginBottom: '24px',
  },
  salaryTag: {
    fontSize: '16px',
    padding: '8px 16px',
    borderRadius: '6px',
  },
  infoGrid: {
    marginTop: '24px',
    background: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
  },
  statusTag: {
    marginLeft: '8px',
  },
  applicationForm: {
    marginTop: '32px',
  }
};

const UserJobPostDetailsPage = () => {
  const { id } = useParams();
  const [jobPost, setJobPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobPost = async () => {
      try {
        const data = await JobPostService.getJobPostById(id);
  
        setJobPost(data);
      } catch (err) {
        setError(err);
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải thông tin việc làm. Vui lòng thử lại sau.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobPost();
  }, [id]);

  const handleApply = async (values) => {
    try {
      await JobPostService.applyToJobPost(id, values);
      notification.success({
        message: 'Ứng tuyển thành công',
        description: 'Đơn ứng tuyển của bạn đã được gửi thành công!',
      });
    } catch (error) {
      notification.error({
        message: 'Lỗi ứng tuyển',
        description: 'Không thể gửi đơn ứng tuyển của bạn!',
      });
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div style={styles.loading}>
          <Spin size="large" />
        </div>
      </UserLayout>
    );
  }

  if (error || !jobPost) {
    return (
      <UserLayout>
        <div style={styles.container}>
          <Text type="danger">Không tìm thấy tin tuyển dụng!</Text>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div>
        <div style={styles.content}>
          {/* Header Section */}
          <div style={styles.header}>
            <Title level={2}>
              {jobPost.jobTitle}
              <Tag color={jobPost.status === 'Open' ? 'success' : 'default'} style={styles.statusTag}>
                {jobPost.status}
              </Tag>
            </Title>
            <Space style={styles.metadata}>
              <Text type="secondary">
                <EnvironmentOutlined /> {jobPost.location}
              </Text>
              <Text type="secondary">
                <ClockCircleOutlined /> Đăng ngày: {new Date(jobPost.createdAt).toLocaleDateString()}
              </Text>
              <Text type="secondary">
                <MailOutlined /> {jobPost.email}
              </Text>
            </Space>
          </div>

          {/* Salary Section */}
          <div style={styles.section}>
            <Tag color="green" style={styles.salaryTag}>
              <DollarOutlined /> {jobPost.minSalary} - {jobPost.maxSalary} USD
              {jobPost.isDeal && ' (Có thể thương lượng)'}
            </Tag>
          </div>

          {/* Description Section */}
          <div style={styles.section}>
            <Title level={4}>Mô tả công việc</Title>
            <Paragraph>{jobPost.jobDescription}</Paragraph>
          </div>

          {/* Requirements Section */}
          <div style={styles.section}>
            <Title level={4}>Yêu cầu</Title>
            <Paragraph>{jobPost.requirements}</Paragraph>
          </div>

          {/* Benefits Section */}
          <div style={styles.section}>
            <Title level={4}>Phúc lợi</Title>
            <Paragraph>{jobPost.benefits}</Paragraph>
          </div>

          {/* Additional Information */}
          <div style={styles.infoGrid}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label={<><UserOutlined /> Người đăng</>}>
                {jobPost.createdBy}
              </Descriptions.Item>
              <Descriptions.Item label={<><TagOutlined /> Mã công việc</>}>
                {jobPost.jobPostId}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối">
                {new Date(jobPost.updatedAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Chuyên ngành">
                {jobPost.majorId}
              </Descriptions.Item>
            </Descriptions>
          </div>

          {/* Application Form */}
          <Form
            name="applyForm"
            layout="vertical"
            style={styles.applicationForm}
            onFinish={handleApply}
          >
            <Form.Item
              label="Thư xin việc"
              name="coverLetter"
              rules={[{ required: true, message: 'Vui lòng nhập thư xin việc của bạn!' }]}
            >
              <Input.TextArea 
                rows={4} 
                placeholder="Viết thư xin việc của bạn ở đây..." 
              />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Gửi đơn ứng tuyển
            </Button>
          </Form>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserJobPostDetailsPage;
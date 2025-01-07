import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Spin, notification, Space, Tag, Descriptions, Form, Input, Button, Card, Avatar } from 'antd';
import { 
  EnvironmentOutlined, 
  ClockCircleOutlined, 
  MailOutlined,
  DollarOutlined,
  UserOutlined,
  TagOutlined,
  FileOutlined
} from '@ant-design/icons';
import UserLayout from '../../layouts/UserLayout';
import JobPostService from '../../services/JobPostService';
import CVSelectionModal from '../../components/UserJobPostDetails/CVSelectionModal';
import JobApplicationService from '../../services/JobApplicationService';
import CVService from '../../services/CVService';
import UserService from "../../services/UserService";
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
  const navigate = useNavigate();
  const [jobPost, setJobPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCV, setSelectedCV] = useState(null);
  const [showCVModal, setShowCVModal] = useState(false);
  const [hasCV, setHasCV] = useState(true); // Track if user has any CVs
  const [form] = Form.useForm();
  const [creator, setCreator] = useState(null);
useEffect(() => {
  const fetchJobPost = async () => {
    setLoading(true); // Ensure loading state is set before starting
    try {
      await checkUserCV(); // Ensure this call completes before proceeding
      
      // Fetch job post data
      const data = await JobPostService.getJobPostById(id);
      setJobPost(data);
    
      
      // Fetch creator details if jobPost has a valid userId
      if (data?.userId) {
        const userData = await UserService.getUser(data.userId);
        setCreator(userData);
      }
    
    } catch (err) {
      setError(err); // Capture error for further handling
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải thông tin việc làm. Vui lòng thử lại sau.',
      });
    } finally {
      setLoading(false); // Ensure loading state is updated in both success and error cases
    }
  };

  fetchJobPost(); // Execute the fetch function
}, [id]); // Re-run the effect only when `id` changes

  const checkUserCV = async () => {
    try {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      if (!userInfo?.userId) {
        notification.error({
          message: 'Chưa đăng nhập',
          description: 'Vui lòng đăng nhập để ứng tuyển.',
        });
        navigate('/login');
        return false;
      }

      const response = await CVService.getCVByUserId(userInfo.userId);

      
      if (!response?.data || (Array.isArray(response.data) && response.data.length === 0)) {
        setHasCV(false);
        notification.info({
          message: 'Chưa có CV',
          description: 'Bạn cần tạo CV trước khi ứng tuyển.',
        });
        navigate('/cv');
        return false;
      }
      
      setHasCV(true);
      return true;
    } catch (error) {
      navigate('/cv');
      console.error('Error checking CV:', error);
      return false;
    }
  };

  const handleCVSelect = (cv) => {
    setSelectedCV(cv);
    setShowCVModal(false);
  };

  const handleApply = async (values) => {
    const hasValidCV = await checkUserCV();
    if (!hasValidCV) return;

    if (!selectedCV) {
      notification.error({
        message: 'Chưa chọn CV',
        description: 'Vui lòng chọn CV trước khi ứng tuyển.',
      });
      return;
    }

    try {
      await JobApplicationService.createNewJobApplication({
        jobPostId: parseInt(id),
        cvId: selectedCV.id,
        letterCover: values.coverLetter,
        status: 'PENDING',
        type: 'FULL_TIME'
      });

      notification.success({
        message: 'Ứng tuyển thành công',
        description: 'Đơn ứng tuyển của bạn đã được gửi thành công!',
      });
      
      form.resetFields();
      setSelectedCV(null);
    } catch (error) {
      notification.error({
        message: 'Lỗi ứng tuyển',
        description: 'Bạn đã  ứng tuyển công việc này rồi!',
      });
    }
  };

  const handleShowCVModal = async () => {
    const hasValidCV = await checkUserCV();
    if (hasValidCV) {
      setShowCVModal(true);
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
              <Avatar 
                size={48} 
                icon={<UserOutlined />}
                src={creator?.profilePicture}
              >
                {creator?.firstName?.charAt(0)}
              </Avatar>
              <div className="flex-1">
                <Text strong>
                {creator ? `${creator.firstName} ${creator.lastName}` : "Đang tải..."}
                </Text>
            
              </div>
              </Descriptions.Item>
              <Descriptions.Item label={<><TagOutlined /> Mã công việc</>}>
                {jobPost.jobPostId}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối">
                {new Date(jobPost.updatedAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Chuyên ngành">
                {jobPost.majorName}
              </Descriptions.Item>
            </Descriptions>
          </div>

          {/* Application Form */}
          <Form
        form={form}
        name="applyForm"
        layout="vertical"
        style={styles.applicationForm}
        onFinish={handleApply}
      >
        <Card title="Thông tin ứng tuyển">
          <Space direction="vertical" style={{ width: '100%' }}>
            {selectedCV ? (
              <Card size="small" style={{ marginBottom: 16 }}>
                <Space>
                  <FileOutlined />
                  <span>{selectedCV.fullName} - {selectedCV.jobLevel}</span>
                  <Button size="small" onClick={handleShowCVModal}>
                    Đổi CV khác
                  </Button>
                </Space>
              </Card>
            ) : (
              <Button 
                type="dashed" 
                onClick={handleShowCVModal}
                icon={<FileOutlined />}
                block
                style={{ marginBottom: 16 }}
              >
                Chọn CV của bạn
              </Button>
            )}

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

            <Button type="primary" htmlType="submit" block>
              Gửi đơn ứng tuyển
            </Button>
          </Space>
        </Card>
      </Form>

      {hasCV && (
        <CVSelectionModal
          visible={showCVModal}
          onSelect={handleCVSelect}
          onCancel={() => setShowCVModal(false)}
        />
      )}
        </div>
      </div>
    </UserLayout>
  );
};

export default UserJobPostDetailsPage;
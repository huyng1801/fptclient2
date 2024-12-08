import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Typography, message, InputNumber, Card, Row, Col, Space, Tag } from 'antd';
import { UserOutlined, DollarOutlined, EnvironmentOutlined, FileTextOutlined, BulbOutlined, GiftOutlined } from '@ant-design/icons';
import JobPostService from '../../services/JobPostService';
import MajorCodeService from '../../services/MajorCodeService';
import UserLayout from '../../layouts/UserLayout/UserLayout';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CreateJobPostPage = () => {
  const [form] = Form.useForm();
  const [majors, setMajors] = useState([]);
  const [status, setStatus] = useState('Draft');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await MajorCodeService.getAllMajorCodes();
        setMajors(response.items || []);
      } catch (error) {
        message.error('Lỗi khi tải danh sách chuyên ngành!');
        console.error('Error fetching majors:', error);
      }
    };
    fetchMajors();
  }, []);

  const handleFinish = async (values) => {
    setLoading(true);
    const jobPostData = {
      jobTitle: values.title,
      jobDescription: values.description,
      minSalary: values.minSalary,
      maxSalary: values.maxSalary,
      location: values.location,
      requirements: values.requirements,
      benefits: values.benefits,
      time: new Date(),
      status: status,
      email: values.email,
      userId: JSON.parse(sessionStorage.getItem('userInfo'))?.userId || 0,
      majorId: values.majorId,
    };

    try {
      await JobPostService.createJobPost(jobPostData);
      message.success('Công việc đã được tạo thành công!');
      form.resetFields();
    } catch (error) {
      message.error('Lỗi khi tạo công việc!');
      console.error('Error creating job post:', error);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
   
    subtitle: {
      fontSize: '16px',
      color: '#666',
    },
    card: {
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid #f0f0f0',
    },
    formSection: {
      marginBottom: '32px',
      padding: '24px',

      borderRadius: '8px',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    submitButton: {
      height: '48px',
      fontSize: '16px',
      fontWeight: '500',
      width: '100%',
      borderRadius: '8px',
    },
  };

  return (
    <UserLayout>


        <Card style={styles.card}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            requiredMark={false}
          >
            <div style={styles.formSection}>
              <Title level={4} style={styles.sectionTitle}>
                <FileTextOutlined /> Thông tin cơ bản
              </Title>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    name="title"
                    label="Tiêu Đề Công Việc"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                  >
                    <Input 
                      prefix={<UserOutlined />}
                      placeholder="Nhập tiêu đề công việc"
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    name="description"
                    label="Mô Tả Công Việc"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Nhập mô tả chi tiết về công việc"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div style={styles.formSection}>
              <Title level={4} style={styles.sectionTitle}>
                <DollarOutlined /> Thông tin lương
              </Title>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="minSalary"
                    label="Mức Lương Thấp Nhất"
                    rules={[{ required: true, message: 'Vui lòng nhập mức lương tối thiểu!' }]}
                  >
                    <InputNumber
                      prefix="₫"
                      min={0}
                      style={{ width: '100%' }}
                      size="large"
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="maxSalary"
                    label="Mức Lương Cao Nhất"
                    rules={[{ required: true, message: 'Vui lòng nhập mức lương tối đa!' }]}
                  >
                    <InputNumber
                      prefix="₫"
                      min={0}
                      style={{ width: '100%' }}
                      size="large"
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div style={styles.formSection}>
              <Title level={4} style={styles.sectionTitle}>
                <BulbOutlined /> Yêu cầu và quyền lợi
              </Title>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    name="requirements"
                    label="Yêu Cầu"
                    rules={[{ required: true, message: 'Vui lòng nhập yêu cầu công việc!' }]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Nhập các yêu cầu cho ứng viên"
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    name="benefits"
                    label="Quyền Lợi"
                    rules={[{ required: true, message: 'Vui lòng nhập quyền lợi!' }]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Nhập các quyền lợi cho ứng viên"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div style={styles.formSection}>
              <Title level={4} style={styles.sectionTitle}>
                <GiftOutlined /> Thông tin khác
              </Title>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="location"
                    label="Địa Điểm"
                    rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}
                  >
                    <Input
                      prefix={<EnvironmentOutlined />}
                      placeholder="Nhập địa điểm làm việc"
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email Liên Hệ"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email!' },
                      { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Nhập email liên hệ"
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="majorId"
                    label="Chuyên Ngành"
                    rules={[{ required: true, message: 'Vui lòng chọn chuyên ngành!' }]}
                  >
                    <Select
                      placeholder="Chọn chuyên ngành"
                      size="large"
                      showSearch
                      optionFilterProp="children"
                    >
                      {majors.map((major) => (
                        <Option key={major.majorId} value={major.majorId}>
                          {major.majorName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="status"
                    label="Trạng Thái"
                    initialValue="Draft"
                  >
                    <Select
                      onChange={(value) => setStatus(value)}
                      size="large"
                    >
                      <Option value="Draft">
                        <Tag color="orange">Nháp</Tag>
                      </Option>
                      <Option value="Open">
                        <Tag color="green">Đang Mở</Tag>
                      </Option>
                      <Option value="Closed">
                        <Tag color="red">Đã Đóng</Tag>
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={styles.submitButton}
              >
                Tạo Công Việc
              </Button>
            </Form.Item>
          </Form>
        </Card>

    </UserLayout>
  );
};

export default CreateJobPostPage;
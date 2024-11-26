import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Select, notification, InputNumber, Upload, message } from 'antd';
import { Layout, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import UserLayout from '../../layouts/UserLayout';
import CVService from '../../services/CVService';
import HeaderComponent from "../../components/common/HeaderComponent";
import FooterComponent from "../../components/common/FooterComponent";
const { TextArea } = Input;
const { Option } = Select;
const { Header, Content, Footer } = Layout;

const CVPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
  
    // Format the data for the backend
    const formattedData = {
      ...values,
      birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : null,
      startAt: values.startAt ? values.startAt.format('YYYY-MM-DD') : null,
      endAt: values.endAt ? values.endAt.format('YYYY-MM-DD') : null,
      userId: JSON.parse(sessionStorage.getItem('userInfo'))?.userId || 0, // Get userId from session
    };
  
    try {
      // Submit the formatted data using CVService
      console.log(formattedData);
      await CVService.createNewCV(formattedData);
      notification.success({
        message: 'CV Sent',
        description: 'Your CV has been submitted successfully.',
      });
      form.resetFields();
    } catch (error) {
      console.error('Error submitting CV:', error);
      notification.error({
        message: 'Submission Failed',
        description: 'An error occurred while submitting your CV. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };
  

  // Handle file upload
  const handleFileChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderComponent />

      <Row justify="center" style={{ marginTop: '30px' }}>
        <Col span={16} style={{ background: '#fff', padding: '30px', borderRadius: '8px' }}>
          <h2>Gửi CV của bạn</h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              gender: 'Male', // Gender mặc định, có thể thay đổi thành 'Female' hoặc 'Other'
            }}
          >
            <Row gutter={24}>
              {/* Full Name */}
              <Col span={12}>
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                >
                  <Input placeholder="Họ và tên" />
                </Form.Item>
              </Col>

              {/* Email */}
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
              </Col>

              {/* Address */}
              <Col span={12}>
                <Form.Item
                  label="Địa chỉ"
                  name="address"
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                >
                  <Input placeholder="Địa chỉ" />
                </Form.Item>
              </Col>

              {/* Phone */}
              <Col span={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                  <Input placeholder="Số điện thoại" />
                </Form.Item>
              </Col>

              {/* Birthday */}
              <Col span={12}>
                <Form.Item
                  label="Ngày sinh"
                  name="birthday"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                >
                  <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
              </Col>

              {/* Gender */}
              <Col span={12}>
                <Form.Item
                  label="Giới tính"
                  name="gender"
                  rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                >
                  <Select>
                    <Option value="Male">Nam</Option>
                    <Option value="Female">Nữ</Option>
                    <Option value="Other">Khác</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* City */}
              <Col span={12}>
                <Form.Item
                  label="Thành phố"
                  name="city"
                  rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}
                >
                  <Input placeholder="Thành phố" />
                </Form.Item>
              </Col>

              {/* Company */}
              <Col span={12}>
                <Form.Item
                  label="Công ty"
                  name="company"
                  rules={[{ required: true, message: 'Vui lòng nhập tên công ty!' }]}
                >
                  <Input placeholder="Công ty" />
                </Form.Item>
              </Col>

              {/* Primary Duties */}
              <Col span={12}>
                <Form.Item
                  label="Nhiệm vụ chính"
                  name="primaryDuties"
                  rules={[{ required: true, message: 'Vui lòng mô tả nhiệm vụ chính của bạn!' }]}
                >
                  <TextArea placeholder="Nhiệm vụ chính" rows={4} />
                </Form.Item>
              </Col>

              {/* Job Level */}
              <Col span={12}>
                <Form.Item
                  label="Cấp bậc công việc"
                  name="jobLevel"
                  rules={[{ required: true, message: 'Vui lòng chọn cấp bậc công việc!' }]}
                >
                  <Select>
                    <Option value="Junior">Junior</Option>
                    <Option value="Mid">Mid</Option>
                    <Option value="Senior">Senior</Option>
                    <Option value="Lead">Lead</Option>
                    <Option value="Manager">Manager</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Start Date */}
              <Col span={12}>
                <Form.Item
                  label="Ngày bắt đầu"
                  name="startAt"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                >
                  <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
              </Col>

              {/* End Date */}
              <Col span={12}>
                <Form.Item
                  label="Ngày kết thúc"
                  name="endAt"
                >
                  <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
              </Col>

              {/* Language */}
              <Col span={12}>
                <Form.Item
                  label="Ngôn ngữ"
                  name="language"
                  rules={[{ required: true, message: 'Vui lòng nhập ngôn ngữ!' }]}
                >
                  <Input placeholder="Ngôn ngữ" />
                </Form.Item>
              </Col>

              {/* Language Level */}
              <Col span={12}>
                <Form.Item
                  label="Trình độ ngôn ngữ"
                  name="languageLevel"
                  rules={[{ required: true, message: 'Vui lòng nhập trình độ ngôn ngữ!' }]}
                >
                  <Input placeholder="Trình độ ngôn ngữ" />
                </Form.Item>
              </Col>

              {/* Min Salary */}
              <Col span={12}>
                <Form.Item
                  label="Mức lương tối thiểu"
                  name="minSalary"
                  rules={[{ required: true, message: 'Vui lòng nhập mức lương tối thiểu!' }]}
                >
                  <InputNumber min={0} placeholder="Mức lương tối thiểu" style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              {/* Max Salary */}
              <Col span={12}>
                <Form.Item
                  label="Mức lương tối đa"
                  name="maxSalary"
                  rules={[{ required: true, message: 'Vui lòng nhập mức lương tối đa!' }]}
                >
                  <InputNumber min={0} placeholder="Mức lương tối đa" style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              {/* File Upload (CV) */}
              {/* <Col span={12}>
                <Form.Item
                  label="Tải lên CV"
                  name="cvFile"
                  rules={[{ required: true, message: 'Vui lòng tải lên CV của bạn!' }]}
                >
                  <Upload
                    name="cv"
                    action="/upload"
                    beforeUpload={(file) => {
                      const isPdf = file.type === 'application/pdf';
                      if (!isPdf) {
                        message.error('Chỉ chấp nhận file PDF!');
                      }
                      return isPdf;
                    }}
                    onChange={handleFileChange}
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />}>Tải lên CV</Button>
                  </Upload>
                </Form.Item>
                
              </Col> */}
            </Row>

            {/* Submit Button */}
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                Gửi CV
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>


      <FooterComponent />
    </div>
  );
};

export default CVPage;

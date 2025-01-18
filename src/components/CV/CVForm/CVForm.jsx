import React from 'react';
import { Form, Input, DatePicker, Select, Col, Row, Button, Card } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const CVForm = ({ onSubmit, loading, initialValues }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialValues) {
      const formattedValues = {
        ...initialValues,
      };
      form.setFieldsValue(formattedValues);
    }
  }, [initialValues, form]);

  const handleSubmit = (values) => {
    const formattedValues = {
      ...values
    };
    onSubmit(formattedValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        gender: 'Male',
        isDeal: false
      }}
    >
      <Row gutter={24}>
        {/* Personal Information */}
        <Col span={12}>
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input placeholder="Họ và tên" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input placeholder="Địa chỉ" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input placeholder="Số điện thoại" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Ngày sinh"
            name="birthday"
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
        </Col>

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

        <Col span={12}>
          <Form.Item
            label="Thành phố"
            name="city"
            rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}
          >
            <Input placeholder="Thành phố" />
          </Form.Item>
        </Col>

        {/* Work Experience Section */}
        <Col span={24}>
          <Card title="Kinh nghiệm làm việc" style={{ marginBottom: 24 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  label="Công ty"
                  name="company"
                  rules={[{ required: true, message: 'Vui lòng nhập tên công ty!' }]}
                >
                  <Input placeholder="Công ty" />
                </Form.Item>
              </Col>

              <Col span={8}>
      <Form.Item
        label="Cấp bậc công việc"
        name="jobLevel"
        rules={[{ required: true, message: 'Vui lòng nhập cấp bậc công việc!' }]}
      >
        <Select placeholder="Chọn cấp bậc công việc">
          <Option value="beginner">Beginner</Option>
          <Option value="intermediate">Intermediate</Option>
          <Option value="advanced">Advanced</Option>
        </Select>
      </Form.Item>
    </Col>


              <Col span={24}>
                <Form.Item
                  label="Nhiệm vụ chính"
                  name="primaryDuties"
                  rules={[{ required: true, message: 'Vui lòng mô tả nhiệm vụ chính của bạn!' }]}
                >
                  <TextArea placeholder="Nhiệm vụ chính" rows={4} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Ngày bắt đầu"
                  name="startAt"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                >
                  <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Ngày kết thúc"
                  name="endAt"
                >
                  <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Additional Information */}
        <Col span={12}>
          <Form.Item
            label="Ngôn ngữ"
            name="language"
            rules={[{ required: true, message: 'Vui lòng nhập ngôn ngữ!' }]}
          >
            <Input placeholder="Ngôn ngữ" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Trình độ ngôn ngữ"
            name="languageLevel"
            rules={[{ required: true, message: 'Vui lòng nhập trình độ ngôn ngữ!' }]}
          >
            <Input placeholder="Trình độ ngôn ngữ" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Mức lương tối thiểu"
            name="minSalary"
            rules={[{ required: true, message: 'Vui lòng nhập mức lương tối thiểu!' }]}
          >
            <Input type="number" min={0} placeholder="Mức lương tối thiểu" style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Mức lương tối đa"
            name="maxSalary"
            rules={[{ required: true, message: 'Vui lòng nhập mức lương tối đa!' }]}
          >
            <Input type="number" min={0} placeholder="Mức lương tối đa" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
          {initialValues ? 'Cập nhật CV' : 'Gửi CV'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CVForm;
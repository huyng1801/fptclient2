import React from 'react';
import { Form, Input, Button } from 'antd';

const styles = {
  form: {
    marginTop: '32px',
  },
};

const ApplicationForm = ({ onSubmit }) => (
  <Form
    name="applyForm"
    layout="vertical"
    style={styles.form}
    onFinish={onSubmit}
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
);

export default ApplicationForm;
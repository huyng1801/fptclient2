import React from 'react';
import { Form, Input, Modal, Button } from 'antd';

const RequestForm = ({ visible, onClose, onSubmit, formValues, onChange }) => {
  const styles = {
    form: {
      marginTop: '24px',
    },
    button: {
      width: '100%',
      height: '40px',
      borderRadius: '8px',
      fontWeight: '500',
    },
  };

  return (
    <Modal
      title="Gửi Yêu Cầu"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        onFinish={onSubmit}
        layout="vertical"
        initialValues={formValues}
        style={styles.form}
      >
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
        >
          <Input
            name="title"
            value={formValues.title}
            onChange={onChange}
            placeholder="Nhập tiêu đề yêu cầu"
          />
        </Form.Item>

        <Form.Item
          label="Nội dung yêu cầu"
          name="content"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
        >
          <Input.TextArea
            name="content"
            value={formValues.content}
            onChange={onChange}
            rows={4}
            placeholder="Mô tả chi tiết yêu cầu của bạn"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={styles.button}>
            Gửi Yêu Cầu
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RequestForm;
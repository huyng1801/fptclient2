import React from 'react';
import { Form, Input, InputNumber, Col } from 'antd';

const SkillsSection = () => {
  return (
    <>
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
          <InputNumber min={0} placeholder="Mức lương tối thiểu" style={{ width: '100%' }} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label="Mức lương tối đa"
          name="maxSalary"
          rules={[{ required: true, message: 'Vui lòng nhập mức lương tối đa!' }]}
        >
          <InputNumber min={0} placeholder="Mức lương tối đa" style={{ width: '100%' }} />
        </Form.Item>
      </Col>
    </>
  );
};

export default SkillsSection;
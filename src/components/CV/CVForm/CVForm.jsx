import React from 'react';
import { Form, Button, Row } from 'antd';
import PersonalInfoSection from './PersonalInfoSection';
import WorkExperienceSection from './WorkExperienceSection';
import SkillsSection from './SkillsSection';

const CVForm = ({ onSubmit, loading }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{
        gender: 'Male',
      }}
    >
      <Row gutter={24}>
        <PersonalInfoSection />
        <WorkExperienceSection />
        <SkillsSection />
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
          Gửi CV
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CVForm;
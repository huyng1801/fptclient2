import React, { useState } from 'react';
import { Row, Col, notification } from 'antd';
import UserLayout from '../../layouts/UserLayout/UserLayout';
import CVForm from '../../components/CV/CVForm/CVForm';
import CVService from '../../services/CVService';

const CVPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
  
    const formattedData = {
      ...values,
      birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : null,
      startAt: values.startAt ? values.startAt.format('YYYY-MM-DD') : null,
      endAt: values.endAt ? values.endAt.format('YYYY-MM-DD') : null,
      userId: JSON.parse(sessionStorage.getItem('userInfo'))?.userId || 0,
    };
  
    try {
      await CVService.createNewCV(formattedData);
      notification.success({
        message: 'CV Sent',
        description: 'Your CV has been submitted successfully.',
      });
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

  return (
    <UserLayout>
      <Row justify="center">
        <Col span={24} style={{ background: '#fff', padding: '30px', borderRadius: '8px' }}>
          <h2>Gửi CV của bạn</h2>
          <CVForm onSubmit={handleSubmit} loading={loading} />
        </Col>
      </Row>
    </UserLayout>
  );
};

export default CVPage;
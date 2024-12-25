import React, { useState } from 'react';
import { Row, Col, notification } from 'antd';
import UserLayout from '../../layouts/UserLayout/UserLayout';
import CVForm from '../../components/CV/CVForm/CVForm';
import CVService from '../../services/CVService';

const CVPage = () => {
  const [loading, setLoading] = useState(false);

  // Custom validation logic before submitting
  const handleSubmit = async (values) => {
    setLoading(true);

    // Check if any required field is empty
    if (!values.fullName || !values.email || !values.birthday || !values.startAt) {
      notification.error({
        message: 'Lỗi Xác Thực',
        description: 'Vui lòng điền đầy đủ thông tin yêu cầu trước khi gửi CV.',
      });
      setLoading(false);
      return;
    }

    // Format data if validation passes
    const formattedData = {
      ...values,
      birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : null,
      startAt: values.startAt ? values.startAt.format('YYYY-MM-DD') : null,
      endAt: values.endAt ? values.endAt.format('YYYY-MM-DD') : null,
      userId: JSON.parse(sessionStorage.getItem('userInfo'))?.userId || 0,
    };

    try {
      // Call API service to submit the CV
      await CVService.createNewCV(formattedData);
      
      // Show success notification
      notification.success({
        message: 'CV Đã Gửi',
        description: 'CV của bạn đã được gửi thành công.',
      });
    } catch (error) {
      console.error('Error submitting CV:', error);
      
      // Show error notification
      notification.error({
        message: 'Gửi CV Thất Bại',
        description: 'Đã xảy ra lỗi khi gửi CV. Vui lòng thử lại.',
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

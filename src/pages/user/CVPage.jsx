import React, { useState, useEffect } from 'react';
import { Row, Col, notification, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../../layouts/UserLayout';
import CVForm from '../../components/CV/CVForm/CVForm';
import CVService from '../../services/CVService';
import dayjs from 'dayjs';

const CVPage = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [existingCV, setExistingCV] = useState(null);
  const navigate = useNavigate();
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    const fetchExistingCV = async () => {
      if (!userInfo?.userId) {
        notification.warning({
          message: 'Chưa đăng nhập',
          description: 'Vui lòng đăng nhập để tiếp tục.',
        });
        navigate('/login');
        return;
      }

      try {
        const response = await CVService.getCVByUserId(userInfo.userId);
        if (response?.data) {
          // Format dates for form
          const cv = response.data;

          setExistingCV({
            ...cv,
            birthday: cv.birthday ? dayjs(cv.birthday) : null,
            startAt: cv.startAt ? dayjs(cv.startAt) : null,
            endAt: cv.endAt ? dayjs(cv.endAt) : null,
          });
        }
      } catch (error) {
        console.error('Error fetching CV:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchExistingCV();
  }, [userInfo?.userId, navigate]);

  const handleSubmit = async (values) => {
    setLoading(true);

    // Validation checks
    if (!values.fullName || !values.email || !values.birthday || !values.startAt) {
      notification.error({
        message: 'Lỗi Xác Thực',
        description: 'Vui lòng điền đầy đủ thông tin yêu cầu.',
      });
      setLoading(false);
      return;
    }

    // Age validation
    const birthday = values.birthday ? values.birthday.format('YYYY-MM-DD') : null;
    if (birthday) {
      const age = dayjs().diff(dayjs(birthday), 'year');
      if (age < 18) {
        notification.error({
          message: 'Lỗi Xác Thực',
          description: 'Bạn phải ít nhất 18 tuổi.',
        });
        setLoading(false);
        return;
      }
    }

    // Date validations
    const startAt = values.startAt ? values.startAt.format('YYYY-MM-DD') : null;
    const endAt = values.endAt ? values.endAt.format('YYYY-MM-DD') : null;

    if (startAt && dayjs(startAt).isAfter(dayjs())) {
      notification.error({
        message: 'Lỗi Xác Thực',
        description: 'Ngày bắt đầu không được trong tương lai.',
      });
      setLoading(false);
      return;
    }

    if (endAt && startAt && dayjs(endAt).isBefore(dayjs(startAt))) {
      notification.error({
        message: 'Lỗi Xác Thực',
        description: 'Ngày kết thúc không thể sớm hơn ngày bắt đầu.',
      });
      setLoading(false);
      return;
    }

    const formattedData = {
      ...values,
      birthday,
      startAt,
      endAt,
      userId: userInfo?.userId || 0,
    };

    try {
      if (existingCV) {
        // Update existing CV
        await CVService.updateCVInfo(existingCV.id, formattedData);
        notification.success({
          message: 'Cập Nhật CV',
          description: 'CV của bạn đã được cập nhật thành công.',
        });
      } else {
        // Create new CV
        await CVService.createNewCV(formattedData);
        notification.success({
          message: 'Tạo CV',
          description: 'CV của bạn đã được tạo thành công.',
        });
      }
      navigate('/cv');
      window.location.reload();
    } catch (error) {
      console.error('Error submitting CV:', error);
      notification.error({
        message: existingCV ? 'Cập Nhật CV Thất Bại' : 'Tạo CV Thất Bại',
        description: 'Đã xảy ra lỗi. Vui lòng thử lại.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <UserLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Spin size="large" />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <Row justify="center">
        <Col span={24} style={{ background: '#fff', padding: '30px', borderRadius: '8px' }}>
          <h2>{existingCV ? 'Cập nhật CV' : 'Tạo CV mới'}</h2>
          <CVForm 
            onSubmit={handleSubmit} 
            loading={loading} 
            initialValues={existingCV}
          />
        </Col>
      </Row>
    </UserLayout>
  );
};

export default CVPage;
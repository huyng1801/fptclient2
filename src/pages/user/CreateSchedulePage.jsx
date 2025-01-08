import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, DatePicker, Input, Button, Card, notification, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import UserLayout from '../../layouts/UserLayout';
import ScheduleService from '../../services/ScheduleService';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CreateSchedulePage = () => {
  const { mentorshipId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const scheduleData = {
        mentorShipId: parseInt(mentorshipId),
        mentorId: userInfo.userId,
        startTime: values.startTime.toISOString(),
        endTime: values.endTime.toISOString(),
        content: values.content,
        status: 'PENDING'
      };

      await ScheduleService.createSchedule(scheduleData);
      notification.success({
        message: 'Thành công',
        description: 'Tạo lịch hẹn thành công',
      });
      navigate('/schedule');
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tạo lịch hẹn. Vui lòng thử lại sau.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
          <Title level={2}>Tạo lịch hẹn mới</Title>
          <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
            Điền thông tin để tạo lịch hẹn mentorship
          </Text>

          <Form
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="startTime"
              label="Thời gian bắt đầu"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
            >
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                style={{ width: '100%' }}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>

            <Form.Item
              name="endTime"
              label="Thời gian kết thúc"
              rules={[
                { required: true, message: 'Vui lòng chọn thời gian kết thúc' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || !getFieldValue('startTime')) {
                      return Promise.resolve();
                    }
                    if (value.isBefore(getFieldValue('startTime'))) {
                      return Promise.reject('Thời gian kết thúc phải sau thời gian bắt đầu');
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                style={{ width: '100%' }}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>

            <Form.Item
              name="content"
              label="Nội dung buổi hẹn"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung buổi hẹn' }]}
            >
              <TextArea
                rows={4}
                placeholder="Mô tả nội dung, mục tiêu của buổi hẹn..."
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<ClockCircleOutlined />}
                block
              >
                Tạo lịch hẹn
              </Button>
            </Form.Item>
          </Form>
    </UserLayout>
  );
};

export default CreateSchedulePage;
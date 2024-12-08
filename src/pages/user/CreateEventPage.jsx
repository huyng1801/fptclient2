import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, InputNumber, notification, Select } from 'antd';
import UserLayout from '../../layouts/UserLayout/UserLayout'; // Adjust the import path as needed
import moment from 'moment';

const { Option } = Select;

const CreateEventPage = () => {
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = (values) => {
    setLoading(true);
    console.log('Event created: ', values);

    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      notification.success({
        message: 'Sự Kiện Đã Tạo',
        description: 'Sự kiện của bạn đã được tạo thành công.',
      });
    }, 1000);
  };

  return (
    <UserLayout>
      <div style={{ padding: '24px' }}>
        <h2>Tạo Sự Kiện Mới</h2>

        <Form
          layout="vertical"
          onFinish={handleSubmit}
        >
          {/* Event Name */}
          <Form.Item
            label="Tên Sự Kiện"
            name="eventName"
            rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện!' }]}
          >
            <Input placeholder="Tên Sự Kiện" />
          </Form.Item>

          {/* Event Description */}
          <Form.Item
            label="Mô Tả"
            name="description"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả sự kiện!' }]}
          >
            <Input.TextArea placeholder="Mô Tả" rows={4} />
          </Form.Item>

          {/* Start Date */}
          <Form.Item
            label="Ngày Bắt Đầu"
            name="startDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>

          {/* End Date */}
          <Form.Item
            label="Ngày Kết Thúc"
            name="endDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>

          {/* Location */}
          <Form.Item
            label="Địa Điểm"
            name="location"
            rules={[{ required: true, message: 'Vui lòng nhập địa điểm tổ chức!' }]}
          >
            <Input placeholder="Địa Điểm" />
          </Form.Item>

          {/* Organizer */}
          <Form.Item
            label="Người Tổ Chức"
            name="organizer"
            rules={[{ required: true, message: 'Vui lòng nhập tên người tổ chức!' }]}
          >
            <Input placeholder="Người Tổ Chức" />
          </Form.Item>

          {/* Max Attendees */}
          <Form.Item
            label="Số Người Tham Dự Tối Đa"
            name="maxAttendees"
            rules={[{ required: true, message: 'Vui lòng nhập số người tham dự tối đa!' }]}
          >
            <InputNumber min={1} placeholder="Số Người Tham Dự Tối Đa" style={{ width: '100%' }} />
          </Form.Item>

          {/* Event Type */}
          <Form.Item
            label="Loại Sự Kiện"
            name="eventType"
            rules={[{ required: true, message: 'Vui lòng chọn loại sự kiện!' }]}
          >
            <Select placeholder="Chọn Loại Sự Kiện">
              <Option value="workshop">Workshop</Option>
              <Option value="conference">Hội Thảo</Option>
              <Option value="exhibition">Triển Lãm</Option>
              <Option value="concert">Hòa Nhạc</Option>
              <Option value="seminar">Seminar</Option>
            </Select>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
              Tạo Sự Kiện
            </Button>
          </Form.Item>
        </Form>
      </div>
    </UserLayout>
  );
};

export default CreateEventPage;

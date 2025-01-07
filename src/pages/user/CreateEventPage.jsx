import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, notification, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import UserLayout from '../../layouts/UserLayout';
import EventService from '../../services/EventService';

const CreateEventPage = () => {
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
    return false;
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const organizerId = userInfo ? userInfo.userId : null;

    if (!organizerId) {
      notification.error({
        message: 'Lỗi Tạo Sự Kiện',
        description: 'Không tìm thấy thông tin người tổ chức.',
      });
      setLoading(false);
      return;
    }

    if (!values.eventName || !values.description || !values.startDate || !values.endDate || !values.location || !imageBase64) {
      notification.error({
        message: 'Lỗi Tạo Sự Kiện',
        description: 'Vui lòng điền đầy đủ thông tin.',
      });
      setLoading(false);
      return;
    }

    const startDate = values.startDate.toDate();
    if (startDate < new Date()) {
      notification.error({
        message: 'Lỗi Tạo Sự Kiện',
        description: 'Ngày bắt đầu không được ở quá khứ.',
      });
      setLoading(false);
      return;
    }

    const endDate = values.endDate.toDate();
    if (endDate < startDate) {
      notification.error({
        message: 'Lỗi Tạo Sự Kiện',
        description: 'Ngày kết thúc không được trước ngày bắt đầu.',
      });
      setLoading(false);
      return;
    }

    const eventData = {
      eventName: values.eventName,
      description: values.description,
      startDate: values.startDate.format('YYYY-MM-DD'),
      endDate: values.endDate.format('YYYY-MM-DD'),
      organizerId: organizerId,
      location: values.location,
      img: imageBase64,
    };
console.log(eventData);
    try {
      await EventService.createEvent(eventData);
      notification.success({
        message: 'Sự Kiện Đã Tạo',
        description: 'Sự kiện của bạn đã được tạo thành công.',
      });
      setLoading(false);
    } catch (error) {
      console.error('Error creating event:', error);
      notification.error({
        message: 'Lỗi Tạo Sự Kiện',
        description: 'Có lỗi xảy ra khi tạo sự kiện.',
      });
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div style={{ padding: '24px' }}>
        <h2>Tạo Sự Kiện Mới</h2>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Tên Sự Kiện"
            name="eventName"
            rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện!' }]}
          >
            <Input placeholder="Tên Sự Kiện" />
          </Form.Item>

          <Form.Item
            label="Mô Tả"
            name="description"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả sự kiện!' }]}
          >
            <Input.TextArea placeholder="Mô Tả" rows={4} />
          </Form.Item>

          <Form.Item
            label="Ngày Bắt Đầu"
            name="startDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
          >
            <DatePicker
       
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Ngày Kết Thúc"
            name="endDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
          >
            <DatePicker
   
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Địa Điểm"
            name="location"
            rules={[{ required: true, message: 'Vui lòng nhập địa điểm tổ chức!' }]}
          >
            <Input placeholder="Địa Điểm" />
          </Form.Item>

          <Form.Item label="Hình Ảnh" name="img">
            <Upload
              beforeUpload={handleImageUpload}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Tải Lên Hình Ảnh</Button>
            </Upload>
            {imagePreview && (
              <div style={{ marginTop: '10px' }}>
                <img src={imagePreview} alt="Preview" style={{ width: '30%', maxHeight: '200px', objectFit: 'cover' }} />
              </div>
            )}
          </Form.Item>

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
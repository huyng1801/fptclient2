import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, notification, Upload } from 'antd';
import UserLayout from '../../layouts/UserLayout'; // Adjust the import path as needed
import EventService from '../../services/EventService'; // Assuming EventService is imported from this path
import { UploadOutlined } from '@ant-design/icons';

const CreateEventPage = () => {
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState(null); // State to store the base64 image
  const [imagePreview, setImagePreview] = useState(null); // State to store image preview

  // Handle image upload
  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result); // Save the Base64 string in state
      setImagePreview(reader.result); // Set the image preview
    };
    if (file) {
      reader.readAsDataURL(file); // Convert the image to Base64
    }
    return false; // Prevent Ant Design from auto uploading
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    // Retrieve OrganizerId from sessionStorage
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const organizerId = userInfo ? userInfo.userId : null;

    // Validate that organizerId exists
    if (!organizerId) {
      notification.error({
        message: 'Lỗi Tạo Sự Kiện',
        description: 'Không tìm thấy thông tin người tổ chức.',
      });
      setLoading(false);
      return;
    }

    // Validate that all fields are provided
    if (!values.eventName || !values.description || !values.startDate || !values.endDate || !values.location || !imageBase64) {
      notification.error({
        message: 'Lỗi Tạo Sự Kiện',
        description: 'Vui lòng điền đầy đủ thông tin.',
      });
      setLoading(false);
      return;
    }

    // Validate that startDate is not in the past
    const startDate = new Date(values.startDate);
    if (startDate < new Date()) {
      notification.error({
        message: 'Lỗi Tạo Sự Kiện',
        description: 'Ngày bắt đầu không được ở quá khứ.',
      });
      setLoading(false);
      return;
    }

    // Validate that endDate is not earlier than startDate
    const endDate = new Date(values.endDate);
    if (endDate < startDate) {
      notification.error({
        message: 'Lỗi Tạo Sự Kiện',
        description: 'Ngày kết thúc không được trước ngày bắt đầu.',
      });
      setLoading(false);
      return;
    }

    // Prepare event data
    const eventData = {
      eventName: values.eventName,
      description: values.description,
      startDate: startDate.toISOString(), // Convert to ISO string for storage
      endDate: endDate.toISOString(), // Convert to ISO string for storage
      organizerId: organizerId,
      location: values.location,
      img: imageBase64,
    };

    try {
      // Call the EventService to create the event
      const response = await EventService.createEvent(eventData);

      notification.success({
        message: 'Sự Kiện Đã Tạo',
        description: 'Sự kiện của bạn đã được tạo thành công.',
      });

      // Optionally, you can redirect or reset the form here
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
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
              defaultValue={new Date()} // Ensure it shows the current date by default
            />
          </Form.Item>

          {/* End Date */}
          <Form.Item
            label="Ngày Kết Thúc"
            name="endDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
              defaultValue={new Date()} // Ensure it shows the current date by default
            />
          </Form.Item>

          {/* Location */}
          <Form.Item
            label="Địa Điểm"
            name="location"
            rules={[{ required: true, message: 'Vui lòng nhập địa điểm tổ chức!' }]}
          >
            <Input placeholder="Địa Điểm" />
          </Form.Item>

          {/* Event Image */}
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

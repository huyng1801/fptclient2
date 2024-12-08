import React from 'react';
import { Form, Input, DatePicker, Select, Col } from 'antd';

const { Option } = Select;

const PersonalInfoSection = () => {
  return (
    <>
      <Col span={12}>
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
        >
          <Input placeholder="Họ và tên" />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input placeholder="Địa chỉ" />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
        >
          <Input placeholder="Số điện thoại" />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label="Ngày sinh"
          name="birthday"
          rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
        >
          <Select>
            <Option value="Male">Nam</Option>
            <Option value="Female">Nữ</Option>
            <Option value="Other">Khác</Option>
          </Select>
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label="Thành phố"
          name="city"
          rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}
        >
          <Input placeholder="Thành phố" />
        </Form.Item>
      </Col>
    </>
  );
};

export default PersonalInfoSection;
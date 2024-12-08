import React from 'react';
import { Form, Input, DatePicker, Select, Col } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const WorkExperienceSection = () => {
  return (
    <>
      <Col span={12}>
        <Form.Item
          label="Công ty"
          name="company"
          rules={[{ required: true, message: 'Vui lòng nhập tên công ty!' }]}
        >
          <Input placeholder="Công ty" />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label="Nhiệm vụ chính"
          name="primaryDuties"
          rules={[{ required: true, message: 'Vui lòng mô tả nhiệm vụ chính của bạn!' }]}
        >
          <TextArea placeholder="Nhiệm vụ chính" rows={4} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label="Cấp bậc công việc"
          name="jobLevel"
          rules={[{ required: true, message: 'Vui lòng chọn cấp bậc công việc!' }]}
        >
          <Select>
            <Option value="Junior">Junior</Option>
            <Option value="Mid">Mid</Option>
            <Option value="Senior">Senior</Option>
            <Option value="Lead">Lead</Option>
            <Option value="Manager">Manager</Option>
          </Select>
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label="Ngày bắt đầu"
          name="startAt"
          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label="Ngày kết thúc"
          name="endAt"
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
      </Col>
    </>
  );
};

export default WorkExperienceSection;
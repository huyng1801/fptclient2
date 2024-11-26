import React, { useState } from 'react';
import { Button, Table, Modal, Form, Input, DatePicker, message, Layout } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'; // Import icons
import AdminLayout from '../../layouts/AdminLayout';
import moment from 'moment';

const EventPage = () => {
  // Sample data for events
  const initialEvents = [
    { EventId: 1, EventName: 'Tech Conference', StartDate: '2024-12-01T10:00:00', EndDate: '2024-12-01T18:00:00', Location: 'Hanoi', Status: true },
    { EventId: 2, EventName: 'Alumni Meetup', StartDate: '2024-11-15T14:00:00', EndDate: '2024-11-15T17:00:00', Location: 'Ho Chi Minh City', Status: true },
  ];

  // Sample data for users who have joined an event
  const initialUsers = [
    { UserId: 1, UserName: 'John Doe', Email: 'john@example.com', JoinDate: '2024-11-10T10:00:00' },
    { UserId: 2, UserName: 'Jane Smith', Email: 'jane@example.com', JoinDate: '2024-11-11T12:00:00' },
  ];

  const [events, setEvents] = useState(initialEvents);
  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewUsersModalOpen, setViewUsersModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form] = Form.useForm();

  // Open modal to add or edit
  const openModal = (event = null) => {
    setEditingEvent(event);
    if (event) {
      form.setFieldsValue({
        ...event,
        StartDate: event.StartDate ? moment(event.StartDate) : null,
        EndDate: event.EndDate ? moment(event.EndDate) : null,
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Handle save (add or edit)
  const handleSaveEvent = async () => {
    try {
      const values = await form.validateFields();

      // Format date values to match the Event model
      const startDate = values.StartDate ? values.StartDate.toISOString() : null;
      const endDate = values.EndDate ? values.EndDate.toISOString() : null;

      const eventData = { ...values, StartDate: startDate, EndDate: endDate };

      if (editingEvent) {
        // Update existing event
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.EventId === editingEvent.EventId ? { ...event, ...eventData } : event
          )
        );
        message.success('Cập nhật sự kiện thành công');
      } else {
        // Add new event
        const newEvent = { EventId: events.length + 1, ...eventData };
        setEvents((prevEvents) => [...prevEvents, newEvent]);
        message.success('Thêm sự kiện thành công');
      }

      setIsModalOpen(false);
      setEditingEvent(null);
    } catch (error) {
      message.error('Lưu sự kiện thất bại');
    }
  };

  // Handle delete event
  const handleDeleteEvent = (EventId) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa sự kiện này?',
      onOk: () => {
        setEvents(events.filter((event) => event.EventId !== EventId));
        message.success('Xóa sự kiện thành công');
      },
    });
  };

  // Handle view users who joined the event
  const handleViewUsers = (event) => {
    setSelectedEvent(event);
    setViewUsersModalOpen(true);
  };

  // Columns configuration for the table
  const columns = [
    { title: 'ID', dataIndex: 'EventId', key: 'EventId' },
    { title: 'Tên Sự Kiện', dataIndex: 'EventName', key: 'EventName' },
    { title: 'Ngày Bắt Đầu', dataIndex: 'StartDate', key: 'StartDate', render: (text) => new Date(text).toLocaleString() },
    { title: 'Ngày Kết Thúc', dataIndex: 'EndDate', key: 'EndDate', render: (text) => new Date(text).toLocaleString() },
    { title: 'Địa Điểm', dataIndex: 'Location', key: 'Location' },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="default"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            type="default"
            shape="circle"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteEvent(record.EventId)}
            style={{ marginRight: 8 }}
          />
          <Button
            type="default"
            shape="circle"
            icon={<UserOutlined />}
            onClick={() => handleViewUsers(record)}
          >
          </Button>
        </>
      ),
    },
  ];

  // Columns configuration for the user list in the view users modal
  const userColumns = [
    { title: 'Tên Người Dùng', dataIndex: 'UserName', key: 'UserName' },
    { title: 'Email', dataIndex: 'Email', key: 'Email' },
    { title: 'Ngày Tham Gia', dataIndex: 'JoinDate', key: 'JoinDate', render: (text) => new Date(text).toLocaleString() },
  ];

  return (
    <AdminLayout headerName="Sự Kiện">
      <Layout.Content style={{ padding: '24px' }}>
        <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 16 }}>
          Thêm Sự Kiện
        </Button>
        <Table
          columns={columns}
          dataSource={events}
          rowKey="EventId"
          pagination={false}
        />

        {/* Modal for Add/Edit */}
        <Modal
          title={editingEvent ? 'Chỉnh sửa Sự Kiện' : 'Thêm Sự Kiện'}
          visible={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={handleSaveEvent}
          okText={editingEvent ? 'Cập nhật' : 'Thêm'}
          destroyOnClose
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="EventName"
              label="Tên Sự Kiện"
              rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="StartDate"
              label="Ngày Bắt Đầu"
              rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
            >
              <DatePicker showTime />
            </Form.Item>
            <Form.Item
              name="EndDate"
              label="Ngày Kết Thúc"
              rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
            >
              <DatePicker showTime />
            </Form.Item>
            <Form.Item
              name="Location"
              label="Địa Điểm"
              rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal for Viewing Users who joined the event */}
        <Modal
          title={`Người Tham Gia - ${selectedEvent?.EventName}`}
          visible={viewUsersModalOpen}
          onCancel={() => setViewUsersModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          <Table
            columns={userColumns}
            dataSource={users}
            rowKey="UserId"
            pagination={false}
          />
        </Modal>
      </Layout.Content>
    </AdminLayout>
  );
};

export default EventPage;

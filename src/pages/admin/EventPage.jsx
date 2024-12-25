import React, { useState, useEffect } from 'react';
import { Layout, Button, Modal, Form, Input, DatePicker, message, Table } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import EventService from '../../services/EventService';
import moment from 'moment';

const { Content } = Layout;

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewUsersModalOpen, setViewUsersModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await EventService.getAllEvents({}, pagination);
      setEvents(response.items || []);
      setPagination(prev => ({ ...prev, total: response.total }));
    } catch (error) {
      message.error('Không thể tải danh sách sự kiện');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [pagination.page, pagination.pageSize]);

  const openModal = (event = null) => {
    setEditingEvent(event);
    if (event) {
      form.setFieldsValue({
        eventName: event.eventName,
        description: event.description,
        startDate: moment(event.startDate),
        endDate: moment(event.endDate),
        location: event.location
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSaveEvent = async () => {
    try {
      const values = await form.validateFields();
      const eventData = {
        ...values,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        organizerId: 1 // Replace with actual logged-in user ID
      };

      if (editingEvent) {
        await EventService.updateEvent(editingEvent.eventId, eventData);
        message.success('Cập nhật sự kiện thành công');
      } else {
        await EventService.createEvent(eventData);
        message.success('Thêm sự kiện thành công');
      }

      setIsModalOpen(false);
      setEditingEvent(null);
      form.resetFields();
      fetchEvents();
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại');
    }
  };

  const handleDeleteEvent = (eventId) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa sự kiện này?',
      onOk: async () => {
        try {
          await EventService.deleteEvent(eventId);
          message.success('Xóa sự kiện thành công');
          fetchEvents();
        } catch (error) {
          message.error('Không thể xóa sự kiện');
        }
      }
    });
  };

  const handleTableChange = (pagination) => {
    setPagination({
      page: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'eventId', key: 'eventId' },
    { title: 'Tên Sự Kiện', dataIndex: 'eventName', key: 'eventName' },
    { 
      title: 'Ngày Bắt Đầu', 
      dataIndex: 'startDate', 
      key: 'startDate',
      render: date => moment(date).format('DD/MM/YYYY HH:mm')
    },
    { 
      title: 'Ngày Kết Thúc', 
      dataIndex: 'endDate', 
      key: 'endDate',
      render: date => moment(date).format('DD/MM/YYYY HH:mm')
    },
    { title: 'Địa Điểm', dataIndex: 'location', key: 'location' },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
            type="default"
            shape="circle"
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteEvent(record.eventId)}
            danger
            type="default"
            shape="circle"
          />
        </>
      ),
    },
  ];

  return (
    <AdminLayout headerName="Sự Kiện">
      <Content style={{ padding: '24px' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => openModal()}
          style={{ marginBottom: 16 }}
        >
          Thêm Sự Kiện
        </Button>

        <Table
          columns={columns}
          dataSource={events}
          rowKey="eventId"
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total
          }}
        />

        <Modal
          title={editingEvent ? 'Chỉnh sửa Sự Kiện' : 'Thêm Sự Kiện'}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={handleSaveEvent}
          okText={editingEvent ? 'Cập nhật' : 'Thêm'}
          destroyOnClose
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="eventName"
              label="Tên Sự Kiện"
              rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả sự kiện' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="startDate"
              label="Ngày Bắt Đầu"
              rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="endDate"
              label="Ngày Kết Thúc"
              rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="location"
              label="Địa Điểm"
              rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </AdminLayout>
  );
};

export default EventPage;
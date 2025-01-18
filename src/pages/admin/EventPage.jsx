import React, { useState, useEffect } from 'react';
import { Layout, Button, Modal, Form, Input, DatePicker, message, Table, Upload, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import EventService from '../../services/EventService';
import moment from 'moment';

const { Content } = Layout;
const { TextArea } = Input;

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [imageUrl, setImageUrl] = useState('');
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');

  const fetchEvents = async (page = pagination.current, pageSize = pagination.pageSize) => {
    try {
      setLoading(true);
      const response = await EventService.getAllEvents(
        {}, // filter
        { page, size: pageSize }
      );
      setEvents(response.items || []);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: response.total || 0
      });
    } catch (error) {
      message.error('Không thể tải danh sách sự kiện');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleTableChange = (newPagination) => {
    fetchEvents(newPagination.current, newPagination.pageSize);
  };

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
      setImageUrl(event.img || '');
    } else {
      form.resetFields();
      setImageUrl('');
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageUrl(reader.result);
        resolve(reader.result);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSaveEvent = async () => {
    try {
      const values = await form.validateFields();
      
      if (!values.startDate || !values.endDate) {
        message.error('Vui lòng chọn ngày bắt đầu và kết thúc');
        return;
      }

      const startDate = values.startDate.toDate();
      if (startDate < new Date()) {
        message.error('Ngày bắt đầu không được ở quá khứ');
        return;
      }

      const endDate = values.endDate.toDate();
      if (endDate < startDate) {
        message.error('Ngày kết thúc không được trước ngày bắt đầu');
        return;
      }

      const eventData = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD HH:mm:ss'),
        endDate: values.endDate.format('YYYY-MM-DD HH:mm:ss'),
        organizerId: userInfo.userId,
        img: imageUrl
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
      setImageUrl('');
      fetchEvents(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại');
    }
  };

  const handleDeleteEvent = (eventId) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa sự kiện này?',
      content: 'Hành động này không thể hoàn tác',
      onOk: async () => {
        try {
          await EventService.deleteEvent(eventId);
          message.success('Xóa sự kiện thành công');
          fetchEvents(pagination.current, pagination.pageSize);
        } catch (error) {
          message.error('Không thể xóa sự kiện');
        }
      }
    });
  };

  const columns = [
    { 
      title: 'ID', 
      dataIndex: 'eventId', 
      key: 'eventId',
      width: 80 
    },
    { 
      title: 'Tên Sự Kiện', 
      dataIndex: 'eventName', 
      key: 'eventName',
      ellipsis: true 
    },
    { 
      title: 'Ngày Bắt Đầu', 
      dataIndex: 'startDate', 
      key: 'startDate',
      width: 180,
      render: date => moment(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => moment(a.startDate).unix() - moment(b.startDate).unix()
    },
    { 
      title: 'Ngày Kết Thúc', 
      dataIndex: 'endDate', 
      key: 'endDate',
      width: 180,
      render: date => moment(date).format('DD/MM/YYYY HH:mm')
    },
    { 
      title: 'Địa Điểm', 
      dataIndex: 'location', 
      key: 'location',
      ellipsis: true 
    },
    {
      title: 'Hành Động',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
            type="primary"
            size="small"
          />
          {/* <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteEvent(record.eventId)}
            type="primary"
            danger
            size="small"
          /> */}
        </Space>
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
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} sự kiện`,
            pageSizeOptions: ['10', '20', '50']
          }}
          scroll={{ x: 1000 }}
        />

        <Modal
          title={editingEvent ? 'Chỉnh sửa Sự Kiện' : 'Thêm Sự Kiện'}
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingEvent(null);
            setImageUrl('');
            form.resetFields();
          }}
          onOk={handleSaveEvent}
          okText={editingEvent ? 'Cập nhật' : 'Thêm'}
          width={800}
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
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item
              name="startDate"
              label="Ngày Bắt Đầu"
              rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
            >
              <DatePicker 
                showTime 
                format="DD/MM/YYYY HH:mm"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="Ngày Kết Thúc"
              rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
            >
              <DatePicker 
                showTime 
                format="DD/MM/YYYY HH:mm"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="location"
              label="Địa Điểm"
              rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Hình Ảnh">
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={async (file) => {
                  await handleImageUpload(file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
              </Upload>
              {imageUrl && (
                <img 
                  src={imageUrl} 
                  alt="Event preview" 
                  style={{ 
                    marginTop: 8,
                    maxWidth: '100%',
                    maxHeight: 200,
                    objectFit: 'contain'
                  }} 
                />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </AdminLayout>
  );
};

export default EventPage;
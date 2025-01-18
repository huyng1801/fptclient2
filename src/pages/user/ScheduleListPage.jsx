import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Space, Typography, notification, Rate, Modal, Form, Input } from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  StarOutlined,
  CheckOutlined
} from '@ant-design/icons';
import UserLayout from '../../layouts/UserLayout';
import ScheduleService from '../../services/ScheduleService';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ScheduleListPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [form] = Form.useForm();
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
  const isAlumni = userInfo?.roleName === 'Alumni';

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await ScheduleService.getAllSchedules(
        { mentorId: userInfo.userId },
        { page: 1, size: 50 }
      );
      setSchedules(response.items);
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải danh sách lịch hẹn',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
      return 'warning';
      case 'Scheduled':
      return 'success';
      case 'Canceled':
      return 'error';
      case 'Completed':
      return 'default';
      default:
      return 'default';
      }
  };

  const handleUpdateStatus = async (scheduleId, newStatus) => {
    try {
      await ScheduleService.updateSchedule(scheduleId, { status: newStatus });
      notification.success({
        message: 'Thành công',
        description: 'Cập nhật trạng thái lịch hẹn thành công',
      });
      fetchSchedules();
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể cập nhật trạng thái lịch hẹn',
      });
    }
  };

  const handleComplete = (scheduleId) => {
    Modal.confirm({
      title: 'Xác nhận hoàn thành',
      content: 'Bạn có chắc chắn muốn đánh dấu lịch hẹn này là đã hoàn thành?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => handleUpdateStatus(scheduleId, 'Completed')
    });
  };

  const handleRating = async (scheduleId) => {
    const schedule = schedules.find(s => s.scheduleId === scheduleId);
    setSelectedSchedule(schedule);
    form.setFieldsValue({
      rating: schedule.rating,
      comment: schedule.comment
    });
    setRatingModalVisible(true);
  };

  const handleRatingSubmit = async (values) => {
    try {
      await ScheduleService.updateSchedule(selectedSchedule.scheduleId, {
        ...selectedSchedule,
        rating: values.rating,
        comment: values.comment
      });
      notification.success({
        message: 'Thành công',
        description: 'Cập nhật đánh giá thành công',
      });
      setRatingModalVisible(false);
      form.resetFields();
      fetchSchedules();
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể cập nhật đánh giá',
      });
    }
  };

  const columns = [
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (time) => new Date(time).toLocaleString('vi-VN'),
      sorter: (a, b) => new Date(a.startTime) - new Date(b.startTime),
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (time) => new Date(time).toLocaleString('vi-VN'),
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating, record) => (
        <Space direction="vertical">
          {rating ? (
            <>
              <Rate disabled defaultValue={rating} />
              {record.comment && (
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {record.comment}
                </Text>
              )}
            </>
          ) : (
            isAlumni && record.status === 'COMPLETED' && (
              <Button 
                type="link" 
                icon={<StarOutlined />}
                onClick={() => handleRating(record.scheduleId)}
              >
                Đánh giá
              </Button>
            )
          )}
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status === 'Pending' && (
            <>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleUpdateStatus(record.scheduleId, 'Scheduled')}
              >
                Chấp nhận
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleUpdateStatus(record.scheduleId, 'Canceled')}
              >
                Từ chối
              </Button>
            </>
          )}
          {record.status === 'Scheduled' && (
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleComplete(record.scheduleId)}
            >
              Hoàn thành
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <UserLayout>
      <div style={{ padding: '24px' }}>
        <Card>
          <Title level={2}>Danh sách lịch hẹn</Title>
          <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
            Quản lý các lịch hẹn mentorship của bạn
          </Text>

          <Table
            columns={columns}
            dataSource={schedules}
            rowKey="scheduleId"
            loading={loading}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} lịch hẹn`,
            }}
          />
        </Card>

        <Modal
          title="Đánh giá lịch hẹn"
          open={ratingModalVisible}
          onCancel={() => {
            setRatingModalVisible(false);
            form.resetFields();
          }}
          footer={null}
        >
          <Form
            form={form}
            onFinish={handleRatingSubmit}
            layout="vertical"
          >
            <Form.Item
              name="rating"
              label="Đánh giá"
              rules={[{ required: true, message: 'Vui lòng chọn đánh giá' }]}
            >
              <Rate style={{ fontSize: 36 }} />
            </Form.Item>

            <Form.Item
              name="comment"
              label="Nhận xét"
              rules={[{ required: true, message: 'Vui lòng nhập nhận xét' }]}
            >
              <TextArea
                rows={4}
                placeholder="Nhập nhận xét của bạn về buổi mentorship..."
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={() => {
                  setRatingModalVisible(false);
                  form.resetFields();
                }}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  Gửi đánh giá
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </UserLayout>
  );
};

export default ScheduleListPage;
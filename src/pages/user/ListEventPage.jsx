import React, { useState, useEffect } from "react";
import { Row, Col, Input, Typography, Button, Modal, message, Form, DatePicker, Space, Upload, Checkbox, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UserLayout from "../../layouts/UserLayout";
import EventService from "../../services/EventService";
import UserService from "../../services/UserService";
import { PagingListItem } from "../../components/PagingListItem";
import EventCard from "../../components/EventCard/EventCard";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

const styles = {
  header: {
    marginBottom: "32px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "16px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
  },
  filterSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
  },
  searchInput: {
    flex: 1,
    borderRadius: "8px",
    height: "48px",
    fontSize: "16px",
  },
  createButton: {
    marginTop: "32px",
  },
  uploadButton: {
    width: '100%',
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px dashed #d9d9d9',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  previewImage: {
    width: '100%',
    height: 200,
    objectFit: 'cover',
    borderRadius: '8px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },
  pagination: {
    marginTop: '32px',
    textAlign: 'center',
  }
};

function ListEventPage() {
  const [events, setEvents] = useState([]);
  const [organizers, setOrganizers] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [form] = Form.useForm();
  const [showMyEvents, setShowMyEvents] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
  const navigate = useNavigate();
  const itemsPerPage = 6;

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await EventService.getAllEvents({
        page: currentPage,
        size: itemsPerPage
      });
      setEvents(response.items);
      setTotalPages(response.totalPages);

      const userPromises = response.items.map((event) => {
        if (event.organizerId) {
          return UserService.getUser(event.organizerId)
            .then((user) => ({ organizerId: event.organizerId, user }))
            .catch((error) => {
              console.error(`Error fetching user with ID ${event.organizerId}:`, error);
              return { organizerId: event.organizerId, user: null };
            });
        }
        return Promise.resolve({ organizerId: event.organizerId, user: null });
      });

      const users = await Promise.all(userPromises);
      const organizersData = {};
      users.forEach(({ organizerId, user }) => {
        if (user) {
          organizersData[organizerId] = user;
        }
      });

      setOrganizers(organizersData);
    } catch (error) {
      message.error("Không thể tải danh sách sự kiện");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentPage]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setImageUrl(event.img);
    form.setFieldsValue({
      eventName: event.eventName,
      description: event.description,
      location: event.location,
      startDate: dayjs(event.startDate),
      endDate: dayjs(event.endDate),
    });
    setEditModalVisible(true);
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (info) => {
    if (info.file) {
      try {
        const base64 = await getBase64(info.file);
        setImageUrl(base64);
      } catch (error) {
        message.error('Không thể tải ảnh lên');
      }
    }
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedEvent = {
        ...values,
        organizerId: userInfo.userId,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        img: imageUrl,
      };

      await EventService.updateEvent(editingEvent.eventId, updatedEvent);
      message.success("Cập nhật sự kiện thành công");
      setEditModalVisible(false);
      fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
      message.error("Không thể cập nhật sự kiện");
    }
  };

  const handleDelete = (event) => {
    confirm({
      title: 'Xác nhận xóa sự kiện',
      content: 'Bạn có chắc chắn muốn xóa sự kiện này? Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          await EventService.deleteEvent(event.eventId);
          message.success('Sự kiện đã được xóa thành công');
          fetchEvents();
        } catch (error) {
          message.error('Không thể xóa sự kiện. Vui lòng thử lại sau.');
        }
      },
    });
  };

  const filteredEvents = events
    .filter((event) => event.eventName.toLowerCase().includes(searchQuery))
    .filter((event) => !showMyEvents || event.organizerId === userInfo.userId);

  const uploadButton = (
    <div style={styles.uploadButton}>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
    </div>
  );

  return (
    <UserLayout>
      <div style={styles.header}>
        <Title level={2} style={styles.title}>
          Khám phá sự kiện
        </Title>
        <Text style={styles.subtitle}>
          Tìm kiếm và tham gia các sự kiện thú vị
        </Text>
      </div>

      <div style={styles.filterSection}>
        <Input
          placeholder="Tìm kiếm sự kiện"
          value={searchQuery}
          onChange={handleSearch}
          style={styles.searchInput}
        />
        <Checkbox
          checked={showMyEvents}
          onChange={(e) => setShowMyEvents(e.target.checked)}
          disabled={!userInfo?.userId}
        >
          Sự kiện của tôi
        </Checkbox>
      </div>
      
      <Button
        type="primary"
        onClick={() => navigate("/create-event")}
        style={styles.createButton}
      >
        Tạo sự kiện mới
      </Button>

      {loading ? (
        <div style={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
            {filteredEvents.map((event) => (
              <Col key={event.eventId} xs={24} sm={24} md={12} lg={12} xl={8}>
                <EventCard
                  event={event}
                  organizer={organizers[event.organizerId]}
                  onClick={() => navigate(`/event/${event.eventId}`)}
                  onEdit={() => handleEdit(event)}
                  onDelete={() => handleDelete(event)}
                  isOwner={event.organizerId === userInfo?.userId}
                />
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <div style={styles.pagination}>
              <PagingListItem
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

      <Modal
        title="Chỉnh sửa sự kiện"
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setEditModalVisible(false)}
        width={800}
        okText="Lưu thay đổi"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editingEvent}
        >
          <Form.Item
            name="eventName"
            label="Tên sự kiện"
            rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="location"
            label="Địa điểm"
            rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
          >
            <Input />
          </Form.Item>

          <Space size="large">
            <Form.Item
              name="startDate"
              label="Ngày bắt đầu"
              rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
            >
              <DatePicker showTime format="DD/MM/YYYY HH:mm" />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="Ngày kết thúc"
              rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
            >
              <DatePicker showTime format="DD/MM/YYYY HH:mm" />
            </Form.Item>
          </Space>

          <Form.Item label="Ảnh sự kiện">
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={(file) => {
                handleImageChange({ file });
                return false;
              }}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="event" style={styles.previewImage} />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </UserLayout>
  );
}

export default ListEventPage;
import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Input,
  Modal,
  message,
  Form,
  DatePicker,
  Space,
  Upload,
  Table,
  Tag,
  Rate,
  Avatar,
  Descriptions,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import UserLayout from "../../layouts/UserLayout";
import EventService from "../../services/EventService";
import UserService from "../../services/UserService";
import UserJoinEventService from "../../services/UserJoinEventService";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

const MyEventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [form] = Form.useForm();
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
  const navigate = useNavigate();

  // New state for details modal
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [participantDetails, setParticipantDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleViewDetails = async (event) => {
    setSelectedEvent(event);
    setLoadingDetails(true);
    setDetailsModalVisible(true);

    try {
      const participantsResponse =
        await UserJoinEventService.viewAllUserJoinEvents({
          eventId: event.eventId,
        });
      setParticipants(participantsResponse.items);

      const participantDetailsPromises = participantsResponse.items.map(
        async (participant) => {
          try {
            const userDetails = await UserService.getUser(participant.userId);
            return { userId: participant.userId, details: userDetails };
          } catch (error) {
            console.error(
              `Error fetching user ${participant.userId} details:`,
              error
            );
            return { userId: participant.userId, details: null };
          }
        }
      );

      const participantDetailsResults = await Promise.all(
        participantDetailsPromises
      );
      const participantDetailsMap = {};
      participantDetailsResults.forEach(({ userId, details }) => {
        participantDetailsMap[userId] = details;
      });
      setParticipantDetails(participantDetailsMap);
    } catch (error) {
      message.error("Không thể tải thông tin người tham gia");
    } finally {
      setLoadingDetails(false);
    }
  };

  const columns = [
    {
      title: "Tên sự kiện",
      dataIndex: "eventName",
      key: "eventName",
      sorter: (a, b) => a.eventName.localeCompare(b.eventName),
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => new Date(date).toLocaleString("vi-VN"),
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        const now = new Date();
        const startDate = new Date(record.startDate);
        const endDate = new Date(record.endDate);

        let status;
        let color;

        if (now < startDate) {
          status = "Sắp diễn ra";
          color = "blue";
        } else if (now >= startDate && now <= endDate) {
          status = "Đang diễn ra";
          color = "green";
        } else {
          status = "Đã kết thúc";
          color = "red";
        }

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleViewDetails(record)}>
            Chi tiết
          </Button>
          <Button onClick={() => handleEdit(record)}>Sửa</Button>
          <Button danger onClick={() => handleDelete(record)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const participantColumns = [
    {
      title: "Người tham gia",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar
            icon={<UserOutlined />}
            src={participantDetails[record.userId]?.profilePicture}
          />
          <Text>
            {participantDetails[record.userId]
              ? `${participantDetails[record.userId].firstName} ${
                  participantDetails[record.userId].lastName
                }`
              : "Đang tải..."}
          </Text>
        </Space>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating) =>
        rating ? <Rate disabled defaultValue={rating} /> : "Chưa đánh giá",
    },
    {
      title: "Nhận xét",
      dataIndex: "content",
      key: "content",
      render: (content) => content || "Không có nhận xét",
    },
  ];

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await EventService.getAllEvents();
      const myEvents = response.items.filter(
        (event) => event.organizerId === userInfo.userId
      );
      setEvents(myEvents);
    } catch (error) {
      message.error("Không thể tải danh sách sự kiện");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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

  const handleDelete = (event) => {
    confirm({
      title: "Xác nhận xóa sự kiện",
      content:
        "Bạn có chắc chắn muốn xóa sự kiện này? Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        try {
          await EventService.deleteEvent(event.eventId);
          message.success("Sự kiện đã được xóa thành công");
          fetchEvents();
        } catch (error) {
          message.error("Không thể xóa sự kiện. Vui lòng thử lại sau.");
        }
      },
    });
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
      message.error("Không thể cập nhật sự kiện");
    }
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
        message.error("Không thể tải ảnh lên");
      }
    }
  };

  const filteredEvents = events.filter((event) =>
    event.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <UserLayout>
      <div style={{ padding: "24px" }}>
        <div
          style={{
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Title level={2} style={{ margin: 0 }}>
              Sự kiện của tôi
            </Title>
            <Text type="secondary">Quản lý các sự kiện mà bạn tổ chức</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/create-event")}
          >
            Tạo sự kiện mới
          </Button>
        </div>

        <Input
          placeholder="Tìm kiếm sự kiện"
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: "24px" }}
        />

        <Table
          columns={columns}
          dataSource={events.filter((event) =>
            event.eventName.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          rowKey="eventId"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} sự kiện`,
          }}
        />

        {/* Event Details Modal */}
        <Modal
          title={selectedEvent?.eventName}
          open={detailsModalVisible}
          onCancel={() => setDetailsModalVisible(false)}
          width={1000}
          footer={null}
        >
          {loadingDetails ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spin />
            </div>
          ) : (
            <>
              <div style={{ marginBottom: "24px" }}>
                <Title level={4}>Thông tin sự kiện</Title>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Mô tả">
                    {selectedEvent?.description}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa điểm">
                    {selectedEvent?.location}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian bắt đầu">
                    {selectedEvent?.startDate &&
                      new Date(selectedEvent.startDate).toLocaleString("vi-VN")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian kết thúc">
                    {selectedEvent?.endDate &&
                      new Date(selectedEvent.endDate).toLocaleString("vi-VN")}
                  </Descriptions.Item>
                </Descriptions>
              </div>

              <Title level={4}>
                Danh sách người tham gia ({participants.length})
              </Title>
              <Table
                columns={participantColumns}
                dataSource={participants}
                rowKey="id"
                pagination={false}
              />
            </>
          )}
        </Modal>

        {/* Edit Event Modal */}
        <Modal
          title="Chỉnh sửa sự kiện"
          open={editModalVisible}
          onOk={handleEditSubmit}
          onCancel={() => setEditModalVisible(false)}
          width={800}
          okText="Lưu thay đổi"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical" initialValues={editingEvent}>
            <Form.Item
              name="eventName"
              label="Tên sự kiện"
              rules={[{ required: true, message: "Vui lòng nhập tên sự kiện" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item
              name="location"
              label="Địa điểm"
              rules={[{ required: true, message: "Vui lòng nhập địa điểm" }]}
            >
              <Input />
            </Form.Item>

            <Space size="large">
              <Form.Item
                name="startDate"
                label="Ngày bắt đầu"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày bắt đầu" },
                ]}
              >
                <DatePicker showTime format="DD/MM/YYYY HH:mm" />
              </Form.Item>

              <Form.Item
                name="endDate"
                label="Ngày kết thúc"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày kết thúc" },
                ]}
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
                  <img
                    src={imageUrl}
                    alt="event"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </UserLayout>
  );
};

export default MyEventPage;

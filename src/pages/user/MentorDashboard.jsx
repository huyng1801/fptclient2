import React, { useState } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Pagination,
  Button,
  Modal,
  Input,
  Form,
} from "antd";
import { StarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../layouts/UserLayout";

const { Content } = Layout;

const MentorDashboardListItem = ({ item, onclick }) => {
  return (
    <Card className="mb-3 shadow-sm">
      <Row gutter={16} align="middle">
        <Col span={4}>
          <img
            src={item.img}
            alt="Card image"
            className="img-fluid"
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              border: "1px solid black",
            }}
          />
        </Col>

        <Col span={20}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ flexDirection: "column" }}>
              <h3 className="text-primary">{item.name}</h3>
              <p>{item.role}</p>
              <p>{item.major}</p>
            </div>
            <div className="text-muted text-end">
              <span className="d-flex align-items-center justify-content-end">
                Đánh giá: {item.rating}
                <StarOutlined
                  style={{ color: "orange", marginBottom: 2, fontSize: 20 }}
                />
              </span>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

function MentorDashboardPage() {
  const mentors = [
    {
      img: "/assets/images/logo.png",
      name: "Tên mentor 1",
      role: "Role mentor 1",
      major: "Chuyên ngành mentor 1",
      rating: "4.9",
    },
    {
      img: "/assets/images/logo.png",
      name: "Tên mentor 2",
      role: "Role mentor 2",
      major: "Chuyên ngành mentor 2",
      rating: "5",
    },
    {
      img: "/assets/images/logo.png",
      name: "Tên mentor 3",
      role: "Role mentor 3",
      major: "Chuyên ngành mentor 3",
      rating: "4.6",
    },
    {
      img: "/assets/images/logo.png",
      name: "Tên mentor 4",
      role: "Role mentor 4",
      major: "Chuyên ngành mentor 4",
      rating: "4",
    },
    {
      img: "/assets/images/logo.png",
      name: "Tên mentor 5",
      role: "Role mentor 5",
      major: "Chuyên ngành mentor 5",
      rating: "2",
    },
    {
      img: "/assets/images/logo.png",
      name: "Tên mentor 6",
      role: "Role mentor 6",
      major: "Chuyên ngành mentor 6",
      rating: "2.5",
    },
    {
      img: "/assets/images/logo.png",
      name: "Tên mentor 7",
      role: "Role mentor 7",
      major: "Chuyên ngành mentor 7",
      rating: "3",
    },
    {
      img: "/assets/images/logo.png",
      name: "Tên mentor 8",
      role: "Role mentor 8",
      major: "Chuyên ngành mentor 8",
      rating: "4.5",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(mentors.length / itemsPerPage);
  const currentItem = mentors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const navigate = useNavigate();

  const showMentorDashboardDetails = () => {
    navigate("/mentorDashboard/1");
  };

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ title: "", content: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const checkOTPFormData = () => ({
    title: "Yêu cầu",
    fields: [
      {
        value: formValues.title,
        label: "Tiêu đề",
        name: "title",
        required: true,
        type: "text",
        onChange: handleChange,
      },
      {
        value: formValues.content,
        label: "Nội dung yêu cầu",
        name: "content",
        type: "text",
        required: true,
        onChange: handleChange,
      },
    ],
    submitText: "Gửi Yêu Cầu",
  });

  const onSendRequest = () => {
    alert("Send request successfully!");
  };

  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
  };

  return (
    <UserLayout>
      <Row gutter={[16, 16]} justify="center">
        <Col span={8} style={{ textAlign: "right" }}>
          <Button type="primary" onClick={() => setIsFormModalOpen(true)}>
            Gửi Yêu Cầu
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} justify="center">
        <Col span={16}>
          {currentItem.map((item, index) => (
            <MentorDashboardListItem
              key={index}
              onclick={showMentorDashboardDetails}
              item={item}
            />
          ))}
          <Pagination
            current={currentPage}
            total={mentors.length}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
            showSizeChanger={false}
            style={{ marginTop: "20px", textAlign: "center" }}
          />
        </Col>
      </Row>

      <Modal
        title="Gửi Yêu Cầu"
        visible={isFormModalOpen}
        onCancel={handleFormModalClose}
        footer={null}
      >
        <Form
          onFinish={onSendRequest}
          layout="vertical"
          initialValues={formValues}
        >
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input
              name="title"
              value={formValues.title}
              onChange={handleChange}
            />
          </Form.Item>

          <Form.Item
            label="Nội dung yêu cầu"
            name="content"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <Input.TextArea
              name="content"
              value={formValues.content}
              onChange={handleChange}
              rows={4}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Gửi Yêu Cầu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </UserLayout>
  );
}

export default MentorDashboardPage;

import React, { useState } from "react";
import { Container, Row, Col, Card, Pagination } from "react-bootstrap";
import { Box } from "@mui/material";
import HeaderComponent from "../../components/common/HeaderComponent";
import FooterComponent from "../../components/common/FooterComponent";
import { Star } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import FormModal from "../../components/common/FormModal";

const MentorDashboardListItem = ({ item, onclick }) => {
  return (
    <Card className="mb-3 shadow-sm">
      <Row className="g-0 align-items-center">
        <Col md={2}>
          <Card.Img
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

        <Col md={10}>
          <Card.Body className="d-flex justify-content-between align-items-center">
            <div
              className="d-flex flex-column justify-content-between"
              style={{ height: "100%" }}
            >
              <Card.Title className="text-primary">
                {item.name}
              </Card.Title>
              <Card.Text>{item.role}</Card.Text>
              <Card.Text>{item.major}</Card.Text>
            </div>
            <div className="text-muted text-end">
              <span className="d-flex align-items-center justify-content-end">
                Đánh giá: {item.rating}
                <Star
                  style={{ color: "orange", marginBottom: 2 }}
                  fontSize="small"
                  className="ms-1"
                />
              </span>
            </div>
          </Card.Body>
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

  const handleShowRequestForm = () => {
    setIsFormModalOpen(true);
  };

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    title: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const checkOTPFormData = () => {
    return {
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
    };
  };

  const onSendRequest = () => {
    alert("Send request successfully!");
  };

  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderComponent />

      <Box sx={{ backgroundColor: "#F7F7F7", py: 4 }}>
        <Container>
          <Row className="mb-4 justify-content-center">
            <Col md={8} className="text-end">
              <button
                onClick={() => handleShowRequestForm()}
                className="btn btn-primary"
              >
                Gửi Yêu Cầu
              </button>
            </Col>
          </Row>
          <Row className="mb-4 justify-content-center">
            <Col md={8}>
              {currentItem.map((item, index) => (
                <MentorDashboardListItem
                  key={index}
                  onclick={showMentorDashboardDetails}
                  item={item}
                />
              ))}
              <Pagination className="mt-3 justify-content-end">
                {[...Array(totalPages).keys()].map((page) => (
                  <Pagination.Item
                    key={page + 1}
                    active={page + 1 === currentPage}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    {page + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </Col>
          </Row>
        </Container>
      </Box>

      <FooterComponent />
      {isFormModalOpen && (
        <FormModal
          handleClose={handleFormModalClose}
          open={isFormModalOpen}
          formData={checkOTPFormData()}
          onSubmit={onSendRequest}
        />
      )}
    </div>
  );
}

export default MentorDashboardPage;

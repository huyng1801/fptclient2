import React, { useState } from "react";
import { Card, Button, Pagination, Typography } from "antd";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import UserLayout from "../../layouts/UserLayout";
import RatingStar from "../../components/RatingStar"; // Custom rating component

const { Title, Text } = Typography;

const MentorRatingPage = () => {
  const ratings = [
    {
      name: "Nguyen Van A",
      requestDetails: "Nguyen Van A cần giúp đỡ",
      response: "Đã giúp xong",
      comment: "Cảm ơn",
      rating: 0,
    },
    {
      name: "Nguyen Van B",
      requestDetails: "Nguyen Van B cần giúp đỡ",
      response: "Đã giúp xong",
      comment: "Cảm ơn",
      rating: 4,
    },
    {
      name: "Nguyen Van C",
      requestDetails: "Nguyen Van C cần giúp đỡ",
      response: "Đã giúp xong",
      comment: "Cảm ơn",
      rating: 3,
    },
    {
      name: "Nguyen Van D",
      requestDetails: "Nguyen Van D cần giúp đỡ",
      response: "Đã giúp xong",
      comment: "Cảm ơn",
      rating: 4,
    },
    {
      name: "Nguyen Van E",
      requestDetails: "Nguyen Van E cần giúp đỡ",
      response: "Đã giúp xong",
      comment: "Cảm ơn",
      rating: 4,
    },
    {
      name: "Nguyen Van F",
      requestDetails: "Nguyen Van F cần giúp đỡ",
      response: "Đã giúp xong",
      comment: "Cảm ơn",
      rating: 5,
    },
    {
      name: "Nguyen Van G",
      requestDetails: "Nguyen Van G cần giúp đỡ",
      response: "Đã giúp xong",
      comment: "Cảm ơn",
      rating: 5,
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const currentItem = ratings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [rating, setRating] = useState(5);

  const handleRatingMentor = () => {
    alert(`Đánh giá mentor này ${rating} sao thành công!`);
  };

  return (
    <UserLayout>
      <div style={{ marginBottom: "20px" }}>
        <Title
          level={3}
          style={{ textAlign: "center", fontWeight: "bold", color: "#FFB400" }}
        >
          Đánh Giá Mentor
        </Title>
      </div>

      {currentItem.map((schedule, index) => (
        <Card
          key={index}
          style={{
            marginBottom: "20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Title level={4} style={{ color: "#1890ff" }}>
            {schedule.name}
          </Title>
          <div style={{ marginLeft: "50px" }}>
            <Text strong>Chi tiết yêu cầu: </Text>
            <Text>{schedule.requestDetails}</Text>
            <br />
            <Text strong>Phản hồi: </Text>
            <Text>{schedule.response}</Text>
            <br />
            <Text strong>Bình luận: </Text>
            <Text>{schedule.comment}</Text>
            <br />
            <Text strong>Đánh giá: </Text>
            {schedule.rating !== 0 && schedule.rating !== "" ? (
              <Text>
                {schedule.rating}
                <StarFilled style={{ color: "orange", marginLeft: "5px" }} />
              </Text>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <RatingStar
                  totalStars={5}
                  rating={rating}
                  onRating={setRating}
                />
                <Button type="primary" onClick={handleRatingMentor}>
                  Đánh giá
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}

      <Pagination
        current={currentPage}
        total={ratings.length}
        pageSize={itemsPerPage}
        onChange={handlePageChange}
        showSizeChanger={false}
        style={{ textAlign: "center", marginTop: "20px" }}
      />
    </UserLayout>
  );
};

export default MentorRatingPage;

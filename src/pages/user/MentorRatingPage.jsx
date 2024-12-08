import React, { useState } from "react";
import { Typography, Pagination } from "antd";
import UserLayout from "../../layouts/UserLayout/UserLayout";
import RatingCard from "../../components/Rating/RatingCard";

const { Title } = Typography;

const MentorRatingPage = () => {
  const styles = {
    content: {
      marginBottom: '32px',
    },
    pagination: {
      textAlign: 'center',
      marginTop: '32px',
    },
  };

  const ratings = [
    {
      id: 1,
      name: "Nguyen Van A",
      requestDetails: "Nguyen Van A cần giúp đỡ",
      response: "Đã giúp xong",
      comment: "Cảm ơn",
      rating: 0,
    },
    {
      id: 2,
      name: "Nguyen Van B",
      requestDetails: "Nguyen Van B cần giúp đỡ",
      response: "Đã giúp xong",
      comment: "Cảm ơn",
      rating: 4,
    },
    // ... other ratings
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [currentRatings, setCurrentRatings] = useState(
    ratings.map(rating => ({
      ...rating,
      currentRating: 5,
      onRatingChange: (value) => handleRatingChange(rating.id, value)
    }))
  );
  const itemsPerPage = 6;

  const handleRatingChange = (id, value) => {
    setCurrentRatings(prevRatings =>
      prevRatings.map(rating =>
        rating.id === id ? { ...rating, currentRating: value } : rating
      )
    );
  };

  const handleRatingSubmit = (id) => {
    const rating = currentRatings.find(r => r.id === id);
    if (rating) {
      alert(`Đánh giá mentor này ${rating.currentRating} sao thành công!`);
    }
  };

  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return currentRatings.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <UserLayout>
        <div style={styles.content}>
          {getCurrentItems().map((rating) => (
            <RatingCard
              key={rating.id}
              rating={rating}
              onRatingSubmit={handleRatingSubmit}
            />
          ))}
        </div>

        <div style={styles.pagination}>
          <Pagination
            current={currentPage}
            total={ratings.length}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
    </UserLayout>
  );
};

export default MentorRatingPage;
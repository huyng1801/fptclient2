import React, { useState } from "react";
import { Typography, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../layouts/UserLayout";
import RequestCard from "../../components/MentorRequest/RequestCard";

const { Title } = Typography;

const styles = {
  content: {
    marginBottom: '32px',
  },
  pagination: {
    textAlign: 'center',
    marginTop: '32px',
  },
};

function MentorRequestListPage() {
  const requests = [
    { name: "Tên 1", request: "Yêu cầu 1", comment: "Phản hồi 1" },
    { name: "Tên 2", request: "Yêu cầu 2", comment: "Phản hồi 2" },
    { name: "Tên 3", request: "Yêu cầu 3", comment: "Phản hồi 3" },
    { name: "Tên 4", request: "Yêu cầu 4", comment: "Phản hồi 4" },
    { name: "Tên 5", request: "Yêu cầu 5", comment: "Phản hồi 5" },
    { name: "Tên 6", request: "Yêu cầu 6", comment: "Phản hồi 6" },
    { name: "Tên 7", request: "Yêu cầu 7", comment: "Phản hồi 7" },
    { name: "Tên 8", request: "Yêu cầu 8", comment: "Phản hồi 8" },
    { name: "Tên 9", request: "Yêu cầu 9", comment: "Phản hồi 9" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return requests.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleBookSchedule = () => {
    navigate("/request/1");
  };

  return (
    <UserLayout>
      

        <div style={styles.content}>
          {getCurrentItems().map((request, index) => (
            <RequestCard
              key={index}
              request={request}
              onClick={handleBookSchedule}
            />
          ))}
        </div>

        <div style={styles.pagination}>
          <Pagination
            current={currentPage}
            total={requests.length}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
    </UserLayout>
  );
}

export default MentorRequestListPage;
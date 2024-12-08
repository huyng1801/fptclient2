import React, { useState } from "react";
import { Typography, Pagination } from "antd";
import UserLayout from "../../layouts/UserLayout/UserLayout";
import ScheduleCard from "../../components/Schedule/ScheduleCard";

const { Title } = Typography;

const SchedulePage = () => {
  const styles = {
   
    content: {
      marginBottom: '32px',
    },
    pagination: {
      textAlign: 'center',
      marginTop: '32px',
    },
  };

  const schedules = [
    {
      name: "Nguyen Van A",
      requestDetails: "Nguyen Van A cần giúp đỡ",
      response: "Đã giúp xong",
      time: "20/11/2024 17:00",
      location: "HCM",
    },
    // ... rest of the schedules
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return schedules.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <UserLayout>

        <div style={styles.content}>
          {getCurrentItems().map((schedule, index) => (
            <ScheduleCard key={index} schedule={schedule} />
          ))}
        </div>

        <div style={styles.pagination}>
          <Pagination
            current={currentPage}
            total={schedules.length}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
    </UserLayout>
  );
};

export default SchedulePage;
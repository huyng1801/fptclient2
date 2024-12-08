import React from 'react';
import { Col, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

function SectionList({ title, items, renderItem, viewAllPath }) {
  const navigate = useNavigate();

  return (
    <Col span={12}>
      <Title level={3} style={{ marginBottom: "20px", fontWeight: "600" }}>{title}</Title>
      {items.map(renderItem)}
      <Button
        type="primary"
        onClick={() => navigate(viewAllPath)}
        style={{
          width: "100%",
          marginTop: "10px",
          borderRadius: "8px",
          padding: "12px",
          backgroundColor: "#1890ff",
          color: "#fff",
          fontWeight: "600"
        }}
      >
        Xem thêm
      </Button>
    </Col>
  );
}

export default SectionList;
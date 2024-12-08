import React from 'react';
import { Col, Input, Select, Row } from 'antd';

const { Option } = Select;

function SearchAndFilter({ searchQuery, onSearch, onSortChange }) {
  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Select
          defaultValue="latest"
          style={{ width: "100%", marginBottom: 15 }}
          onChange={onSortChange}
        >
          <Option value="latest">Mới nhất</Option>
          <Option value="oldest">Cũ nhất</Option>
        </Select>
      </Col>
      <Col span={12}>
        <Input
          placeholder="Tìm kiếm bài viết"
          value={searchQuery}
          onChange={onSearch}
          style={{
            width: "100%",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
          }}
        />
      </Col>
    </Row>
  );
}

export default SearchAndFilter;
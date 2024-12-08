import React from 'react';
import { Col, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PostCard } from './PostCard';
import SearchAndFilter from '../SearchAndFilter/SearchAndFilter';

const { Title } = Typography;

function PostSection({ posts, searchQuery, onSearch, onSortChange }) {
  const navigate = useNavigate();

  return (
    <Col span={12}>
      <Title level={3} style={{ marginBottom: "20px", fontWeight: "600" }}>Diễn đàn</Title>
      
      <SearchAndFilter 
        searchQuery={searchQuery}
        onSearch={onSearch}
        onSortChange={onSortChange}
      />

      {posts.slice(0, 5).map((post) => (
        <PostCard
          key={post.postId}
          onClick={() => navigate(`/post/${post.postId}`)}
          item={post}
        />
      ))}
      
      <Button
        type="primary"
        onClick={() => navigate("/list-post")}
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

export default PostSection;
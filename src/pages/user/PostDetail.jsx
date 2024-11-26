import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Space, Divider, Skeleton, List } from 'antd';
import { useParams } from 'react-router-dom';
import UserLayout from '../../layouts/UserLayout';
import PostService from '../../services/PostService';
import CommentService from '../../services/CommentService'; // Import CommentService
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const PostDetail = () => {
  const { id } = useParams(); // Get the post ID from the URL parameters
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await PostService.getPostById(id);
        setPost(fetchedPost);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const fetchedComments = await CommentService.getCommentsByPostId(id);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleRepost = () => {
    console.log(`Reposted: ${post?.title}`);
    alert(`Bạn đã chia sẻ bài viết: ${post?.title}`);
  };

  return (
    <UserLayout>
      <Content style={{ padding: '24px', background: '#fff', borderRadius: '8px' }}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : post ? (
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Title level={2}>{post.title}</Title>
            <Space direction="horizontal">
              <Text type="secondary">Tác giả ID: {post.authorId}</Text>
              <Divider type="vertical" />
              <Text type="secondary">Lượt xem: {post.views}</Text>
            </Space>
            <Divider />
            <Paragraph>{post.content}</Paragraph>
            <Space direction="horizontal">
              <Text type="secondary">Trạng thái: {post.status}</Text>
              <Divider type="vertical" />
              <Text type="secondary">Chế độ riêng tư: {post.isPrivate ? 'Có' : 'Không'}</Text>
            </Space>
            <Button type="primary" onClick={handleRepost} style={{ marginTop: '10px' }}>
              Chia sẻ bài viết
            </Button>

            <Divider />
            <Title level={4}>Bình luận</Title>
            {commentsLoading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : comments.length > 0 ? (
              <List
                itemLayout="vertical"
                dataSource={comments}
                renderItem={(comment) => (
                  <List.Item>
                    <Text strong>Người bình luận ID: {comment.authorId}</Text>
                    <Paragraph>{comment.content}</Paragraph>
                  </List.Item>
                )}
              />
            ) : (
              <Text type="secondary">Chưa có bình luận nào cho bài viết này.</Text>
            )}
          </Space>
        ) : (
          <Title level={3}>Bài viết không tồn tại</Title>
        )}
      </Content>
    </UserLayout>
  );
};

export default PostDetail;

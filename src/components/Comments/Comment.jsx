import React, { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Button, Form, Input, Spin } from 'antd';
import { ClockCircleOutlined, CommentOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import ReplyList from './ReplyList';
import CommentService from '../../services/CommentService';
import UserService from '../../services/UserService'; 

const { Text } = Typography;

const Comment = ({ comment, onReplySubmit }) => {
  const [replyVisible, setReplyVisible] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [childComments, setChildComments] = useState([]);
  const [userInfo, setUserInfo] = useState(null); // State to store user info

  // Fetch child comments using ParentCommentId
  useEffect(() => {
    if (comment.commentId) {
      setLoadingReplies(true);
      CommentService.viewAllComments({ parentCommentId: comment.commentId })
        .then((response) => {
          setChildComments(response.items);
        })
        .catch((error) => {
          console.error('Lỗi khi lấy các bình luận con:', error);
        })
        .finally(() => {
          setLoadingReplies(false);
        });
    }
  }, [replyVisible, comment.commentId]);

  // Fetch user information for the comment
  useEffect(() => {
    if (comment.authorId) {
      UserService.getUser(comment.authorId)
        .then((response) => {
          setUserInfo(response);
        })
        .catch((error) => {
          console.error('Lỗi khi lấy thông tin người dùng:', error);
        });
    }
  }, [comment.authorId]);

  const handleReplyClick = () => {
    setReplyVisible(!replyVisible);
  };

  const handleSubmit = (values) => {
    const replyContent = values.reply.trim();
    if (replyContent) {
      onReplySubmit(comment.commentId, replyContent);
      setReplyVisible(false);
    }
  };

  return (
    <Card style={{ marginBottom: '16px', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <Avatar
          size={40}
          src={userInfo ? userInfo.profilePicture : 'https://via.placeholder.com/300x300'}
        >
          {userInfo ? userInfo.firstName.charAt(0) : 'U'}
        </Avatar>
        <Text strong>{userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : 'Người dùng chưa xác định'}</Text>
        <br />
        <Text type="secondary" style={{ fontSize: '12px' }}>
          <ClockCircleOutlined style={{ fontSize: 14 }} />{' '}
          {format(new Date(comment.createdAt), 'dd/MM/yyyy')}
        </Text>
      </div>

      <div style={{ padding: '16px', fontSize: '14px', color: '#333' }}>{comment.content}</div>

      {loadingReplies ? (
        <Spin />
      ) : (
        childComments.length > 0 && <ReplyList replies={childComments} />
      )}

      <div style={{ padding: '8px 16px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
        <Button
          type="text"
          icon={<CommentOutlined />}
          onClick={handleReplyClick}
        >
          Trả lời
        </Button>
      </div>

      <div
        style={{
          ...{
            padding: '16px',
            background: '#f9f9f9',
            borderTop: '1px solid #f0f0f0',
            opacity: replyVisible ? 1 : 0,
            height: replyVisible ? 'auto' : 0,
            overflow: 'hidden',
            transition: 'opacity 0.5s ease, height 0.5s ease', // Add transition effects here
          },
        }}
      >
        {replyVisible && (
          <Form onFinish={handleSubmit}>
            <Form.Item
              name="reply"
              rules={[{ required: true, message: 'Vui lòng viết câu trả lời!' }]}
            >
              <Input.TextArea
                rows={2}
                placeholder="Viết câu trả lời của bạn..."
              />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Đăng câu trả lời
            </Button>
          </Form>
        )}
      </div>
    </Card>
  );
};

export default Comment;

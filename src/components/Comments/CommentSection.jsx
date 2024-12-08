import React, { useState } from 'react';
import { Typography, Form, Input, Button, notification } from 'antd';
import Comment from './Comment';
import CommentService from '../../services/CommentService';
import { organizeComments } from '../../utils/commentUtils';

const { Title } = Typography;

const CommentSection = ({ postId, comments: initialComments }) => {
  const [comments, setComments] = useState(organizeComments(initialComments));
  const [newComment, setNewComment] = useState('');

  const handleNewCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;

    const commentData = {
      postId,
      authorId: JSON.parse(sessionStorage.getItem('userInfo'))?.userId || 0,
      content: newComment,
      type: 'Comment',
      parentCommentId: null,
    };

    try {
      const response = await CommentService.createNewComment(commentData);
      const newCommentWithId = { ...commentData, ...response, replies: [] };
      setComments([newCommentWithId, ...comments]);
      setNewComment('');
      notification.success({
        message: 'Thành công',
        description: 'Bình luận của bạn đã được đăng thành công.',
      });
    } catch (err) {
      notification.error({
        message: 'Lỗi',
        description: 'Đã xảy ra lỗi khi đăng bình luận của bạn.',
      });
    }
  };

  const handleReplySubmit = async (parentCommentId, replyContent) => {
    const replyData = {
      postId,
      authorId: JSON.parse(sessionStorage.getItem('userInfo'))?.userId || 0,
      type: 'Reply',
      content: replyContent,
      parentCommentId,
    };

    try {
      const response = await CommentService.createNewComment(replyData);
      const newReply = { ...replyData, ...response };
      
      setComments(prevComments => {
        return prevComments.map(comment => {
          if (comment.commentId === parentCommentId) {
            return {
              ...comment,
              replies: [newReply, ...(comment.replies || [])],
            };
          }
          return comment;
        });
      });

      notification.success({
        message: 'Thành công',
        description: 'Phản hồi của bạn đã được đăng thành công.',
      });
    } catch (err) {
      notification.error({
        message: 'Lỗi',
        description: 'Đã xảy ra lỗi khi đăng phản hồi của bạn.',
      });
    }
  };

  return (
    <div style={{ background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        marginTop: '24px', }}>
      <Title level={4}>Bình luận ({comments.length})</Title>

      <div style={{ marginBottom: '16px' }}>
        <Title level={4}>Viết bình luận</Title>
        <Form onSubmit={handleNewCommentSubmit}>
          <Form.Item style={{ marginBottom: '12px' }}>
            <Input.TextArea
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Chia sẻ suy nghĩ của bạn..."
              style={{ marginBottom: '12px' }}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" style={{ marginTop: '8px' }}>
            Đăng bình luận
          </Button>
        </Form>
      </div>

      {comments.map((comment) => (
        <Comment
          key={comment.commentId}
          comment={comment}
          onReplySubmit={handleReplySubmit}
          style={{ marginBottom: '16px' }}
        />
      ))}
    </div>
  );
};

export default CommentSection;

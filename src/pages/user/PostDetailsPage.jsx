import React, { useEffect, useState } from "react";
import { Layout, Alert, Card, Typography, notification, Spin, Avatar, Tag, Space, Tooltip, Button } from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  LikeOutlined,
  BookOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import UserLayout from "../../layouts/UserLayout";
import { useParams } from "react-router-dom";
import PostService from "../../services/PostService";
import CommentService from "../../services/CommentService";
import UserService from "../../services/UserService";
import { format } from "date-fns";
import CommentSection from "../../components/Comments/CommentSection";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const styles = {
  mainCard: {
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    border: "1px solid #f0f0f0",
    overflow: "hidden",
    background: "#fff",
  },
  postHeader: {
    padding: "24px",
    borderBottom: "1px solid #f0f0f0",
    background: "#fff",
  },
  authorSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
  },
  authorInfo: {
    flex: 1,
  },
  postTitle: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "24px",
    lineHeight: 1.4,
  },
  postMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "16px",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#666",
    fontSize: "14px",
  },
  postContent: {
    padding: "32px",
    fontSize: "16px",
    lineHeight: "1.8",
    color: "#333",
  },
  actionBar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px 24px",
    borderTop: "1px solid #f0f0f0",
    background: "#fafafa",
  },
  actionButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "20px",
    transition: "all 0.3s ease",
    cursor: "pointer",
    color: "#666",
    "&:hover": {
      background: "#f0f0f0",
      color: "#1890ff",
    },
  },
  tags: {
    display: "flex",
    gap: "8px",
    marginTop: "16px",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
  },
};

function PostDetailsPage() {
  const { postId } = useParams();
  const [postDetails, setPostDetails] = useState(null);
  const [author, setAuthor] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const postData = await PostService.getPostById(postId);
        setPostDetails(postData);

        // Fetch author details
        if (postData.authorId) {
          const authorData = await UserService.getUser(postData.authorId);
          setAuthor(authorData);
        }

        const commentsData = await CommentService.viewAllComments({ 
          postId, 
          size: 1000
        });
        
        const organizedComments = commentsData.items.reduce((acc, comment) => {
          if (!comment.parentCommentId) {
            if (!acc.find((c) => c.commentId === comment.commentId)) {
              comment.replies = [];
              acc.push(comment);
            }
          } else {
            const parentComment = acc.find(
              (c) => c.commentId === comment.parentCommentId
            );
            if (parentComment) {
              parentComment.replies.push(comment);
            }
          }
          return acc;
        }, []);

        setComments(organizedComments);
      } catch (err) {
        setError("Lỗi khi lấy dữ liệu");
        notification.error({
          message: "Lỗi",
          description: "Đã có lỗi khi lấy chi tiết bài viết.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPostDetails();
    }
  }, [postId]);

  if (loading) {
    return (
      <UserLayout>
        <div style={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <div style={styles.container}>
          <Alert message={error} type="error" showIcon />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
        <Card style={styles.mainCard}>
          <div style={styles.postHeader}>
            <div style={styles.authorSection}>
              <Avatar 
                size={64} 
                icon={<UserOutlined />}
                src={author?.profilePicture}
              >
                {author?.firstName?.charAt(0)}
              </Avatar>
              <div style={styles.authorInfo}>
                <Text strong style={{ fontSize: "18px" }}>
                  {author ? `${author.firstName} ${author.lastName}` : "Loading..."}
                </Text>
                <br />
                <Text type="secondary">
                  {format(new Date(postDetails.createdAt), "dd MMMM yyyy")}
                </Text>
              </div>
            </div>

            <Title level={1} style={styles.postTitle}>
              {postDetails.title}
            </Title>

            <div style={styles.postMeta}>
              <Tooltip title="Views">
                <span style={styles.metaItem}>
                  <EyeOutlined style={{ color: "#1890ff" }} />
                  {postDetails.views} lượt xem
                </span>
              </Tooltip>
              <span style={styles.metaItem}>
                <ClockCircleOutlined style={{ color: "#52c41a" }} />
                {format(new Date(postDetails.createdAt), "HH:mm")}
              </span>
              <Button type="text" icon={<LikeOutlined />}>
              
            </Button>
           
            </div>

            <div style={styles.tags}>
              <Tag color="blue">
                <BookOutlined /> {postDetails.majorName}
              </Tag>
              <Tag color={postDetails.status === 'Published' ? 'green' : 'orange'}>
                {postDetails.status}
              </Tag>
              <Tooltip title={postDetails.isPrivate ? "Private post" : "Public post"}>
                <Tag color={postDetails.isPrivate ? 'red' : 'cyan'}>
                  {postDetails.isPrivate ? <LockOutlined /> : <UnlockOutlined />}
                </Tag>
              </Tooltip>
            </div>
          </div>

          <Paragraph style={styles.postContent}>
            {postDetails.content}
          </Paragraph>

        </Card>

        <CommentSection postId={postId} comments={comments} />
    </UserLayout>
  );
}

export default PostDetailsPage;
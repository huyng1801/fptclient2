import React, { useEffect, useState } from "react";
import {
  Layout,
  Form,
  Row,
  Col,
  Card,
  Input,
  Button,
  Typography,
  notification,
} from "antd";
import {
  Box,
  Report,
  Visibility,
  AccessTime,
  Person,
  Comment as CommentIcon,
} from "@mui/icons-material";
import UserLayout from "../../layouts/UserLayout"; // Assuming the path to UserLayout
import { useParams } from "react-router-dom";
import PostService from "../../services/PostService";
import CommentService from "../../services/CommentService";

const { Content } = Layout;

function PostDetailsPageV2() {
  const { postId } = useParams(); // Get the postId from the URL
  const [postDetails, setPostDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(""); // State to handle new comment input
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyVisible, setReplyVisible] = useState(null); // Track the visible reply input based on comment id

  // Fetch post details and comments when the component mounts
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const postData = await PostService.getPostById(postId);
        setPostDetails(postData);
        const commentsData = await CommentService.viewAllComments({ postId });
        setComments(commentsData.items);
      } catch (err) {
        setError("Error fetching data");
        notification.error({
          message: "Error",
          description: "There was an error fetching the post details.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPostDetails();
    }
  }, [postId]);

  // Handle submitting a new comment
  const handleNewCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return; // Don't submit if the comment is empty

    const commentData = {
      postId,
      authorId: JSON.parse(sessionStorage.getItem("userInfo"))?.userId || 0, // Replace with actual user ID
      content: newComment,
      type: "Comment",
      parentCommentId: null, // No parent comment for new comments
    };

    try {
      await CommentService.createNewComment(commentData);
      setComments([...comments, commentData]); // Add the new comment to the list
      setNewComment(""); // Clear the input field
      notification.success({
        message: "Success",
        description: "Your comment has been posted successfully.",
      });
    } catch (err) {
      notification.error({
        message: "Error",
        description: "There was an error posting your comment.",
      });
    }
  };

  // Handle replying to a comment
  const handleReplySubmit = async (e, parentCommentId) => {
    e.preventDefault();
    const replyContent = e.target.elements.reply.value.trim();
    if (replyContent === "") return;

    const replyData = {
      postId,
      authorId: JSON.parse(sessionStorage.getItem("userInfo"))?.userId || 0, // Replace with actual user ID
      type: "Comment",
      content: replyContent,
      parentCommentId: parentCommentId,
    };

    try {
      await CommentService.createNewComment(replyData);
      setComments((prevComments) => [...prevComments, replyData]); // Add the reply to the list
      setReplyVisible(null); // Hide the reply input after submission
      notification.success({
        message: "Success",
        description: "Your reply has been posted successfully.",
      });
    } catch (err) {
      notification.error({
        message: "Error",
        description: "There was an error posting your reply.",
      });
    }
  };

  // Handle the reply button click, toggle visibility of the input for the selected comment
  const handleReplyClick = (commentId) => {
    // If the clicked comment already has its input visible, hide it, otherwise show it
    setReplyVisible((prevState) => (prevState === commentId ? null : commentId));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <UserLayout>
      <Content>
        <Row justify="center">
          <Col span={24}>
            <Card
              title={
                <Typography.Title level={2}>{postDetails.title}</Typography.Title>
              }
              bordered={false}
              style={{ marginBottom: 24 }}
            >
              <Typography.Text>{postDetails.content}</Typography.Text>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 16,
                }}
              >
                <Typography.Text type="secondary">
                  <Person style={{ fontSize: 16 }} /> {postDetails.postedBy}
                </Typography.Text>
                <Typography.Text type="secondary">
                  <Visibility style={{ fontSize: 16 }} /> {postDetails.views}{" "}
                  views
                </Typography.Text>
              </div>
              <div style={{ marginTop: 8 }}>
                <Report style={{ fontSize: 20 }} />
                <span> Report</span>
              </div>
            </Card>

            {/* Comments Section */}
            <Typography.Title level={4}>
              Comments ({comments.length})
            </Typography.Title>

            {comments.map((comment, index) => (
              <Card key={index} style={{ marginBottom: 16 }}>
                <Row>
                  <Col span={20}>
                    <Typography.Text strong>{comment.user}</Typography.Text>
                    <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
                      <AccessTime style={{ fontSize: 14 }} /> {comment.date}
                    </Typography.Text>
                    <p style={{ marginTop: 8 }}>{comment.content}</p>
                  </Col>
                  <Col
                    span={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      onClick={() => handleReplyClick(comment.commentId)}
                      style={{ cursor: "pointer" }}
                    >
                      <CommentIcon style={{ fontSize: 16 }} />
                      <span> Reply</span>
                    </div>
                  </Col>
                </Row>

                {/* Show reply input if it's visible */}
                {replyVisible === comment.commentId && (
                  <Form onSubmit={(e) => handleReplySubmit(e, comment.commentId)}>
                    <Row gutter={16}>
                      <Col span={20}>
                        <Input
                          placeholder="Write a reply..."
                          name="reply"
                          style={{ width: "100%" }}
                        />
                      </Col>
                      <Col span={4}>
                        <Button type="primary" htmlType="submit" block>
                          Reply
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Card>
            ))}

            {/* New Comment Section */}
            <Form onSubmit={handleNewCommentSubmit}>
              <Card>
                <Form.Item>
                  <Input.TextArea
                    rows={4}
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Post Comment
                </Button>
              </Card>
            </Form>
          </Col>
        </Row>
      </Content>
    </UserLayout>
  );
}

export default PostDetailsPageV2;

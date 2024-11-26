import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Box, Typography } from "@mui/material";
import HeaderComponent from "../../components/common/HeaderComponent";
import FooterComponent from "../../components/common/FooterComponent";
import { Visibility, AccessTime, Person, Report } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import PostService from "../../services/PostService";
import CommentService from "../../services/CommentService";
import { notification } from "antd"; // Import notification from Ant Design
import "./PostDetailsPageV2.css";

function PostDetailsPageV2() {
  const { postId } = useParams(); // Get the postId from the URL
  const [postDetails, setPostDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(""); // State to handle new comment input
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      authorId: JSON.parse(sessionStorage.getItem('userInfo'))?.userId || 0, // Replace with actual user ID
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
      authorId: JSON.parse(sessionStorage.getItem('userInfo'))?.userId || 0, // Replace with actual user ID
      type: "Comment",
      content: replyContent,
      parentCommentId: parentCommentId,
    };

    try {
      await CommentService.createNewComment(replyData);
      setComments((prevComments) => [...prevComments, replyData]); // Add the reply to the list
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderComponent />

      <Box sx={{ backgroundColor: "#f9f9f9", py: 4 }}>
        <Container>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Row>
                <Col>
                  <Typography variant="h4" className="text-primary mb-3">
                    {postDetails.title}
                  </Typography>
                </Col>

                <Col md="auto" className="d-flex align-items-center">
                  <div className="report-button">
                    <Report className="report-icon" fontSize="large" />
                    <div className="tooltip">report</div>
                  </div>
                </Col>
              </Row>
              <Typography variant="body1" className="mb-3">
                {postDetails.content}
              </Typography>
              <Typography variant="subtitle1" className="text-muted">
                <Person fontSize="small" className="me-1" /> {postDetails.postedBy}
              </Typography>
              <Typography variant="subtitle2" className="text-muted">
                <Visibility fontSize="small" className="me-1" /> {postDetails.views}
              </Typography>
            </Card.Body>
          </Card>

          <Typography variant="h5" className="mb-4">
            Comments ({comments.length})
          </Typography>

          {/* Display Comments */}
          {comments.map((comment, index) => (
            <Card key={index} className="mb-3 shadow-sm">
              <Card.Body>
                <Row>
                  <Col>
                    <Typography variant="subtitle1" className="fw-bold">
                      <Person fontSize="small" className="me-1" />
                      {comment.user}
                    </Typography>
                    <Typography variant="body2" className="text-muted">
                      <AccessTime fontSize="small" className="me-1" />
                      {comment.date}
                    </Typography>
                    <Typography variant="body1" className="mt-2">
                      {comment.content}
                    </Typography>

                    {/* Reply to Comment */}
                    <Form onSubmit={(e) => handleReplySubmit(e, comment.id)}>
                      <Form.Group controlId="reply">
                        <Form.Control
                          type="text"
                          placeholder="Write a reply..."
                          name="reply"
                        />
                      </Form.Group>
                      <Button variant="secondary" type="submit" className="mt-2">
                        Reply
                      </Button>
                    </Form>
                  </Col>
                  <Col md="auto" className="d-flex align-items-center">
                    <div className="report-button">
                      <Report className="report-icon" fontSize="small" />
                      <div className="tooltip">report</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}

          {/* New Comment Input */}
          <Form onSubmit={handleNewCommentSubmit}>
            <Form.Group controlId="newComment">
              <Form.Control
                as="textarea" // Use textarea for larger input
                rows={4} // Set the number of rows to make the input area larger
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">
              Post Comment
            </Button>
          </Form>
        </Container>
      </Box>

      <FooterComponent />
    </div>
  );
}

export default PostDetailsPageV2;

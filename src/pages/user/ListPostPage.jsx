import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Box } from "@mui/material";
import HeaderComponent from "../../components/common/HeaderComponent";
import FooterComponent from "../../components/common/FooterComponent";
import { Visibility, AccessTime, Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { PagingListItem } from "../../components/common/PagingListItem";
import PostService from "../../services/PostService"; // Import PostService
import UserService from "../../services/UserService"

export const MainBodyListItem = ({ item, onClick }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Fetch user data based on authId
    const fetchUser = async (authorId) => {
      try {
        const userData = await UserService.getUser(authorId); 
     
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (item.authorId) {
      fetchUser(item.authorId);
    }
  }, [item.authorId]);

  const styles = {
    title: {
      cursor: "pointer",
    },
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title onClick={onClick} className="text-primary" style={styles.title}>
          {item.title}
        </Card.Title>
        <Card.Text className="mb-1">{item.content}</Card.Text>
        <div className="d-flex justify-content-between text-muted">
          <span className="d-flex align-items-center">
            <Visibility fontSize="small" className="me-1" /> {item.views}
          </span>
          <span className="d-flex align-items-center">
            <AccessTime fontSize="small" className="me-1" /> {item.time}
          </span>
          <span className="d-flex align-items-center">
            <Person fontSize="small" className="me-1" /> 
            {user ? `${user.firstName} ${user.lastName}` : "Loading user..."}
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

function ListPostPage() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  // Fetch posts dynamically from the backend
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const filter = {}; // Add any filter criteria here
        const pagingModel = {
          page: currentPage,
          size: itemsPerPage,
        };
        const response = await PostService.getAllPosts(filter, pagingModel);
        setPosts(response.items); // Assuming the backend returns an `items` array
        setTotalPages(response.totalPages); // Assuming `totalPages` is returned
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowPostDetail = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderComponent />

      <Box sx={{ backgroundColor: "#F7F7F7", py: 4 }}>
        <Container>
          <Row className="mb-4 justify-content-center">
            <Col md={8}>
              {loading && <p>Loading posts...</p>}
              {error && <p className="text-danger">{error}</p>}
              {!loading &&
                !error &&
                posts.map((item) => (
                  <MainBodyListItem
                    key={item.id}
                    onClick={() => handleShowPostDetail(item.id)}
                    item={item}
                  />
                ))}
              <PagingListItem
                handlePageChange={handlePageChange}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </Col>
          </Row>
        </Container>
      </Box>

      <FooterComponent />
    </div>
  );
}

export default ListPostPage;

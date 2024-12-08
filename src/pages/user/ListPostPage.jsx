import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Spin, Alert, Input, Button, Row, Col, Select } from "antd";
import { PagingListItem } from "../../components/PagingListItem";
import { PostCard } from "../../components/PostSection/PostCard";
import PostService from "../../services/PostService";
import UserLayout from "../../layouts/UserLayout/UserLayout";

const { Option } = Select;

const styles = {

  errorAlert: {
    marginBottom: 20
  },
  loadingContainer: {
    textAlign: "center",
    marginTop: 50
  },
  filterSection: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginTop: "50px"
  },
  filterTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#1a1a1a"
  },
  searchInput: {
    marginBottom: "15px"
  },
  categoryButton: {
    marginBottom: "10px",
    width: "100%",
    textAlign: "left"
  },
  sortSection: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "20px"
  },
  postGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px"
  },
  postItem: {
    width: "100%"
  }
};

const categories = [
  { key: "tech", label: "Công nghệ" },
  { key: "health", label: "Sức khỏe" },
  { key: "business", label: "Kinh doanh" }
];

function ListPostPage() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ category: "", search: "" });
  const [sort, setSort] = useState("dateDesc");
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const pagingModel = {
          page: currentPage,
          size: itemsPerPage,
        };
        const response = await PostService.getAllPosts(
          filter,
          pagingModel,
          sort
        );
        setPosts(response.items);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, filter, sort]);

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (value, type) => {
    setFilter((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleSortChange = (value) => {
    setSort(value);
  };

  const handleCategoryClick = (category) => {
    setFilter((prev) => ({
      ...prev,
      category,
    }));
  };

  return (
    <UserLayout>
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={styles.errorAlert}
          />
        )}

        {loading ? (
          <div style={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={8} lg={6}>
              <div style={styles.filterSection}>
                <h3 style={styles.filterTitle}>Bộ lọc</h3>
                <Input
                  placeholder="Tìm kiếm bài viết"
                  value={filter.search}
                  onChange={(e) => handleFilterChange(e.target.value, "search")}
                  style={styles.searchInput}
                />

                <div>
                  <h4 style={styles.filterTitle}>Danh mục</h4>
                  {categories.map(({ key, label }) => (
                    <Button
                      key={key}
                      type={filter.category === key ? "primary" : "default"}
                      onClick={() => handleCategoryClick(key)}
                      style={styles.categoryButton}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </Col>

            <Col xs={24} sm={24} md={16} lg={18}>
              <div style={styles.postsSection}>
                <div style={styles.sortSection}>
                  <Select
                    defaultValue={sort}
                    onChange={handleSortChange}
                    style={{ width: "200px" }}
                  >
                    <Option value="dateDesc">Mới nhất</Option>
                    <Option value="dateAsc">Cũ nhất</Option>
                    <Option value="titleAsc">Tên A-Z</Option>
                    <Option value="titleDesc">Tên Z-A</Option>
                  </Select>
                </div>

                <div style={styles.postGrid}>
                  {posts.map((post) => (
                    <div key={post.postId} style={styles.postItem}>
                      <PostCard
                        item={post}
                        onClick={() => handlePostClick(post.postId)}
                      />
                    </div>
                  ))}
                </div>

                <PagingListItem
                  handlePageChange={handlePageChange}
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </div>
            </Col>
          </Row>
        )}
    </UserLayout>
  );
}

export default ListPostPage;
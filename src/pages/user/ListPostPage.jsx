import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Spin, Alert, Input, Button, Row, Col, Select } from "antd";
import { PagingListItem } from "../../components/PagingListItem"; // Import PagingListItem
import { MainBodyListItem } from "../../components/MainBodyListItem"; // Adjust as needed

import PostService from "../../services/PostService";
import UserLayout from "../../layouts/UserLayout";

const { Option } = Select;

// ListPostPage Component
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

  // Fetch posts whenever the currentPage, filter, or sort changes
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
        console.log(response);
        setPosts(response.items);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError("Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, filter, sort]);

  // Handle post item click
  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  // Handle page change (used by PagingListItem component)
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle filter change (e.g., category or search input)
  const handleFilterChange = (value, type) => {
    setFilter((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Handle sorting change
  const handleSortChange = (value) => {
    setSort(value);
  };

  // Handle category item click
  const handleCategoryClick = (category) => {
    setFilter((prev) => ({
      ...prev,
      category,
    }));
  };

  return (
    <UserLayout>
      <div style={{ padding: "20px" }}>
        {/* Show error message if fetching fails */}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 20 }}
          />
        )}

        {/* Loading spinner */}
        {loading ? (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <Spin size="large" />
          </div>
        ) : (
          <div>
            <Row gutter={[16, 16]}>
              {/* Filter Section (Left) */}
              <Col xs={24} sm={24} md={8} lg={6}>
                <div style={filterSectionStyle}>
                  {/* Category Filter as List of Clickable Items */}
                  <div style={{ marginBottom: "20px" }}>
                    {/* Search Filter */}
                    <Input
                      placeholder="Search posts"
                      value={filter.search}
                      onChange={(e) =>
                        handleFilterChange(e.target.value, "search")
                      }
                      style={filterInputStyle}
                    />

                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {["tech", "health", "business"].map((category) => (
                        <Button
                          key={category}
                          type={
                            filter.category === category ? "primary" : "default"
                          }
                          onClick={() => handleCategoryClick(category)}
                          style={{ marginBottom: "10px" }}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Col>

              {/* Posts Section (Right) */}
              <Col xs={24} sm={24} md={16} lg={18}>
                <div style={postsSectionStyle}>
                  {/* Sort Section */}
                  <div style={sortSectionStyle}>
                    <Select
                      defaultValue={sort}
                      onChange={handleSortChange}
                      style={{ width: "200px" }}
                    >
                      <Option value="dateDesc">Sort by Date (Newest)</Option>
                      <Option value="dateAsc">Sort by Date (Oldest)</Option>
                      <Option value="titleAsc">Sort by Title (A-Z)</Option>
                      <Option value="titleDesc">Sort by Title (Z-A)</Option>
                    </Select>
                  </div>

                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}
                  >
                    {/* Render posts */}
                    {posts.map((post) => (
                      <div key={post.postId} style={{ width: "100%" }}>
                        <MainBodyListItem
                          item={post}
                          onClick={() => handlePostClick(post.postId)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Pagination controls */}
                  <PagingListItem
                    handlePageChange={handlePageChange}
                    currentPage={currentPage}
                    totalPages={totalPages}
                  />
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

// Styles for the filter and posts section
const filterSectionStyle = {
  paddingTop: "15px",
};

const filterInputStyle = {
  width: "100%",
  marginBottom: "10px",
};

const postsSectionStyle = {
  padding: "15px",
};

const sortSectionStyle = {
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: "20px",
};

export default ListPostPage;

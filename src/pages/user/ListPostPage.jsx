import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Spin, Alert, Input, Button, Row, Col, Select, Checkbox, Form, message, Modal } from "antd";
import { PagingListItem } from "../../components/PagingListItem";
import { PostCard } from "../../components/PostSection/PostCard";
import MajorCodeService from "../../services/MajorCodeService";
import PostService from "../../services/PostService";
import UserLayout from "../../layouts/UserLayout";

const { Option } = Select;
const { TextArea } = Input;
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
    marginTop: "20px"
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
  sortSection: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px"
  },
  postGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px"
  },
  postItem: {
    width: "100%"
  },
  checkboxContainer: {
    marginTop: "15px",
    marginBottom: "15px",
    padding: "10px 0",
    borderTop: "1px solid #f0f0f0",
    borderBottom: "1px solid #f0f0f0"
  },
  modalForm: {
    marginTop: "24px"
  }
};

function ListPostPage() {
  const [posts, setPosts] = useState([]);
  const [majors, setMajors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filter, setFilter] = useState({ majorId: "", title: "", authorId: "" });
  const [sort, setSort] = useState("dateDesc");
  const [showMyPosts, setShowMyPosts] = useState(false);
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await MajorCodeService.getAllMajorCodes();
        setMajors(response.items);
      } catch (err) {
        console.error("Error loading majors:", err);
      }
    };

    fetchMajors();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [currentPage, filter.majorId, filter.authorId, sort]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const pagingModel = {
        page: currentPage,
        size: itemsPerPage,
      };
      const response = await PostService.getAllPosts(filter, pagingModel, sort);
      const filteredPosts = response.items.filter(post => {
        if (!post.isPrivate) return true;
        return post.authorId === userInfo?.userId;
      });

      setPosts(filteredPosts);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError("Không thể tải bài viết. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (post, e) => {
    e.stopPropagation();
    setEditingPost(post);
    form.setFieldsValue({
      title: post.title,
      content: post.content,
      majorId: post.majorId,
      isPrivate: post.isPrivate,
      status: post.status
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      await PostService.updatePost(editingPost.postId, {
        ...editingPost,
        ...values
      });
      
      message.success('Cập nhật bài viết thành công');
      setEditModalVisible(false);
      fetchPosts(); // Refresh the posts list
    } catch (error) {
      message.error('Không thể cập nhật bài viết. Vui lòng thử lại sau.');
    }
  };
  const handlePostClick = (postId) => {
    if (!userInfo?.userId) {
      navigate('/login');
      return;
    }
    navigate(`/post/${postId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchClick = () => {
    setFilter(prev => ({
      ...prev,
      title: searchInput
    }));
    setCurrentPage(1);
  };

  const handleCategoryChange = (majorId) => {
    setFilter(prev => ({
      ...prev,
      majorId: majorId === "all" ? "" : majorId
    }));
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSort(value);
    setCurrentPage(1);
  };

  const handleMyPostsChange = (e) => {
    setShowMyPosts(e.target.checked);
    setFilter(prev => ({
      ...prev,
      authorId: e.target.checked ? userInfo?.userId : ""
    }));
    setCurrentPage(1);
  };

  return (
    <UserLayout>
      {error && (
        <Alert message={error} type="error" showIcon style={styles.errorAlert} />
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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={styles.searchInput}
              />
              <Button
                type="primary"
                onClick={handleSearchClick}
                style={{ marginBottom: "15px", width: "100%" }}
              >
                Tìm kiếm
              </Button>

              <div style={styles.checkboxContainer}>
                <Checkbox
                  checked={showMyPosts}
                  onChange={handleMyPostsChange}
                  disabled={!userInfo?.userId}
                >
                  Bài viết của tôi
                </Checkbox>
              </div>

              <div>
                <h4 style={styles.filterTitle}>Danh mục</h4>
                <Select
                  value={filter.majorId || "all"}
                  onChange={handleCategoryChange}
                  style={{ width: "100%" }}
                >
                  <Option value="all">Tất cả</Option>
                  {majors.map((major) => (
                    <Option key={major.majorId} value={major.majorId}>
                      {major.majorName}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={24} md={16} lg={18}>
            <div>
              <div style={styles.sortSection}>
                <Button 
                  type="primary" 
                  onClick={() => navigate("/create-post")}
                >
                  Tạo bài viết mới
                </Button>
                <Select
                  value={sort}
                  onChange={handleSortChange}
                  style={{ width: "200px" }}
                >

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
                      onEdit={handleEdit}
                      onPostDeleted={fetchPosts}
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
          <Modal
        title="Chỉnh sửa bài viết"
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setEditModalVisible(false)}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          style={styles.modalForm}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <TextArea rows={6} />
          </Form.Item>

          <Form.Item
            name="majorId"
            label="Chuyên ngành"
            rules={[{ required: true, message: 'Vui lòng chọn chuyên ngành' }]}
          >
            <Select>
              {majors.map((major) => (
                <Option key={major.majorId} value={major.majorId}>
                  {major.majorName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
          >
            <Select>
              <Option value="Draft">Nháp</Option>
              <Option value="Published">Đã xuất bản</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="isPrivate"
            label="Quyền riêng tư"
          >
            <Select>
              <Option value={true}>Riêng tư</Option>
              <Option value={false}>Công khai</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </UserLayout>
  );
}

export default ListPostPage;
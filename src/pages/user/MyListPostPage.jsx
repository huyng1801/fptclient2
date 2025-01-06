import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Spin, Alert, Row, Col, Modal, Form, Input, Select, Button, message } from "antd";
import { PagingListItem } from "../../components/PagingListItem";
import { PostCard } from "../../components/PostSection/PostCard";
import PostService from "../../services/PostService";
import UserLayout from "../../layouts/UserLayout";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

function MyListPostPage() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form] = Form.useForm();
  
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
  const userId = userInfo?.userId;

  useEffect(() => {
    fetchPosts();
  }, [currentPage, userId]);

  const fetchPosts = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const pagingModel = {
        page: currentPage,
        size: itemsPerPage,
      };
      const filter = { authorId: userId };
      const response = await PostService.getAllPosts(filter, pagingModel, "dateDesc");
      setPosts(response.items);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError("Không thể tải bài viết của bạn. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleEdit = (post, e) => {
    e.preventDefault();
    setEditingPost(post);
    form.setFieldsValue({
      title: post.title,
      content: post.content,
      status: post.status,
      isPrivate: post.isPrivate
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

  const handlePostDeleted = () => {
    fetchPosts(); // Refresh the posts list after deletion
  };

  if (!userId) {
    return (
      <UserLayout>
        <Alert 
          message="Unauthorized" 
          description="Vui lòng đăng nhập để xem bài viết của bạn" 
          type="error" 
          showIcon 
        />
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-5xl mx-auto px-4">
        <Title level={2} className="mb-6">
          Bài viết của tôi
        </Title>

        {error && (
          <Alert 
            message={error} 
            type="error" 
            showIcon 
            className="mb-5" 
          />
        )}

        {loading ? (
          <div className="text-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <Row>
            <Col span={24}>
              {posts.length === 0 ? (
                <Alert
                  message="Không tìm thấy bài viết"
                  description="Bạn chưa tạo bài viết nào."
                  type="info"
                  showIcon
                />
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <PostCard
                      key={post.postId}
                      item={post}
                      onClick={() => handlePostClick(post.postId)}
                      onEdit={(e) => handleEdit(post, e)}
                      onPostDeleted={handlePostDeleted}
                    />
                  ))}
                </div>
              )}

              {posts.length > 0 && (
                <PagingListItem
                  handlePageChange={setCurrentPage}
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              )}
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
            className="mt-4"
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
      </div>
    </UserLayout>
  );
}

export default MyListPostPage;
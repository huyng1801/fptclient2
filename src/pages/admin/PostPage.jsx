import React, { useState, useEffect } from 'react';
import { Layout, Button, Modal, Form, Input, Select, Checkbox, message, Table } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import PostService from '../../services/PostService';

const { Content } = Layout;
const { Option } = Select;

const PostPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await PostService.getAllPosts({}, pagination);
      setPosts(response.items || []);
      setPagination(prev => ({ ...prev, total: response.total }));
    } catch (error) {
      message.error('Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [pagination.page, pagination.pageSize]);

  const openModal = (post = null) => {
    setEditingPost(post);
    if (post) {
      form.setFieldsValue({
        title: post.title,
        content: post.content,
        majorId: post.majorId,
        isPrivate: post.isPrivate,
        status: post.status
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSavePost = async () => {
    try {
      const values = await form.validateFields();
      const postData = {
        ...values,
        authorId: 1, // Replace with actual logged-in user ID
        status: 'ACTIVE'
      };

      if (editingPost) {
        await PostService.updatePost(editingPost.postId, postData);
        message.success('Cập nhật bài viết thành công');
      } else {
        await PostService.createPost(postData);
        message.success('Thêm bài viết thành công');
      }

      setIsModalOpen(false);
      setEditingPost(null);
      form.resetFields();
      fetchPosts();
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại');
    }
  };

  const handleDeletePost = (postId) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa bài viết này?',
      content: 'Hành động này không thể hoàn tác',
      onOk: async () => {
        try {
          await PostService.deletePost(postId);
          message.success('Xóa bài viết thành công');
          fetchPosts();
        } catch (error) {
          message.error('Không thể xóa bài viết');
        }
      }
    });
  };

  const handleTableChange = (pagination) => {
    setPagination({
      page: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total
    });
  };

  const columns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Nội dung', dataIndex: 'content', key: 'content', ellipsis: true },
    { title: 'Lượt xem', dataIndex: 'views', key: 'views' },
    { 
      title: 'Riêng tư', 
      dataIndex: 'isPrivate', 
      key: 'isPrivate',
      render: isPrivate => isPrivate ? 'Có' : 'Không'
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="default"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
            style={{ marginRight: 8 }}
          />
          {/* <Button
            type="default"
            shape="circle"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeletePost(record.postId)}
          /> */}
        </>
      ),
    },
  ];

  return (
    <AdminLayout headerName="Bài viết">
      <Content style={{ padding: '24px' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
          style={{ marginBottom: 16 }}
        >
          Thêm bài viết
        </Button>

        <Table
          columns={columns}
          dataSource={posts}
          rowKey="postId"
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total
          }}
        />

        <Modal
          title={editingPost ? 'Chỉnh sửa bài viết' : 'Thêm bài viết'}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={handleSavePost}
          okText={editingPost ? 'Cập nhật' : 'Thêm'}
          width={800}
          destroyOnClose
        >
          <Form form={form} layout="vertical">
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
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="majorId"
              label="Ngành"
              rules={[{ required: true, message: 'Vui lòng chọn ngành' }]}
            >
              <Select placeholder="Chọn ngành">
                <Option value={1}>Công nghệ thông tin</Option>
                <Option value={2}>Kinh tế</Option>
                <Option value={3}>Quản trị kinh doanh</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="isPrivate"
              valuePropName="checked"
            >
              <Checkbox>Riêng tư</Checkbox>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </AdminLayout>
  );
};

export default PostPage;
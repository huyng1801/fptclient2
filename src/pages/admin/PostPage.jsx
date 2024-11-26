import React, { useState } from 'react';
import { Layout, Form, Input, Button, Table, Modal, Select, Checkbox, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';

const { Content } = Layout;
const { Option } = Select;

const PostPage = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Bài viết đầu tiên',
      content: 'Đây là nội dung của bài viết đầu tiên.',
      majorId: 1,
      isPrivate: false,
      reportCount: 2, // Initial report count for demonstration
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form] = Form.useForm();

  // Mở modal để thêm hoặc chỉnh sửa bài viết
  const openModal = (post = null) => {
    setEditingPost(post);
    if (post) {
      form.setFieldsValue(post);
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Xử lý thêm hoặc cập nhật bài viết
  const handleSavePost = () => {
    form.validateFields().then((values) => {
      if (editingPost) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === editingPost.id ? { ...post, ...values } : post
          )
        );
        message.success('Cập nhật bài viết thành công');
      } else {
        setPosts((prevPosts) => [
          ...prevPosts,
          { ...values, id: prevPosts.length + 1, reportCount: 0 } // New post with reportCount 0
        ]);
        message.success('Thêm bài viết thành công');
      }
      setIsModalOpen(false);
      setEditingPost(null);
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  // Xác nhận xóa bài viết
  const handleDeletePost = (postId) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa bài viết này?',
      onOk: () => {
        setPosts(posts.filter((post) => post.id !== postId));
        message.success('Xóa bài viết thành công');
      }
    });
  };

  // Cấu hình cột cho bảng
  const columns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Nội dung', dataIndex: 'content', key: 'content' },
    { title: 'Mã ngành', dataIndex: 'majorId', key: 'majorId' },
    { title: 'Riêng tư', dataIndex: 'isPrivate', key: 'isPrivate', render: (isPrivate) => isPrivate ? 'Có' : 'Không' },
    { title: 'Số báo cáo', dataIndex: 'reportCount', key: 'reportCount' }, // New column for report count
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, post) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            icon={<EditOutlined />}
            onClick={() => openModal(post)}
            type="default"
            shape="circle"
            title="Chỉnh sửa"
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeletePost(post.id)}
            type="default"
            shape="circle"
            title="Xóa"
          />
        </div>
      )
    }
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
        <Table columns={columns} dataSource={posts} rowKey="id" />

        {/* Modal Thêm/Chỉnh sửa Bài viết */}
        <Modal
          title={editingPost ? 'Chỉnh sửa Bài viết' : 'Thêm Bài viết'}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={handleSavePost}
          okText={editingPost ? 'Cập nhật' : 'Thêm'}
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
            <Form.Item name="majorId" label="Mã ngành">
              <Select placeholder="Chọn Ngành">
                <Option value={1}>Khoa học Máy tính</Option>
                <Option value={2}>Kinh doanh</Option>
                <Option value={3}>Kỹ thuật</Option>
              </Select>
            </Form.Item>
            <Form.Item name="isPrivate" valuePropName="checked" label="Riêng tư">
              <Checkbox>Riêng tư</Checkbox>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </AdminLayout>
  );
};

export default PostPage;

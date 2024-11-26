import React, { useState, useEffect } from 'react';
import { Layout, Menu, List, Typography, Button, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import UserLayout from '../../layouts/UserLayout';
import postService from '../../services/PostService'; // Import your postService

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

// Sample categories (could be dynamic as well)
const categories = ['Công Nghệ', 'Sức Khỏe', 'Phong Cách Sống', 'Tài Chính', 'Giáo Dục'];

const HomePage = () => {
  const navigate = useNavigate(); // Initialize the navigation hook
  const [posts, setPosts] = useState([]); // State to hold posts
  const [loading, setLoading] = useState(true); // Loading state
  const [page, setPage] = useState(1); // Current page
  const [total, setTotal] = useState(0); // Total posts count
  const [filter, setFilter] = useState(''); // Filter term for search
  const [category, setCategory] = useState(''); // Selected category for filtering

  // Fetch posts from the API
  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Fetch posts using the postService
      const response = await postService.getAllPosts({
        filter,
        category,
        page,
        size: 5, // Specify the page size
      });
      // Assuming the response contains 'data' (posts) and 'total' (total post count)
      setPosts(response.items); // Set posts
      setTotal(response.total); // Set total posts count for pagination
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use effect to fetch posts when page, filter, or category changes
  useEffect(() => {
    fetchPosts();
  }, [page, filter, category]);

  // Handle search input change
  const handleSearch = (value) => {
    setFilter(value);
    setPage(1); // Reset to first page when search term changes
  };

  // Handle category filter change
  const handleCategoryChange = (category) => {
    setCategory(category);
    setPage(1); // Reset to first page when category changes
  };

  const handleCreatePostClick = () => {
    navigate('/create-post'); // Navigate to the CreatePostPage
  };

  return (
    <UserLayout>
      <Layout style={{ padding: '24px', background: '#f0f2f5' }}>
        <Sider width={220} className="site-layout-background" style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
          <Title level={4} style={{ color: '#000', marginBottom: '16px' }}>Danh Mục</Title>
          <Menu
            mode="inline"
            selectedKeys={[category]} // Highlight selected category
            style={{ borderRight: 0 }}
          >
            {categories.map((cat, index) => (
              <Menu.Item key={cat} onClick={() => handleCategoryChange(cat)} style={{ fontSize: '16px' }}>
                {cat}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content style={{ padding: '24px', minHeight: 280, background: '#fff', borderRadius: '8px' }}>
            <Title level={3} style={{ color: '#1890ff', marginBottom: '20px' }}>Bài Viết Mới Nhất</Title>

            {/* Search Bar */}
            <Search
              placeholder="Tìm kiếm bài viết"
              onSearch={handleSearch}
              enterButton
              style={{ marginBottom: '20px', maxWidth: '300px' }}
            />

            {/* Button to navigate to the Create Post page */}
            <Button
              type="primary"
              onClick={handleCreatePostClick}
              style={{ marginBottom: '20px' }}
            >
              Tạo Bài Viết Mới
            </Button>

            {/* List of Posts */}
            <List
              itemLayout="vertical"
              size="large"
              loading={loading}
              pagination={{
                current: page,
                pageSize: 5,
                total: total,
                onChange: (page) => setPage(page),
              }}
              dataSource={posts}
              renderItem={post => (
                <List.Item
                  key={post.id}
                  style={{ padding: '16px', border: '1px solid #f0f0f0', borderRadius: '8px', marginBottom: '16px' }}
                  extra={<img width={180} alt="ảnh bìa bài viết" src={post.imageUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/FPT_logo_2010.svg/1200px-FPT_logo_2010.svg.png"} style={{ borderRadius: '8px' }} />}
                >
                  <List.Item.Meta
                    title={<Link to={`/post/${post.postId}`} style={{ fontSize: '18px', color: '#1890ff' }}>{post.title}</Link>}
                    description={<Text style={{ color: '#595959' }}>{post.content}</Text>}
                  />
                </List.Item>
              )}
            />
          </Content>
        </Layout>
      </Layout>
    </UserLayout>
  );
};

export default HomePage;

import React, { useState, useEffect } from "react";
import { Card, Typography, Tag, Avatar, Space, Tooltip, Modal, Button, message } from "antd";
import { 
  EyeOutlined, 
  FieldTimeOutlined, 
  UserOutlined,
  BookOutlined,
  LockOutlined,
  UnlockOutlined,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import { format } from 'date-fns';
import PostService from "../../services/PostService";
import UserService from "../../services/UserService";

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

export const PostCard = ({ item, onClick, onPostDeleted, onEdit }) => {
  const [author, setAuthor] = useState(null);
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
  const isAuthor = userInfo?.userId === item.authorId;

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        if (item.authorId) {
          const authorData = await UserService.getUser(item.authorId);
          setAuthor(authorData);
        }
      } catch (error) {
        console.error('Error fetching author:', error);
      }
    };

    fetchAuthor();
  }, [item.authorId]);

  const handleDelete = async (e) => {
    e.stopPropagation();
    confirm({
      title: 'Xác nhận xóa bài viết',
      content: 'Bạn có chắc chắn muốn xóa bài viết này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          await PostService.deletePost(item.postId);
          message.success('Xóa bài viết thành công');
          if (onPostDeleted) {
            onPostDeleted();
          }
        } catch (error) {
          message.error('Không thể xóa bài viết. Vui lòng thử lại sau.');
        }
      },
    });
  };

  return (
    <Card
      className="rounded-xl shadow-md border border-gray-200 mb-5 hover:shadow-lg transition-shadow"
      bodyStyle={{ padding: "24px" }}
      hoverable
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-4">
        <Avatar 
          size={48} 
          icon={<UserOutlined />}
          src={author?.profilePicture}
        >
          {author?.firstName?.charAt(0)}
        </Avatar>
        <div className="flex-1">
          <Text strong>
            {author ? `${author.firstName} ${author.lastName}` : "Đang tải..."}
          </Text>
          <br />
          <Text type="secondary" className="text-sm">
          {format(new Date(item.createdAt), 'dd/MM/yyyy')}
          </Text>
        </div>
      
      </div>

      <Title level={4} className="mb-3 line-clamp-2">
        {item.title}
      </Title>

      <Paragraph className="text-gray-600 mb-4" ellipsis={{ rows: 3 }}>
        {item.content}
      </Paragraph>

      <Space className="mb-4">
        <Tag color="blue">
          <BookOutlined /> {item.majorName}
        </Tag>
        <Tag color={item.status === 'Published' ? 'green' : 'orange'}>
          {item.status}
        </Tag>
        <Tooltip title={item.isPrivate ? "Private post" : "Public post"}>
          <Tag color={item.isPrivate ? 'red' : 'cyan'}>
            {item.isPrivate ? <LockOutlined /> : <UnlockOutlined />}
          </Tag>
        </Tooltip>
        
      </Space>

      {isAuthor && (
          <Space>
            <Button
              icon={<EditOutlined />}
              className="flex items-center gap-1 text-blue-500 bg-blue-50"
              onClick={(e) => onEdit(item, e)}
            >
              Sửa
            </Button>
            {/* <Button
              icon={<DeleteOutlined />}
              className="flex items-center gap-1 text-red-500 bg-red-50"
              onClick={handleDelete}
              danger
            >
              Xóa
            </Button> */}
          </Space>
        )}
{/* 
      <div className="border-t border-gray-100 pt-4 mt-4">
        <Space className="justify-between w-full">
          <Tooltip title="Views">
            <span className="flex items-center gap-2 text-gray-600">
              <EyeOutlined className="text-blue-500" />
              {item.views}
            </span>
          </Tooltip>
          <Tooltip title="Posted">
            <span className="flex items-center gap-2 text-gray-600">
              <FieldTimeOutlined className="text-green-500" />
              {format(new Date(item.createdAt), 'dd/MM/yyyy')}
            </span>
          </Tooltip>
        </Space>
      </div> */}
    </Card>
  );
};

export default PostCard;
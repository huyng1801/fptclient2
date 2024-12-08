import React from 'react';
import { Card, Avatar, Typography } from 'antd';
import { AccessTime } from '@mui/icons-material';
import { format } from 'date-fns';

const { Text } = Typography;

const ReplyList = ({ replies }) => {
  // Sort replies by creation date (newest first)
  const sortedReplies = [...replies].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div style={{ marginTop: '16px' }}>
      {sortedReplies.map((reply) => (
        <Card 
          key={reply.commentId} 
          style={{
            marginBottom: '12px',
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <Avatar 
              size={32} 
              style={{ 
                marginRight: '12px', 
                backgroundColor: '#1890ff', 
                color: '#fff' 
              }}
            >
              {reply.authorId?.toString()?.charAt(0)}
            </Avatar>
            <div>
              <Text strong>User {reply.authorId}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                <AccessTime style={{ fontSize: 12 }} />{' '}
                {format(new Date(reply.createdAt), 'dd/MM/yyyy')}
              </Text>
            </div>
          </div>
          <div style={{ marginTop: '8px', paddingLeft: '40px' }}>
            {reply.content}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ReplyList;

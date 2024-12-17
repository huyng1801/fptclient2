import React from 'react';
import { Alert, Progress, Typography } from 'antd';
import { MailOutlined } from '@ant-design/icons';

const { Text } = Typography;

const styles = {
  container: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)', // Centers the div
    zIndex: 1000,
    padding: '16px',
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '16px',
    borderRadius: '8px',
    maxWidth: '500px',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textAlign: 'center',
  },
  icon: {
    fontSize: '20px',
    color: '#1890ff',
  },
  progress: {
    width: '200px',
  },
  message: {
    margin: 0,
    color: '#262626',
  },
};

const EmailVerificationStatus = ({ emailVerified }) => {
  if (emailVerified) {
    return null; // Do not render if verified
  }

  return (
    <div style={styles.container}>
      <Alert
        message={
          <div style={styles.content}>
            <MailOutlined style={styles.icon} />
            <Text style={styles.message}>
              Tài khoản của bạn đang chờ phê duyệt
            </Text>
          </div>
        }
        description="Thời gian phê duyệt tối đa 24 giờ..."
        type="warning"
        showIcon={false}
      />
      <Progress
        percent={50}
        status="active"
        style={styles.progress}
        strokeColor={{
          '0%': '#ffd666',
          '100%': '#ffa940',
        }}
      />
    </div>
  );
};

export default EmailVerificationStatus;

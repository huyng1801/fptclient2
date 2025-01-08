import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Typography, Input, Checkbox, Button, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { handleGoogleLogin, handleEmailPasswordLogin } from '../../services/AuthService';

const { Title, Text } = Typography;

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f0f2f5',
    display: 'flex',
    alignItems: 'stretch',
  },
  content: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    display: 'flex',
    width: '100%',
    minHeight: '100vh', // Account for padding
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    overflow: 'hidden',
  },
  leftSection: {
    flex: '1 1 50%',
    background: 'linear-gradient(135deg, #1890ff, #096dd9)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '48px',
    position: 'relative',
  },
  rightSection: {
    flex: '1 1 50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '48px',
    background: '#fff',
  },
  loginImage: {
    width: '100%',
    maxWidth: '440px',
    height: 'auto',
    objectFit: 'contain',
  },
  form: {
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
  },
  title: {
    fontSize: '28px',
    textAlign: 'center',
    marginBottom: '32px',
    color: '#262626',
  },
  highlight: {
    color: '#F05123',
    fontWeight: 'bold',
  },
  input: {
    height: '45px',
    marginBottom: '16px',
  },
  googleButton: {
    width: '100%',
    height: '45px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '24px',
    border: '1px solid #d9d9d9',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#e8e8e8',
  },
  dividerText: {
    padding: '0 16px',
    color: '#8c8c8c',
    fontWeight: 500,
  },
  rememberForgot: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  loginButton: {
    width: '100%',
    height: '45px',
    fontSize: '16px',
    background: '#F05123',
    borderColor: '#F05123',
    fontWeight: 500,
    '&:hover': {
      background: '#ffb300',
      borderColor: '#ffb300',
    },
  },
  footer: {
    textAlign: 'center',
    marginTop: '32px',
  },
  link: {
    color: '#1890ff',
    cursor: 'pointer',
    marginLeft: '8px',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  welcomeText: {
    color: '#fff',
    fontSize: '20px',
    textAlign: 'center',
    marginTop: '24px',
    maxWidth: '80%',
  },
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await handleGoogleLogin(credentialResponse.credential);
      if (response.accessToken) {
        sessionStorage.setItem('accessToken', response.accessToken);
        sessionStorage.setItem('userInfo', JSON.stringify(response.userInfo));
        message.success('Đăng nhập thành công!');
        navigate('/');
      }
    } catch (err) {
      message.error('Đăng nhập bằng Google thất bại');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      message.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const response = await handleEmailPasswordLogin(email, password);
      if (response.userInfo.email) {
        const userInfo = response.userInfo;
        sessionStorage.setItem('accessToken', response.accessToken);
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        message.success('Đăng nhập thành công!');
        if (userInfo.roleName === "Admin") {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      message.error('Email hoặc mật khẩu không chính xác!');
    }
  };

  return (
    <Layout style={styles.container}>
      <Layout.Content style={styles.content}>
        <div style={styles.card}>
          <div style={styles.leftSection}>
            <img
              src="/assets/images/login-thumb.png"
              alt="Login"
              style={styles.loginImage}
            />
            <Text style={styles.welcomeText}>
              Kết nối với hơn 50,000 cựu sinh viên FPT trên toàn cầu
            </Text>
          </div>
          
          <div style={styles.rightSection}>
            <div style={styles.form}>
              <Title level={2} style={styles.title}>
                Chào mừng đến với <span style={styles.highlight}>Alumni Connect</span>
              </Title>

              <Button 
                icon={<GoogleOutlined />}
                style={styles.googleButton}
                onClick={() => handleGoogleSuccess({ credential: 'dummy' })}
              >
                Đăng nhập bằng Google
              </Button>

              <div style={styles.divider}>
                <div style={styles.dividerLine} />
                <Text style={styles.dividerText}>HOẶC</Text>
                <div style={styles.dividerLine} />
              </div>

              <Input
                size="large"
                placeholder="Email"
                prefix={<UserOutlined />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />

              <Input.Password
                size="large"
                placeholder="Mật khẩu"
                prefix={<LockOutlined />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />

              <div style={styles.rememberForgot}>
                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                <Text style={styles.link}>Quên mật khẩu?</Text>
              </div>

              <Button 
                type="primary"
                style={styles.loginButton}
                onClick={handleSubmit}
              >
                Đăng nhập
              </Button>

              <div style={styles.footer}>
                <Text>Chưa có tài khoản?</Text>
                <Text 
                  style={styles.link}
                  onClick={() => navigate('/register')}
                >
                  Đăng ký ngay
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default LoginPage;
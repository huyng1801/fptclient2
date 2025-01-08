import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Typography, Input, Select, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { handleUserRegistration } from '../../services/AuthService';
import MajorCodeService from '../../services/MajorCodeService';

const { Title, Text } = Typography;
const { Option } = Select;

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
    minHeight: '100vh',
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
  },
  rightSection: {
    flex: '1 1 50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '48px',
    background: '#fff',
  },
  registerImage: {
    width: '100%',
    maxWidth: '440px',
    height: 'auto',
    objectFit: 'contain',
    marginBottom: '32px',
  },
  welcomeText: {
    color: '#fff',
    fontSize: '24px',
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 1.5,
  },
  form: {
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
  },
  title: {
    fontSize: '28px',
    textAlign: 'center',
    marginBottom: '24px',
    color: '#262626',
  },
  highlight: {
    color: '#F05123',
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  input: {
    height: '40px',
  },
  select: {
    width: '100%',
    height: '45px',
  },
  registerButton: {
    width: '100%',
    height: '45px',
    fontSize: '16px',
    background: '#F05123',
    borderColor: '#F05123',
    marginTop: '24px',
    '&:hover': {
      background: '#ffb300',
      borderColor: '#ffb300',
    },
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
  },
  link: {
    color: '#1890ff',
    cursor: 'pointer',
    marginLeft: '8px',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
};

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [major, setMajor] = useState('');
  const [role, setRole] = useState('');
  const [majors, setMajors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await MajorCodeService.getAllMajorCodes();
        setMajors(response.items);
      } catch (err) {
        message.error('Không thể tải danh sách ngành học');
      }
    };
    fetchMajors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !major || !role) {
      message.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    try {
      const response = await handleUserRegistration(firstName, lastName, email, password, code);
      if (response?.message) {
        message.success('Đăng ký thành công! Đang chuyển hướng...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      message.error('Đăng ký thất bại. Vui lòng thử lại!');
    }
  };

  return (
    <Layout style={styles.container}>
      <Layout.Content style={styles.content}>
        <div style={styles.card}>
          <div style={styles.leftSection}>
            <img
              src="/assets/images/login-thumb.png"
              alt="Register"
              style={styles.registerImage}
            />
            <Text style={styles.welcomeText}>
              Tham gia cộng đồng cựu sinh viên FPT để mở rộng mạng lưới và cơ hội nghề nghiệp
            </Text>
          </div>

          <div style={styles.rightSection}>
            <div style={styles.form}>
              <Title level={2} style={styles.title}>
                Đăng ký tài khoản <span style={styles.highlight}>Alumni Connect</span>
              </Title>

              <div style={styles.inputGroup}>
                <Input
                  size="large"
                  placeholder="Họ"
                  prefix={<UserOutlined />}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <Input
                  size="large"
                  placeholder="Tên"
                  prefix={<UserOutlined />}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <Input
                  size="large"
                  placeholder="Email"
                  prefix={<MailOutlined />}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <Input.Password
                  size="large"
                  placeholder="Mật khẩu"
                  prefix={<LockOutlined />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <Input
                  size="large"
                  placeholder="Mã giới thiệu (không bắt buộc)"
                  prefix={<IdcardOutlined />}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <Select
                  size="large"
                  placeholder="Chọn ngành học"
                  value={major}
                  onChange={setMajor}
                  style={styles.select}
                >
                  {majors.map((major) => (
                    <Option key={major.majorId} value={major.majorId}>
                      {major.majorName}
                    </Option>
                  ))}
                </Select>
              </div>

              <div style={styles.inputGroup}>
                <Select
                  size="large"
                  placeholder="Chọn vai trò"
                  value={role}
                  onChange={setRole}
                  style={styles.select}
                >
                  <Option value={1}>Cựu sinh viên</Option>
                  <Option value={2}>Sinh viên</Option>
                  <Option value={3}>Nhà tuyển dụng</Option>
                </Select>
              </div>

              <Button
                type="primary"
                size="large"
                onClick={handleSubmit}
                style={styles.registerButton}
              >
                Đăng ký
              </Button>

              <div style={styles.footer}>
                <Text>Đã có tài khoản?</Text>
                <Text
                  style={styles.link}
                  onClick={() => navigate('/login')}
                >
                  Đăng nhập
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default RegisterPage;
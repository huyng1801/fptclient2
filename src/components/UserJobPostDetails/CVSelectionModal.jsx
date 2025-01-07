import React, { useState, useEffect } from 'react';
import { Modal, List, Card, Button, Spin, Empty, Typography, Tag, Space, Divider } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined, CalendarOutlined, DollarOutlined, GlobalOutlined, BankOutlined, TeamOutlined } from '@ant-design/icons';
import { format, parseISO } from 'date-fns';
import CVService from '../../services/CVService';

const { Text, Title } = Typography;

const styles = {
  card: {
    marginBottom: '16px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    color: '#1890ff',
  },
  tags: {
    marginTop: '8px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    padding: '16px',
    background: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  icon: {
    fontSize: '16px',
    width: '16px',
  },
  duties: {
    padding: '16px',
    background: '#fff',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  timeline: {
    borderTop: '1px solid #f0f0f0',
    paddingTop: '16px',
    marginTop: '16px',
    color: '#8c8c8c',
  },
  selectButton: {
    marginTop: '16px',
    width: '100%',
    height: '40px',
    fontSize: '16px',
    borderRadius: '8px',
  },
};

const CVSelectionModal = ({ visible, onSelect, onCancel }) => {
  const [cvList, setCVList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        setLoading(true);
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        if (userInfo?.userId) {
          const response = await CVService.getCVByUserId(userInfo.userId);
          setCVList(Array.isArray(response.data) ? response.data : [response.data]);
        }
      } catch (error) {
        console.error('Error fetching CVs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchCVs();
    }
  }, [visible]);

  const renderCVInfo = (cv) => (
    <div>
      <div style={styles.header}>
        <div>
          <Title level={4} style={styles.title}>{cv.fullName}</Title>
          <div style={styles.tags}>
            <Space size={[0, 8]} wrap>
              <Tag color="blue" icon={<TeamOutlined />}>{cv.jobLevel}</Tag>
              <Tag color="cyan" icon={<BankOutlined />}>{cv.company}</Tag>
              <Tag color="green" icon={<DollarOutlined />}>
                {cv.minSalary} - {cv.maxSalary} USD
              </Tag>
            </Space>
          </div>
        </div>
      </div>

      <div style={styles.infoGrid}>
        <div style={styles.infoItem}>
          <MailOutlined style={{ ...styles.icon, color: '#1890ff' }} />
          <Text>{cv.email}</Text>
        </div>
        <div style={styles.infoItem}>
          <PhoneOutlined style={{ ...styles.icon, color: '#52c41a' }} />
          <Text>{cv.phone}</Text>
        </div>
        <div style={styles.infoItem}>
          <HomeOutlined style={{ ...styles.icon, color: '#fa8c16' }} />
          <Text>{cv.address}, {cv.city}</Text>
        </div>
        <div style={styles.infoItem}>
          <CalendarOutlined style={{ ...styles.icon, color: '#722ed1' }} />
          <Text>Ngày sinh: {format(parseISO(cv.birthday), 'dd/MM/yyyy')}</Text>
        </div>
        <div style={styles.infoItem}>
          <GlobalOutlined style={{ ...styles.icon, color: '#13c2c2' }} />
          <Text>{cv.language} - {cv.languageLevel}</Text>
        </div>
      </div>

      <div style={styles.duties}>
        <Title level={5}>Nhiệm vụ chính</Title>
        <Text>{cv.primaryDuties}</Text>
      </div>

      <div style={styles.timeline}>
        <CalendarOutlined /> Thời gian làm việc: {format(parseISO(cv.startAt), 'dd/MM/yyyy')} - 
        {cv.endAt ? format(parseISO(cv.endAt), 'dd/MM/yyyy') : 'Hiện tại'}
      </div>

      <Button 
        type="primary" 
        onClick={() => onSelect(cv)} 
        style={styles.selectButton}
      >
        Chọn CV này
      </Button>
    </div>
  );

  return (
    <Modal
      title={<Title level={3}>Chọn CV của bạn</Title>}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      ) : cvList.length > 0 ? (
        <List
          dataSource={cvList}
          renderItem={(cv) => (
            <Card style={styles.card}>
              {renderCVInfo(cv)}
            </Card>
          )}
        />
      ) : (
        <Empty
          description={
            <Text>
              Bạn chưa có CV nào. Vui lòng tạo CV trước khi ứng tuyển.
            </Text>
          }
          style={{ margin: '40px 0' }}
        >
          <Button type="primary" href="/cv/" size="large">
            Tạo CV mới
          </Button>
        </Empty>
      )}
    </Modal>
  );
};

export default CVSelectionModal;
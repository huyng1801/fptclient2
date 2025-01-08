import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Typography, 
  Table, 
  Card, 
  Space, 
  Button, 
  Modal,
  Descriptions,
  notification,
  Tooltip,
  Radio
} from 'antd';
import { StarOutlined } from '@ant-design/icons';
import UserLayout from '../../layouts/UserLayout';
import JobApplicationService from '../../services/JobApplicationService';
import CVService from '../../services/CVService';
import PhoBertService from '../../services/PhoBertService';

const { Title } = Typography;

const UserJobApplicationPage = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCV, setSelectedCV] = useState(null);
  const [cvModalVisible, setCvModalVisible] = useState(false);
  const [bestMatchCVs, setBestMatchCVs] = useState([]);
  const [findingBestMatch, setFindingBestMatch] = useState(false);
  const [viewMode, setViewMode] = useState('ALL');

  useEffect(() => {
    if (viewMode === 'ALL') {
      fetchApplications();
    } else {
      findBestMatchingCV();
    }
  }, [jobId, viewMode]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await JobApplicationService.viewAllJobApplications({ jobPostId: jobId });
      const applicationsWithCV = await Promise.all(
        response.data.items.map(async (app) => {
          try {
            const cvResponse = await CVService.getCVById(app.cvid);
            return { ...app, cv: cvResponse.data };
          } catch (error) {
            return { ...app, cv: null };
          }
        })
      );
      setApplications(applicationsWithCV);
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải danh sách ứng viên',
      });
    } finally {
      setLoading(false);
    }
  };

  const findBestMatchingCV = async () => {
    try {
      setLoading(true);
      setFindingBestMatch(true);
      const bestMatches = await PhoBertService.findBestMatchingCV(jobId);
      console.log(bestMatchCVs);
      setBestMatchCVs(bestMatches);
      setApplications(bestMatches.map(cv => ({ cv })));
    } catch (error) {
      console.error('Error finding best matching CV:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tìm CV phù hợp',
      });
    } finally {
      setLoading(false);
      setFindingBestMatch(false);
    }
  };

  const handleViewCV = (cv) => {
    setSelectedCV(cv);
    setCvModalVisible(true);
  };

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: ['cv', 'fullName'],
      key: 'fullName',
      render: (text, record) => (
        <Space>
          {record.cv?.fullName || 'N/A'}
          {viewMode === 'BEST_MATCH' && (
            <Tooltip title="CV phù hợp nhất">
              <StarOutlined style={{ color: '#faad14' }} />
            </Tooltip>
          )}
        </Space>
      ),
      sorter: (a, b) => (a.cv?.fullName || '').localeCompare(b.cv?.fullName || ''),
    },
    {
      title: 'Email',
      dataIndex: ['cv', 'email'],
      key: 'email',
      render: (_, record) => record.cv?.email || 'N/A',
    },
    {
      title: 'Số điện thoại',
      dataIndex: ['cv', 'phone'],
      key: 'phone',
      render: (_, record) => record.cv?.phone || 'N/A',
    },
    {
      title: 'Kinh nghiệm',
      key: 'experience',
      render: (_, record) => record.cv?.jobLevel || 'N/A',
      sorter: (a, b) => (a.cv?.jobLevel || '').localeCompare(b.cv?.jobLevel || ''),
    },
    {
      title: 'Mức lương mong muốn',
      key: 'salary',
      render: (_, record) => (
        record.cv ? `$${record.cv.minSalary} - $${record.cv.maxSalary}` : 'N/A'
      ),
      sorter: (a, b) => (a.cv?.minSalary || 0) - (b.cv?.minSalary || 0),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.cv && (
            <Button 
              type="primary" 
              onClick={() => handleViewCV(record.cv)}
            >
              Xem CV
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <UserLayout>
      <div style={{ padding: '24px' }}>
        <Title level={2}>Danh sách ứng viên</Title>

        <Card style={{ marginBottom: '24px' }}>
          <Space style={{ marginBottom: '16px' }}>
            <Radio.Group 
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              optionType="button"
              buttonStyle="solid"
            >
              <Radio.Button value="ALL">CV Ứng tuyển</Radio.Button>
              <Radio.Button value="BEST_MATCH">Ứng viên tìm năng</Radio.Button>
            </Radio.Group>
          </Space>

          <Table
            columns={columns}
            dataSource={applications}
            rowKey={(record) => record.cv?.id || record.applicationId}
            loading={loading || findingBestMatch}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} ứng viên`
            }}
          />
        </Card>

        <Modal
          title="Thông tin CV"
          open={cvModalVisible}
          onCancel={() => setCvModalVisible(false)}
          width={800}
          footer={null}
        >
          {selectedCV && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Họ và tên">{selectedCV.fullName}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedCV.email}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{selectedCV.phone}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">{selectedCV.address}</Descriptions.Item>
              <Descriptions.Item label="Thành phố">{selectedCV.city}</Descriptions.Item>
              <Descriptions.Item label="Công ty">{selectedCV.company}</Descriptions.Item>
              <Descriptions.Item label="Vị trí">{selectedCV.jobLevel}</Descriptions.Item>
              <Descriptions.Item label="Nhiệm vụ chính">{selectedCV.primaryDuties}</Descriptions.Item>
              <Descriptions.Item label="Ngôn ngữ">{selectedCV.language} - {selectedCV.languageLevel}</Descriptions.Item>
              <Descriptions.Item label="Mức lương mong muốn">
                ${selectedCV.minSalary} - ${selectedCV.maxSalary}
                {selectedCV.isDeal && ' (Có thể thương lượng)'}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian làm việc">
                {new Date(selectedCV.startAt).toLocaleDateString('vi-VN')} - 
                {selectedCV.endAt ? new Date(selectedCV.endAt).toLocaleDateString('vi-VN') : 'Hiện tại'}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </div>
    </UserLayout>
  );
};

export default UserJobApplicationPage;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Table, 
  Card, 
  Space, 
  Tag, 
  Button, 
  Select,
  Input,
  Modal,
  Descriptions,
  notification 
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import UserLayout from '../../layouts/UserLayout';
import JobApplicationService from '../../services/JobApplicationService';
import CVService from '../../services/CVService';

const { Title } = Typography;
const { Option } = Select;

const UserJobApplicationPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCV, setSelectedCV] = useState(null);
  const [cvModalVisible, setCvModalVisible] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      const response = await JobApplicationService.viewAllJobApplications({ jobPostId: jobId });
      const applicationsWithCV = await Promise.all(
        response.data.items.map(async (app) => {
          try {
            const cvResponse = await CVService.getCVById(app.cvid);
            return { ...app, cv: cvResponse.data };
          } catch (error) {
            console.error(`Error fetching CV ${app.cvid}:`, error);
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

  const handleViewCV = (cv) => {
    setSelectedCV(cv);
    setCvModalVisible(true);
  };

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: ['cv', 'fullName'],
      key: 'fullName',
      render: (text, record) => record.cv?.fullName || 'N/A',
    },
    {
      title: 'Email',
      dataIndex: ['cv', 'email'],
      key: 'email',
      render: (text, record) => record.cv?.email || 'N/A',
    },
    {
      title: 'Số điện thoại',
      dataIndex: ['cv', 'phone'],
      key: 'phone',
      render: (text, record) => record.cv?.phone || 'N/A',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'PENDING' ? 'gold' :
          status === 'APPROVED' ? 'green' :
          status === 'REJECTED' ? 'red' : 'default'
        }>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Thư xin việc',
      dataIndex: 'letterCover',
      key: 'letterCover',
      render: (text) => text?.substring(0, 50) + (text?.length > 50 ? '...' : '') || 'N/A',
    },
    {
      title: 'Ngày ứng tuyển',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
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

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.cv && (
      app.cv.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      app.cv.email?.toLowerCase().includes(searchText.toLowerCase())
    );
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return (!searchText || matchesSearch) && matchesStatus;
  });

  return (
    <UserLayout>
      <div style={{ padding: '24px' }}>
        <Title level={2}>Danh sách ứng viên</Title>

        <Card style={{ marginBottom: '24px' }}>
          <Space style={{ marginBottom: '16px' }}>
            <Input
              placeholder="Tìm kiếm theo tên hoặc email"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
            >
              <Option value="ALL">Tất cả trạng thái</Option>
              <Option value="PENDING">Đang chờ</Option>
              <Option value="APPROVED">Đã duyệt</Option>
              <Option value="REJECTED">Từ chối</Option>
            </Select>
          </Space>

          <Table
            columns={columns}
            dataSource={filteredApplications}
            rowKey="applicationId"
            loading={loading}
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
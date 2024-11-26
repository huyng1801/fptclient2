import React, { useState, useEffect } from 'react';
import { Layout, Table, Button, Modal, message } from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
const { Header, Content, Sider } = Layout;

const JobApplicationPage = () => {
  const [jobApplications, setJobApplications] = useState([]);
  const [isCvModalVisible, setIsCvModalVisible] = useState(false);
  const [cvDetails, setCvDetails] = useState(null);

  // Mock data for job applications
  const mockJobApplications = [
    {
      ApplicationId: 1,
      JobPost: { Title: 'Lập Trình Viên Phần Mềm' },
      Cv: { FullName: 'John Doe' },
      Status: 'Đang Xử Lý',
      CreatedAt: '2024-10-10T14:48:00.000Z',
      Cvid: 1
    },
    {
      ApplicationId: 2,
      JobPost: { Title: 'Quản Lý Sản Phẩm' },
      Cv: { FullName: 'Jane Smith' },
      Status: 'Đã Xem',
      CreatedAt: '2024-10-12T09:30:00.000Z',
      Cvid: 2
    }
  ];

  // Mock data for CV details
  const mockCvDetails = {
    1: {
      FullName: 'John Doe',
      Email: 'john.doe@example.com',
      Phone: '+1234567890',
      Address: '123 Main St, Springfield',
      Company: 'ABC Corp',
      PrimaryDuties: 'Phát triển phần mềm, quản lý nhóm',
      JobLevel: 'Trung Cấp',
      Language: 'Tiếng Anh',
      LanguageLevel: 'Lưu Loát',
      MinSalary: 50000,
      MaxSalary: 70000,
      StartAt: '2024-01-01',
      EndAt: '2024-12-31'
    },
    2: {
      FullName: 'Jane Smith',
      Email: 'jane.smith@example.com',
      Phone: '+0987654321',
      Address: '456 Elm St, Shelbyville',
      Company: 'XYZ Ltd.',
      PrimaryDuties: 'Chiến lược sản phẩm, nghiên cứu thị trường',
      JobLevel: 'Cao Cấp',
      Language: 'Tiếng Anh',
      LanguageLevel: 'Lưu Loát',
      MinSalary: 60000,
      MaxSalary: 80000,
      StartAt: '2023-06-01',
      EndAt: '2023-12-31'
    }
  };

  useEffect(() => {
    // Simulate fetching job applications
    setJobApplications(mockJobApplications);
  }, []);

  // Handle the click event to show CV
  const handleShowCv = (userId) => {
    const cv = mockCvDetails[userId];
    if (cv) {
      setCvDetails(cv);
      setIsCvModalVisible(true);
    } else {
      message.error('Không tìm thấy chi tiết CV');
    }
  };

  // Job Application table columns
  const columns = [
    { 
      title: 'Vị Trí Công Việc', 
      dataIndex: 'JobPost.Title', 
      key: 'JobPost.Title', 
      render: (text) => <span>{text}</span>
    },
    { 
      title: 'Ứng Viên', 
      dataIndex: 'Cv.FullName', 
      key: 'Cv.FullName', 
      render: (text) => <span>{text}</span>
    },
    { 
      title: 'Trạng Thái', 
      dataIndex: 'Status', 
      key: 'Status', 
      render: (text) => <span>{text}</span>
    },
    { 
      title: 'Ngày Nộp Đơn', 
      dataIndex: 'CreatedAt', 
      key: 'CreatedAt',
      render: (text) => <span>{new Date(text).toLocaleDateString()}</span>
    },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <Button
          icon={<FileSearchOutlined />}
          onClick={() => handleShowCv(record.Cvid)}
            type="default"
            shape="circle"
        >
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout headerName="Hồ sơ ứng tuyển">
      <Layout.Content style={{ padding: '24px' }}>
        <Table
          columns={columns}
          dataSource={jobApplications}
          rowKey="ApplicationId"
          pagination={false}
        />

        {/* Modal for displaying CV details */}
        <Modal
          title="Chi Tiết CV"
          visible={isCvModalVisible}
          onCancel={() => setIsCvModalVisible(false)}
          footer={null}
          destroyOnClose
        >
          {cvDetails ? (
            <div>
              <h3>{cvDetails.FullName}</h3>
              <p><strong>Email:</strong> {cvDetails.Email}</p>
              <p><strong>Số Điện Thoại:</strong> {cvDetails.Phone}</p>
              <p><strong>Địa Chỉ:</strong> {cvDetails.Address}</p>
              <p><strong>Công Ty:</strong> {cvDetails.Company}</p>
              <p><strong>Nhiệm Vụ Chính:</strong> {cvDetails.PrimaryDuties}</p>
              <p><strong>Cấp Bậc Công Việc:</strong> {cvDetails.JobLevel}</p>
              <p><strong>Ngôn Ngữ:</strong> {cvDetails.Language} ({cvDetails.LanguageLevel})</p>
              <p><strong>Mức Lương Mong Muốn:</strong> {cvDetails.MinSalary} - {cvDetails.MaxSalary}</p>
              <p><strong>Ngày Bắt Đầu:</strong> {cvDetails.StartAt ? new Date(cvDetails.StartAt).toLocaleDateString() : '-'}</p>
              <p><strong>Ngày Kết Thúc:</strong> {cvDetails.EndAt ? new Date(cvDetails.EndAt).toLocaleDateString() : '-'}</p>
            </div>
          ) : (
            <p>Đang tải chi tiết CV...</p>
          )}
        </Modal>
      </Layout.Content>
    </AdminLayout>
  );
};

export default JobApplicationPage;

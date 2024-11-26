import React from 'react';
import { Layout, Card, Col, Row, Table } from 'antd';
import { Line } from '@ant-design/plots'; // Giả sử @ant-design/plots hoặc thư viện biểu đồ khác đã được cài đặt
import AdminLayout from '../../layouts/AdminLayout';

// Dữ liệu mẫu cho thẻ, biểu đồ và bảng
const cardData = [
  { title: 'Tổng số người dùng', count: 1200 },
  { title: 'Yêu cầu mới', count: 75 },
  { title: 'Số hướng dẫn được duyệt', count: 430 },
  { title: 'Đánh giá đang chờ', count: 25 },
];

const chartData = [
  { month: 'Tháng 1', value: 30 },
  { month: 'Tháng 2', value: 45 },
  { month: 'Tháng 3', value: 60 },
  { month: 'Tháng 4', value: 80 },
  { month: 'Tháng 5', value: 95 },
  { month: 'Tháng 6', value: 100 },
  // Thêm dữ liệu khác
];

const tableData = [
  {
    key: '1',
    name: 'Nguyễn Văn A',
    type: 'Hướng nghiệp',
    status: 'Đang chờ',
  },
  {
    key: '2',
    name: 'Trần Thị B',
    type: 'Giúp đỡ học thuật',
    status: 'Đã phê duyệt',
  },
  // Thêm dữ liệu bảng
];

const columns = [
  {
    title: 'Họ và Tên',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Loại',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
  },
];

const HomePage = () => {
  return (
    <AdminLayout headerName="Dashboard">
      <Layout.Content style={{ padding: '24px' }}>
        {/* Thẻ thống kê */}
        <Row gutter={[16, 16]}>
          {cardData.map((card, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card bordered={false} style={{ textAlign: 'center' }}>
                <h3>{card.title}</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{card.count}</p>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Biểu đồ thống kê */}
        <Card bordered={false} style={{ marginTop: '24px' }}>
          <h3>Thống kê hàng tháng</h3>
          <Line
            data={chartData}
            xField="month"
            yField="value"
            point={{ size: 5, shape: 'circle' }}
            color="#1890ff"
          />
        </Card>

        {/* Bảng dữ liệu chi tiết */}
        <Card bordered={false} style={{ marginTop: '24px' }}>
          <h3>Yêu cầu hướng dẫn gần đây</h3>
          <Table columns={columns} dataSource={tableData} pagination={{ pageSize: 5 }} />
        </Card>
      </Layout.Content>
    </AdminLayout>
  );
};

export default HomePage;

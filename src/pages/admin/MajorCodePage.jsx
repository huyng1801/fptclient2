import React, { useState } from 'react';
import { Button, Table, Modal, Form, Input, message, Layout } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'; // Import icons
import AdminLayout from '../../layouts/AdminLayout';

const MajorCodePage = () => {
  // Sample data
  const initialMajorCodes = [
    { MajorId: 1, MajorName: 'Khoa học Máy tính' },
    { MajorId: 2, MajorName: 'Kỹ thuật Điện' },
    { MajorId: 3, MajorName: 'Kỹ thuật Cơ khí' },
    { MajorId: 4, MajorName: 'Kỹ thuật Xây dựng' },
    { MajorId: 5, MajorName: 'Kỹ thuật Cơ điện tử' },
    { MajorId: 6, MajorName: 'Khoa học Môi trường' },
    { MajorId: 7, MajorName: 'Kỹ thuật Nhiệt' },
    { MajorId: 8, MajorName: 'Kỹ thuật Công nghệ thông tin' },
    { MajorId: 9, MajorName: 'Quản trị Kinh doanh' },
    { MajorId: 10, MajorName: 'Marketing' },
    // Add more data as needed
  ];

  const [majorCodes, setMajorCodes] = useState(initialMajorCodes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMajorCode, setEditingMajorCode] = useState(null);
  const [form] = Form.useForm();

  // Open modal to add or edit
  const openModal = (majorCode = null) => {
    setEditingMajorCode(majorCode);
    if (majorCode) {
      form.setFieldsValue({
        ...majorCode,
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Handle save (add or edit)
  const handleSaveMajorCode = async () => {
    try {
      const values = await form.validateFields();

      if (editingMajorCode) {
        // Update existing major code
        setMajorCodes((prevCodes) =>
          prevCodes.map((code) =>
            code.MajorId === editingMajorCode.MajorId ? { ...code, ...values } : code
          )
        );
        message.success('Cập nhật mã ngành thành công');
      } else {
        // Add new major code
        const newMajorCode = { MajorId: majorCodes.length + 1, ...values }; // Generate new ID
        setMajorCodes((prevCodes) => [...prevCodes, newMajorCode]);
        message.success('Thêm mã ngành thành công');
      }

      setIsModalOpen(false);
      setEditingMajorCode(null);
    } catch (error) {
      message.error('Lưu mã ngành thất bại');
    }
  };

  // Handle delete major code
  const handleDeleteMajorCode = (MajorId) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa mã ngành này?',
      onOk: () => {
        setMajorCodes(majorCodes.filter((code) => code.MajorId !== MajorId));
        message.success('Xóa mã ngành thành công');
      },
    });
  };

  // Columns configuration for the table
  const columns = [
    { title: 'ID', dataIndex: 'MajorId', key: 'MajorId' },
    { title: 'Tên Ngành', dataIndex: 'MajorName', key: 'MajorName' },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="default"
            shape="circle"
            icon={<EditOutlined />} // Use Edit icon
            onClick={() => openModal(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            type="default"
            shape="circle"
            icon={<DeleteOutlined />} // Use Delete icon
            danger
            onClick={() => handleDeleteMajorCode(record.MajorId)}
          />
        </>
      ),
    },
  ];

  return (
    <AdminLayout headerName="Ngành học">
      <Layout.Content style={{ padding: '24px' }}>
        <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 16 }}>
          Thêm Mã Ngành
        </Button>
        <Table
          columns={columns}
          dataSource={majorCodes}
          rowKey="MajorId"
        />

        {/* Modal for Add/Edit */}
        <Modal
          title={editingMajorCode ? 'Chỉnh sửa Mã Ngành' : 'Thêm Mã Ngành'}
          visible={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={handleSaveMajorCode}
          okText={editingMajorCode ? 'Cập nhật' : 'Thêm'}
          destroyOnClose
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="MajorId"
              label="ID Ngành"
              rules={[{ required: true, message: 'Vui lòng nhập ID Ngành' }]}
            >
              <Input disabled={editingMajorCode !== null} />
            </Form.Item>
            <Form.Item
              name="MajorName"
              label="Tên Ngành"
              rules={[{ required: true, message: 'Vui lòng nhập Tên Ngành' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Layout.Content>
    </AdminLayout>
  );
};

export default MajorCodePage;

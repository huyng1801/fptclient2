import React, { useState, useEffect } from 'react';
import { Layout, Button, Modal, Form, Input, message, Table } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import MajorCodeService from '../../services/MajorCodeService';

const { Content } = Layout;

const MajorCodePage = () => {
  const [majorCodes, setMajorCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMajorCode, setEditingMajorCode] = useState(null);
  const [form] = Form.useForm();

  const fetchMajorCodes = async () => {
    try {
      setLoading(true);
      const response = await MajorCodeService.getAllMajorCodes();
      setMajorCodes(response.items || []);
    } catch (error) {
      message.error('Không thể tải danh sách mã ngành');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMajorCodes();
  }, []);

  const openModal = (majorCode = null) => {
    setEditingMajorCode(majorCode);
    if (majorCode) {
      form.setFieldsValue({
        majorName: majorCode.majorName
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSaveMajorCode = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingMajorCode) {
        await MajorCodeService.updateMajorCode(editingMajorCode.majorId, values);
        message.success('Cập nhật mã ngành thành công');
      } else {
        await MajorCodeService.createMajorCode(values);
        message.success('Thêm mã ngành thành công');
      }

      setIsModalOpen(false);
      setEditingMajorCode(null);
      form.resetFields();
      fetchMajorCodes();
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại');
    }
  };

  const handleDeleteMajorCode = (majorId) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa mã ngành này?',
      content: 'Hành động này không thể hoàn tác',
      onOk: async () => {
        try {
          await MajorCodeService.deleteMajorCode(majorId);
          message.success('Xóa mã ngành thành công');
          fetchMajorCodes();
        } catch (error) {
          message.error('Không thể xóa mã ngành');
        }
      }
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'majorId', key: 'majorId' },
    { title: 'Tên Ngành', dataIndex: 'majorName', key: 'majorName' },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="default"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            type="default"
            shape="circle"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteMajorCode(record.majorId)}
          />
        </>
      ),
    },
  ];

  return (
    <AdminLayout headerName="Ngành học">
      <Content style={{ padding: '24px' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => openModal()}
          style={{ marginBottom: 16 }}
        >
          Thêm Mã Ngành
        </Button>

        <Table
          columns={columns}
          dataSource={majorCodes}
          rowKey="majorId"
          loading={loading}
        />

        <Modal
          title={editingMajorCode ? 'Chỉnh sửa Mã Ngành' : 'Thêm Mã Ngành'}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={handleSaveMajorCode}
          okText={editingMajorCode ? 'Cập nhật' : 'Thêm'}
          destroyOnClose
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="majorName"
              label="Tên Ngành"
              rules={[{ required: true, message: 'Vui lòng nhập tên ngành' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </AdminLayout>
  );
};

export default MajorCodePage;
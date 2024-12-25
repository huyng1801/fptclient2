import React, { useState, useEffect } from 'react';
import { Modal, List, Card, Button, Spin, Empty } from 'antd';
import CVService from '../../services/CVService';

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

  return (
    <Modal
      title="Chọn CV của bạn"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin />
        </div>
      ) : cvList.length > 0 ? (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={cvList}
          renderItem={(cv) => (
            <List.Item>
              <Card hoverable>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4>{cv.fullName}</h4>
                    <p>{cv.jobLevel} • {cv.primaryDuties}</p>
                    <p>{cv.email} • {cv.phone}</p>
                  </div>
                  <Button type="primary" onClick={() => onSelect(cv)}>
                    Chọn CV này
                  </Button>
                </div>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Empty
          description="Bạn chưa có CV nào. Vui lòng tạo CV trước khi ứng tuyển."
          style={{ margin: '20px 0' }}
        >
          <Button type="primary" href="/cv/">
            Tạo CV mới
          </Button>
        </Empty>
      )}
    </Modal>
  );
};
export default CVSelectionModal;

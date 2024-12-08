import React from 'react';
import { Row, Col, Typography } from 'antd';

const { Text } = Typography;

const copyrightStyle = {
  textAlign: 'center',
  color: '#fff',
  opacity: 0.8,
  fontSize: '14px'
};

function Copyright() {
  return (
    <Row justify="center">
      <Col>
        <Text style={copyrightStyle}>
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </Text>
      </Col>
    </Row>
  );
}

export default Copyright;
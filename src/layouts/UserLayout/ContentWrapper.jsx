import React from 'react';
import { Layout } from 'antd';
import Header from '../../components/Header/Header';
import FooterComponent from '../../components/Footer/FooterComponent';
import layoutStyles from './styles';

const { Content } = Layout;

function ContentWrapper({ collapsed, children }) {
  return (
    <Layout style={layoutStyles.contentWrapper(collapsed)}>
      <Header />
      
      <Content style={layoutStyles.contentContainer}>
        <div style={layoutStyles.content}>
          {children}
        </div>
      </Content>

      <FooterComponent />
    </Layout>
  );
}

export default ContentWrapper;
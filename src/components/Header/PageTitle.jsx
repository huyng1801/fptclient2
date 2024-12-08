import React from 'react';

const PageTitle = ({ title }) => (
  <div style={{
    fontWeight: 'bold',
    fontSize: '18px',
    textTransform: 'capitalize',
    color: '#FFB400'
  }}>
    {title}
  </div>
);

export default PageTitle;
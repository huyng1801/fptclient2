import React from 'react';

const PageTitle = ({ title }) => (
  <div style={{
    fontWeight: 'bold',
    fontSize: '18px',
    textTransform: 'capitalize',
    color: '#f05123'
  }}>
    {title}
  </div>
);

export default PageTitle;
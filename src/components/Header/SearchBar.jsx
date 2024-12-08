import React from 'react';
import { Input } from 'antd';

const SearchBar = ({ value, onChange }) => (
  <div style={{
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    padding: '0 20px'
  }}>
    <Input
      placeholder="Search..."
      value={value}
      onChange={onChange}
      style={{
        width: '60%',
        borderRadius: '8px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
      }}
    />
  </div>
);

export default SearchBar;
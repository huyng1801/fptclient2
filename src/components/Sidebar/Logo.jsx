import React from 'react';

const logoContainerStyle = {
  height: "80px",
  margin: "16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  transition: "all 0.3s ease",
};

const logoImageStyle = {
  width: "48px",
  height: "48px",
  borderRadius: "12px",
  transition: "all 0.3s ease",
  filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
};

function Logo() {
  return (
    <div style={logoContainerStyle}>
      <img
        src="/assets/images/logo.png"
        alt="Logo"
        style={logoImageStyle}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      />
    </div>
  );
}

export default Logo;
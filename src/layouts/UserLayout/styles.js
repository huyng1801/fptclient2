const layoutStyles = {
    mainLayout: {
      minHeight: "100vh",
      transition: "all 0.2s ease",
    },
    
    contentWrapper: (collapsed) => ({
      marginLeft: collapsed ? "80px" : "260px",
      transition: "all 0.2s ease",
    }),
    
    contentContainer: {
      margin: "16px",
      transition: "all 0.2s ease",
    },
    
    content: {
      padding: "24px",
      minHeight: "360px",
      borderRadius: "8px",
      transition: "all 0.2s ease",
    },
  };
  
  export default layoutStyles;
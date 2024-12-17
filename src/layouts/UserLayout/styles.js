const layoutStyles = {
  mainLayout: {
    minHeight: "100vh",
    transition: "all 0.2s ease",
  },

  contentWrapper: (isSidebarHidden, collapsed) => ({
    marginLeft: isSidebarHidden ? "0" : collapsed ? "80px" : "260px",
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
    backgroundColor: "#fff", // Optional: Add a background for visibility
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
};

export default layoutStyles;

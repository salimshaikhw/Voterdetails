export default function Loader({ message = "Loading..." }) {
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center",
      padding: "60px 20px",
      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      borderRadius: "16px",
      minHeight: "300px",
      border: "2px solid #e2e8f0"
    }}>
      <div style={{
        width: "60px",
        height: "60px",
        border: "4px solid #e0e7ff",
        borderTop: "4px solid #2563eb",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }}></div>
      <p style={{ 
        marginTop: "24px", 
        fontSize: "16px", 
        color: "#6b7280",
        fontWeight: "600",
        letterSpacing: "0.5px"
      }}>
        {message}
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

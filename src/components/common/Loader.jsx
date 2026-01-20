export default function Loader({ message = "Loading..." }) {
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center",
      padding: "60px 20px",
      background: "#f9f9f9",
      borderRadius: "8px",
      minHeight: "300px"
    }}>
      <div style={{
        width: "50px",
        height: "50px",
        border: "5px solid #f3f3f3",
        borderTop: "5px solid #007bff",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }}></div>
      <p style={{ 
        marginTop: "20px", 
        fontSize: "16px", 
        color: "#666",
        fontWeight: "500"
      }}>
        {message}
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

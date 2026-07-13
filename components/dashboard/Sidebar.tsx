export default function Sidebar() {
  const menus = [
    "🏠 Dashboard",
    "💰 Cash Flow",
    "📈 Investments",
    "🏡 House",
    "📅 RSU",
    "🎯 Goals",
    "📊 Reports",
    "⚙️ Settings",
  ];

  return (
    <div
      style={{
        width: "250px",
        background: "#1E293B",
        color: "white",
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      <h2 style={{ marginBottom: "40px" }}>
        Yeom Family
      </h2>

      {menus.map((menu) => (
        <div
          key={menu}
          style={{
            padding: "14px",
            borderRadius: "10px",
            marginBottom: "10px",
            cursor: "pointer",
          }}
        >
          {menu}
        </div>
      ))}
    </div>
  );
}
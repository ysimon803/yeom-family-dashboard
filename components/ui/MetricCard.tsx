type MetricCardProps = {
  title: string;
  value: string;
};

export default function MetricCard({
  title,
  value,
}: MetricCardProps) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h3>{title}</h3>

      <h1
        style={{
          color: "#1D4ED8",
          fontSize: "32px",
        }}
      >
        {value}
      </h1>
    </div>
  );
}
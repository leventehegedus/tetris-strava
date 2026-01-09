export const StatItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="flex flex-col">
    <span>{label}:</span>
    <span>{value}</span>
  </div>
);

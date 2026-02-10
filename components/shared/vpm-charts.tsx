type Props = {
  data: number[];
  color?: string;
};

export default function WpmChart({
  data,
  color = "#facc15",
}: Props) {
  const max = Math.max(...data, 10);

  return (
    <svg viewBox="0 0 300 100" className="w-full h-24">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={data
          .map((v, i) => {
            const x = (i / (data.length - 1 || 1)) * 300;
            const y = 100 - (v / max) * 100;
            return `${x},${y}`;
          })
          .join(" ")}
      />
    </svg>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "green" | "purple" | "yellow" | "gray" | "red";
}

const variantMap = {
  green:  "bg-green-50 text-green-700 border-green-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
  gray:   "bg-gray-100 text-gray-600 border-gray-200",
  red:    "bg-red-50 text-red-600 border-red-200",
};

export default function Badge({ children, variant = "gray" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${variantMap[variant]}`}>
      {children}
    </span>
  );
}

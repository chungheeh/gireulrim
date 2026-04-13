interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-lg" };

export default function Avatar({ name, src, size = "md" }: AvatarProps) {
  const initials = name.slice(0, 1);
  const colors = ["bg-green-100 text-green-700", "bg-purple-100 text-purple-700", "bg-yellow-100 text-yellow-700", "bg-blue-100 text-blue-700", "bg-pink-100 text-pink-700"];
  const color = colors[name.charCodeAt(0) % colors.length];

  if (src) {
    return <img src={src} alt={name} className={`${sizeMap[size]} rounded-full object-cover`} />;
  }
  return (
    <div className={`${sizeMap[size]} ${color} flex shrink-0 items-center justify-center rounded-full font-semibold`}>
      {initials}
    </div>
  );
}

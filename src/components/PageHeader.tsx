interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur-sm">
      <div>
        <h1 className="text-lg font-bold tracking-tight text-gray-900">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </header>
  );
}

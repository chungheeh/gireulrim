import BottomNav from "@/components/BottomNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-white">
      <main className="flex-1 overflow-y-auto pb-16">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

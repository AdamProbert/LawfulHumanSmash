import BottomNav from "@/components/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="book-shell">
      <div className="book">
        {/* The turning content */}
        <div className="book-stage">{children}</div>

        {/* Fixed ornamental frame, never moves */}
        <div className="book-frame" aria-hidden />

        {/* Chapter selector */}
        <BottomNav />
      </div>
    </div>
  );
}

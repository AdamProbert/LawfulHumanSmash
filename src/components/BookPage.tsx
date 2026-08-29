import { ReactNode } from "react";

/**
 * A single full-screen "page" within a BookChapter.
 * Content is centred and, as a graceful fallback on very small screens,
 * may scroll vertically, but the intent is one screenful per page.
 */
export default function BookPage({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`book-page ${className}`}>
      <div className="book-page-inner">{children}</div>
    </div>
  );
}

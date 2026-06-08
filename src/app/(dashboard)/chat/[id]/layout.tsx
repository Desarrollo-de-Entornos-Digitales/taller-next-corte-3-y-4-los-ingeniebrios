export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden fixed"
      style={{ top: '80px', left: 0, right: 0, bottom: 0 }}
    >
      {children}
    </div>
  );
}
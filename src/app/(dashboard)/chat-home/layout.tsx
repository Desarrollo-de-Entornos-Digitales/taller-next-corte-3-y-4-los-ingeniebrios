export default function ChatHomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
      {children}
    </div>
  );
}

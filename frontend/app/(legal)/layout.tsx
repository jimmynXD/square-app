export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex-grow py-8 px-4">{children}</div>;
}

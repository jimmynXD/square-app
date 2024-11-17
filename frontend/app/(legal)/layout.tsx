export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex-grow pt-24 pb-8 px-4">{children}</div>;
}

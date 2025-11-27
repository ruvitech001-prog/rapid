export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout removes the default sidebar for a full-screen form experience
  return <>{children}</>;
}

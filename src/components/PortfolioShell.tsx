import PortfolioClientEffects from "@/components/PortfolioClientEffects";

export default function PortfolioShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen bg-bg text-text">
      <PortfolioClientEffects />
      {children}
    </div>
  );
}

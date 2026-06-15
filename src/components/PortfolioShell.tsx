import ClientOnlyCustomCursor from "@/components/ClientOnlyCustomCursor";
import PortfolioClientEffects from "@/components/PortfolioClientEffects";

export default function PortfolioShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div id="home" className="relative min-h-screen bg-bg text-text">
      <PortfolioClientEffects />
      <ClientOnlyCustomCursor />
      {children}
    </div>
  );
}

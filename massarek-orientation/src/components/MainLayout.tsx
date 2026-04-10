import { ReactNode } from "react";
import Footer from "./Footer";
import LandingNavbar from "./LandingNavbar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => (
  <div className="min-h-screen flex flex-col bg-background text-foreground">
    <LandingNavbar />
    <main className="flex-1 w-full pt-24">{children}</main>
    <Footer />
  </div>
);

export default MainLayout;

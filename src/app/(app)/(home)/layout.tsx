import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicNavbar />
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
};

export default Layout;
